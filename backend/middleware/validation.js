const validateSubmission = (req, res, next) => {
  const { code, language, questionId } = req.body;

  if (!code || !language || !questionId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (typeof code !== 'string' || code.length > 50000) {
    return res.status(400).json({ error: 'Invalid code format or size' });
  }

  if (typeof questionId !== 'string' && typeof questionId !== 'number') {
    return res.status(400).json({ error: 'Invalid questionId format' });
  }

  next();
};

module.exports = {
  validateSubmission
};
