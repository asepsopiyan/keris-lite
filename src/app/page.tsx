'use client';
import { useState, useRef, useEffect } from 'react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    references?: Array<{
        file: string;
        idx: number;
        score?: number;
        chunk_size?: number;
    }>;
}

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Check system status on mount
    useEffect(() => {
        checkSystemStatus();
    }, []);

    const checkSystemStatus = async () => {
        try {
            const response = await fetch('http://localhost:6333/health');
            if (response.ok) {
                setIsConnected(true);
            }
        } catch {
            console.log('System not ready yet...');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMessage.content }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.answer,
                timestamp: new Date(),
                references: data.refs,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content:
                    'Maaf, terjadi kesalahan dalam memproses pertanyaan Anda. Pastikan sistem sudah siap dan coba lagi.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 dark:from-gray-900 to-indigo-100 dark:to-gray-800 min-h-screen">
            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 border-b">
                <div className="mx-auto px-4 py-4 max-w-4xl">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="flex justify-center items-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg w-8 h-8">
                                <span className="font-bold text-white text-sm">
                                    K
                                </span>
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 dark:text-white text-xl">
                                    KERIS-lite
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Sistem RAG Lokal untuk Dokumen Indonesia
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div
                                className={`w-2 h-2 rounded-full ${
                                    isConnected ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            ></div>
                            <span className="text-gray-600 dark:text-gray-400 text-xs">
                                {isConnected
                                    ? 'Sistem Siap'
                                    : 'Menghubungkan...'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Chat Area */}
            <main className="mx-auto px-4 py-6 max-w-4xl">
                <div className="flex flex-col bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl h-[600px]">
                    {/* Messages Container */}
                    <div className="flex-1 space-y-4 p-4 overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="py-12 text-center">
                                <div className="flex justify-center items-center bg-gradient-to-r from-blue-100 dark:from-blue-900/20 to-indigo-100 dark:to-indigo-900/20 mx-auto mb-4 rounded-full w-16 h-16">
                                    <svg
                                        className="w-8 h-8 text-blue-600 dark:text-blue-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white text-lg">
                                    Selamat Datang di KERIS-lite
                                </h3>
                                <p className="mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-400">
                                    Mulai bertanya tentang dokumen Anda. Sistem
                                    akan mencari informasi relevan dan
                                    memberikan jawaban yang akurat.
                                </p>
                                <div className="space-y-2 text-gray-500 dark:text-gray-400 text-sm">
                                    <p>💡 Contoh pertanyaan:</p>
                                    <ul className="space-y-1">
                                        <li>• &ldquo;Apa itu KERIS?&rdquo;</li>
                                        <li>
                                            • &ldquo;Bagaimana cara kerja sistem
                                            RAG?&rdquo;
                                        </li>
                                        <li>
                                            • &ldquo;Teknologi apa yang
                                            digunakan?&rdquo;
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        message.role === 'user'
                                            ? 'justify-end'
                                            : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                                            message.role === 'user'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                        }`}
                                    >
                                        <div className="whitespace-pre-wrap">
                                            {message.content}
                                        </div>
                                        {message.references &&
                                            message.references.length > 0 && (
                                                <div className="mt-3 pt-3 border-gray-200 dark:border-gray-600 border-t">
                                                    <p className="mb-1 font-medium text-gray-500 dark:text-gray-400 text-xs">
                                                        📚 Referensi Dokumen:
                                                    </p>
                                                    <div className="space-y-2">
                                                        {message.references.map(
                                                            (ref, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded-lg text-xs"
                                                                >
                                                                    <div className="flex justify-between items-start mb-1">
                                                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                                                            📄{' '}
                                                                            {
                                                                                ref.file
                                                                            }
                                                                        </span>
                                                                        {ref.score && (
                                                                            <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded font-mono text-blue-800 dark:text-blue-200 text-xs">
                                                                                Score:{' '}
                                                                                {ref.score.toFixed(
                                                                                    3
                                                                                )}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-gray-600 dark:text-gray-400">
                                                                        Chunk #
                                                                        {ref.idx +
                                                                            1}
                                                                        {ref.chunk_size && (
                                                                            <span className="ml-2 text-gray-500">
                                                                                (
                                                                                {
                                                                                    ref.chunk_size
                                                                                }{' '}
                                                                                chars)
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        <div
                                            className={`text-xs mt-2 ${
                                                message.role === 'user'
                                                    ? 'text-blue-100'
                                                    : 'text-gray-500 dark:text-gray-400'
                                            }`}
                                        >
                                            {formatTime(message.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex space-x-1">
                                            <div className="bg-gray-400 rounded-full w-2 h-2 animate-bounce"></div>
                                            <div
                                                className="bg-gray-400 rounded-full w-2 h-2 animate-bounce"
                                                style={{
                                                    animationDelay: '0.1s',
                                                }}
                                            ></div>
                                            <div
                                                className="bg-gray-400 rounded-full w-2 h-2 animate-bounce"
                                                style={{
                                                    animationDelay: '0.2s',
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                                            Memproses...
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-gray-200 dark:border-gray-700 border-t">
                        <form
                            onSubmit={handleSubmit}
                            className="flex space-x-3"
                        >
                            <div className="relative flex-1">
                                <textarea
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) =>
                                        setInputValue(e.target.value)
                                    }
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ketik pertanyaan Anda di sini... (Shift+Enter untuk baris baru)"
                                    className="dark:bg-gray-700 px-4 py-3 border border-gray-300 dark:border-gray-600 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 w-full dark:text-white resize-none"
                                    rows={1}
                                    disabled={isLoading}
                                    style={{
                                        minHeight: '48px',
                                        maxHeight: '120px',
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 px-6 py-3 rounded-lg font-medium text-white transition-colors duration-200"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                                <span>Tanya</span>
                            </button>
                        </form>
                        <div className="mt-2 text-gray-500 dark:text-gray-400 text-xs text-center">
                            Tekan Enter untuk mengirim, Shift+Enter untuk baris
                            baru
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-gray-600 dark:text-gray-400 text-sm text-center">
                    <p>
                        KERIS-lite - Sistem RAG Lokal | Powered by Ollama &
                        Qdrant
                    </p>
                    <p className="mt-1">
                        Dokumen tersedia:{' '}
                        <span className="font-medium">sample.txt</span>
                    </p>
                </div>
            </main>
        </div>
    );
}
