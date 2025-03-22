import React from 'react';
import CodeChallenge from './components/CodeChallenge';

function App() {
  const [status, setStatus] = React.useState('Checking connection...');

  React.useEffect(() => {
    // Test connection to backend
    fetch('http://localhost:3000/health')
      .then(response => response.json())
      .then(data => setStatus('Connected to backend'))
      .catch(error => setStatus('Failed to connect to backend'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Code Challenge Platform</h1>
          <p className="text-sm text-gray-600">{status}</p>
        </div>
      </div>
      <CodeChallenge />
    </div>
  );
}

export default App;