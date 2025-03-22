const express = require('express');
const router = express.Router();
const axios = require('axios');

const JUDGE0_URL = process.env.JUDGE0_URL || 'http://localhost:2358/submissions';
const JUDGE0_AUTH_TOKEN = process.env.JUDGE0_AUTH_TOKEN;

// Language ID mapping - extend as needed
const LANGUAGE_IDS = {
  'javascript': 63,
  'python': 71,
  'java': 62,
  'cpp': 54
};

router.post('/submit', async (req, res) => {
  try {
    const { code, language, questionId } = req.body;

    // 1. Get question from DB using questionId
    const question = await Question.findById(questionId);
    
    // 2. Wrap user code with test cases
    const wrappedCode = wrapCode(code, language, question.testCases);

    // 3. Submit to Judge0
    const submission = await axios.post(
      JUDGE0_URL,
      {
        source_code: wrappedCode,
        language_id: LANGUAGE_IDS[language] || 63, // Default to JavaScript if not found
        stdin: '',
        expected_output: question.expectedOutput,
        wait: true
      },
      {
        headers: {
          'X-Auth-Token': JUDGE0_AUTH_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    // 4. Process response
    const result = {
      status: submission.data.status?.description,
      output: submission.data.stdout,
      error: submission.data.stderr,
      isCorrect: submission.data.status?.id === 3
    };

    // Add compile error check
    if (submission.data.compile_output) {
      result.error = submission.data.compile_output;
    }

    // Add time limit exceeded check  
    if (submission.data.status?.id === 5) {
      result.error = 'Time Limit Exceeded';
    }

    res.json(result);
    
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Code execution failed' });
  }
});

function wrapCode(userCode, language, testCases) {
  switch (language) {
    case 'javascript':
      return `
        ${userCode}
        
        // Test cases
        const testCases = ${JSON.stringify(testCases)};
        testCases.forEach((test, index) => {
          const result = solution(...test.input);
          console.log(\`Test \${index + 1}: \${JSON.stringify(result) === JSON.stringify(test.expected) ? 'PASS' : 'FAIL'}\`);
        });`;
    // Add more language support as needed
    default:
      return userCode;
  }
}

module.exports = router;
