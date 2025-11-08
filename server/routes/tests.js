const express = require('express');
const router = express.Router();

// Mock test generation (we'll add OpenAI later)
router.post('/generate', (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    // Mock test cases
    const tests = [
      {
        name: `should test ${topic} with ${difficulty} difficulty`,
        code: `test('${topic}', () => {\n  expect(factorial(5)).toBe(120);\n});`
      },
      {
        name: `should handle edge cases for ${topic}`,
        code: `test('${topic} edge case', () => {\n  expect(factorial(0)).toBe(1);\n});`
      }
    ];

    res.json({ tests });
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: 'Failed to generate tests' });
  }
});

module.exports = router;


