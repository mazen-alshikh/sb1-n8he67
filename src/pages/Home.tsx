import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import type { Question } from '../types';
import { searchQuestion } from '../lib/api';

export function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await searchQuestion(question);
      setAnswer(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get answer');
      setAnswer(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Islamic Knowledge Search
        </h1>
        <p className="text-lg text-gray-600">
          Ask questions and receive answers based on authentic Islamic sources
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your question..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            disabled={isLoading || !question.trim()}
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </form>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching for answer...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {answer && !isLoading && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Answer</h2>
          <p className="text-gray-700 mb-4">{answer.answer}</p>
          {answer.references && answer.references.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">References</h3>
              <ul className="space-y-2">
                {answer.references.map((ref, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {ref.metadata.book && `Book: ${ref.metadata.book}, `}
                    {ref.metadata.chapter && `Chapter: ${ref.metadata.chapter}, `}
                    {ref.metadata.verse && `Verse: ${ref.metadata.verse}, `}
                    {ref.metadata.page && `Page: ${ref.metadata.page}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}