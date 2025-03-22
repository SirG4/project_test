import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';

const DEFAULT_CODE = {
  c: '#include <stdio.h>\n\nint solution(int a, int b) {\n    // Your code here\n}',
  cpp: '#include <iostream>\nusing namespace std;\n\nint solution(int a, int b) {\n    // Your code here\n}',
  java: 'public class Solution {\n    public static int solution(int a, int b) {\n        // Your code here\n    }\n}',
  javascript: 'function solution(a, b) {\n    // Your code here\n}',
  python: 'def solution(a, b):\n    # Your code here',
};

const LANGUAGE_OPTIONS = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
];

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [status, setStatus] = useState('Ready');
  const [results, setResults] = useState(null);

  useEffect(() => {
    setCode(DEFAULT_CODE[language] || '');
  }, [language]);

  const handleSubmit = async () => {
    try {
      setStatus('Running...');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/submit`, 
        { code, language }
      );
      setResults(response.data);
      setStatus('Completed');
    } catch (error) {
      setResults({ 
        error: error.response?.data?.error || error.message 
      });
      setStatus('Error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <span className={`text-sm ${status === 'Error' ? 'text-red-600' : 'text-gray-600'}`}>
              {status}
            </span>
            </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Language Selector & Editor */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Language:
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="ml-2 px-3 py-1 border rounded-md"
                >
                  {LANGUAGE_OPTIONS.map(option => (
                    <option 
                      key={option.value} 
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            
            <div className="h-[400px] border rounded-lg overflow-hidden">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={status === 'Running...'}
              className={`mt-4 px-6 py-2 rounded-md ${
                status === 'Running...' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors`}
            >
              {status === 'Running...' ? 'Running...' : 'Submit Code'}
            </button>
          </div>

          {/* Results Panel */}
          {results && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-4">Execution Results</h3>
              <div className="space-y-3">
                {results.output && (
                  <div>
                    <p className="font-medium">Output:</p>
                    <pre className="bg-gray-50 p-4 rounded-md mt-1 whitespace-pre-wrap">
                      {results.output}
                    </pre>
                  </div>
                )}
                
                {results.error && (
                  <div>
                    <p className="font-medium text-red-600">Error:</p>
                    <pre className="bg-red-50 p-4 rounded-md mt-1 whitespace-pre-wrap text-red-700">
                      {results.error}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;