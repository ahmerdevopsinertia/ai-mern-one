'use client';
import { useState } from 'react';
import type { NextPage } from 'next';

interface StudentAnalysis {
	under_performing: string[];
	subject_analysis: Record<string, {
		class_avg?: number;
		critical_students: Array<{
			student: string;
			avg_score: number;
			last_3_avg: number;
		}>;
		recommendations?: string[];
	}>;
	model_metrics?: {
		feature_importances: Record<string, number>;
	};
	analysis_metadata?: {
		method_used: string;
	};
}

const YearlyAnalysisPage: NextPage = () => {
	const [year, setYear] = useState<number>(2024);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [result, setResult] = useState<StudentAnalysis | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch('http://localhost:3001/api/analysis/yearly/kmeans', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ year }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: StudentAnalysis = await response.json();
			setResult(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Student Performance Analysis (KMeans Technique)</h1>

			<form onSubmit={handleSubmit} className="mb-8">
				<div className="flex gap-4">
					<input
						type="number"
						value={year}
						onChange={(e) => setYear(Number(e.target.value))}
						min="2000"
						max="2100"
						className="border rounded px-3 py-2 w-32"
						required
					/>
					<button
						type="submit"
						disabled={isLoading}
						className={`bg-blue-600 text-white px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
							}`}
					>
						{isLoading ? 'Analyzing...' : 'Run Analysis'}
					</button>
				</div>
			</form>

			{error && (
				<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
					{error}
				</div>
			)}

			{result && (
				<div className="space-y-8">
					{/* Under-performing Students */}
					<section className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">🚨 Under-Performing Students</h2>
						{result.under_performing.length > 0 ? (
							<ul className="list-disc pl-5 space-y-1">
								{result.under_performing.map((student) => (
									<li key={student} className="text-xl font-extrabold mb-4 text-red-600">
										{student}
									</li>
								))}
							</ul>
						) : (
							<p className="text-gray-500">No under-performing students found</p>
						)}
					</section>

					{/* Subject-wise Analysis */}
					<section className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">📊 Subject-Wise Analysis</h2>
						{Object.entries(result.subject_analysis).map(([subject, data]) => (
							<div key={subject} className="mb-6 last:mb-0">
								<h3 className="text-lg font-extrabold mb-2 capitalize">{subject}</h3>
								<div className="ml-4">
									<div>
										<h4 className="font-medium text-gray-700 mb-2">Class Avg:</h4>
										<p className="font-extrabold text-gray-700 mb-2">{data.class_avg}</p>
										</div>
									
								</div>
								<div className="ml-4">
									<h4 className="font-medium text-gray-700 mb-2">Critical Students:</h4>
									{data.critical_students.length > 0 ? (
										<ul className="list-disc pl-5 mb-3 space-y-1">
											{data.critical_students.map(({ student, avg_score, last_3_avg }) => (
												<><li key={student} className="font-extrabold text-gray-700 mb-2">
													{/* {student} (Avg: {last_3_avg.toFixed(1)}) */}
													{
														`${student} (Avg: ${avg_score.toFixed(1)})`
													}
												</li>

												</>
											))}
										</ul>
									) : (
										<p className="text-gray-500 mb-3">No critical cases</p>
									)}

									{/* <h4 className="font-medium text-gray-700 mb-2">Recommendations:</h4>
									<ul className="list-disc pl-5 space-y-1">
										{data?.recommendations?.map((item, idx) => (
											<li key={idx} className="text-green-700">
												{item}
											</li>
										))}
									</ul> */}
								</div>
							</div>
						))}
					</section>

					{/* Model Insights (if available) */}
					{/* {result.model_metrics && (
						<section className="bg-white p-6 rounded-lg shadow">
							<h2 className="text-xl font-semibold mb-4">🤖 AI Model Insights</h2>
							<div className="space-y-2">
								<p className="font-medium">Key Performance Factors:</p>
								<ul className="list-disc pl-5">
									{Object.entries(result.model_metrics.feature_importances).map(
										([factor, importance]) => (
											<li key={factor}>
												<span className="capitalize">{factor}</span>: {(importance * 100).toFixed(1)}%
											</li>
										)
									)}
								</ul>
							</div>
						</section>
					)} */}

					{/* Model Insights (if available) */}
					{result.analysis_metadata && (
						<section className="bg-white p-6 rounded-lg shadow">
							<h2 className="text-xl font-semibold mb-4">🤖 AI Model Insights</h2>
							<div className="space-y-2">
								<p className="font-medium">Method: {result?.analysis_metadata?.method_used}</p>
							</div>
						</section>
					)}
				</div>
			)}
		</div>
	);
};

export default YearlyAnalysisPage;