'use client';
import { useState } from 'react';

export default function ChatPage() {
	const [input, setInput] = useState('');
	const [messages, setMessages] = useState<Array<{
		sender: 'user' | 'bot';
		text: string;
		sources?: string[];
	}>>([]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		setMessages(prev => [...prev, { sender: 'user', text: input }]);
		setInput('');

		try {
			const res = await fetch('http://localhost:3001/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: input }),
			});
			const data = await res.json();

			setMessages(prev => [
				...prev,
				{
					sender: 'bot',
					text: data.reply,
					sources: data.sources
				},
			]);
		} catch (err) {
			alert('Error: ' + (err as Error).message);
		}
	};

	return (
		<div className="container mx-auto p-4">
			{/* Message display and form same as before */}
		</div>
	);
}