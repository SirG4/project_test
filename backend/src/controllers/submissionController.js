const apiClient = require('../utils/apiClient');

const createSubmission = async (req, res) => {
  try {
    const response = await apiClient.post('/submissions', {
      // submission data
      source_code: req.body.source_code,
      language_id: req.body.language_id,
      // ... other submission parameters
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data || 'Internal server error' 
    });
  }
};

module.exports = {
  createSubmission
};
