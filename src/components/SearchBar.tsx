import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return; // Prevent empty queries
    setLoading(true);
    setResponse(''); // Clear previous response

    try {
      // Send request to Flask backend
      const res = await fetch('https://python.phpnode.net/chat', {
        method: 'POST', // Using POST as expected by the backend
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: query }), // Pass user_input in the request body
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        // Response returned from the backend is contained in the key "response"
        setResponse(data.response || 'No response');
      } else {
        setResponse('Error: Could not fetch response from the server');
      }
    } catch (error) {
      // Cast error to an instance of Error
      if (error instanceof Error) {
        setResponse('Error: ' + error.message);
      } else {
        setResponse('Error: An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle input change event
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle key press event for the Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Ask Your AI Assistant
        </h1>
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            placeholder="Ask anything..."
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <div className="absolute inset-y-0 right-4 flex items-center">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
              Pro
            </span>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleSearch}
            className="bg-black hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-inner">
          {loading ? (
            <div className="flex justify-center items-center">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            </div>
          ) : (
            <p className="text-gray-800 dark:text-gray-200 text-center whitespace-pre-wrap">
              {response}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
