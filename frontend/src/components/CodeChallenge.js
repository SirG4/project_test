import { useState } from 'react';
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

export default function CodeChallenge() {
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [language, setLanguage] = useState('python');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const rollDiceAndGetQuestion = async () => {
    const diceRoll = Math.floor(Math.random() * 100) + 1;
    const mockQuestion = {
      id: diceRoll,
      title: `Problem #${diceRoll}: Sum of Two Numbers`,
      description: 'Write a function that takes two integers and returns their sum.',
      testCases: [
        { input: [2, 3], output: 5 },
        { input: [-1, 1], output: 0 },
        { input: [0, 0], output: 0 },
      ]
    };
    setQuestion(mockQuestion);
    setCode(DEFAULT_CODE[language]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/submit-code', {
        code,
        language,
        questionId: question?.id
      });

      if (response.data.success) {
        setResults(response.data);
      } else {
        setError(response.data.error || 'Submission failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header & Dice Roll */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">DSA Code Challenge</h1>
          <button
            onClick={rollDiceAndGetQuestion}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Roll 100-Sided Dice & Get Question
          </button>
        </div>

        {/* Question Display */}
        {question && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4">{question.title}</h2>
            <p className="text-gray-700 mb-4">{question.description}</p>
            <div className="text-sm text-gray-600">
              <p>Test Cases: {question.testCases.length}</p>
            </div>
          </div>
        )}

        {/* Code Editor */}
        {question && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setCode(DEFAULT_CODE[e.target.value]);
                }}
                className="p-2 border rounded"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                {loading ? 'Submitting...' : 'Submit Code'}
              </button>
            </div>

            <Editor
              height="500px"
              language={language}
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                tabSize: 2,
              }}
            />
          </div>
        )}

        {/* Results Display */}
        {results && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">
              {results.isCorrect ? '✅ Correct Answer!' : '❌ Incorrect Answer'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Execution Output:</p>
                <pre className="bg-gray-50 p-4 rounded">{results.output}</pre>
              </div>
              
              {results.error && (
                <div className="text-red-600">
                  <p className="font-semibold">Error:</p>
                  <pre className="bg-red-50 p-4 rounded">{results.error}</pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-100 p-4 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
