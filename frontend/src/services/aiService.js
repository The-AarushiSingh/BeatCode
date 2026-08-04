// src/services/aiService.js
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateAIResponse(prompt) {
  try {
    const response = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [
        { role: 'system', content: 'You are a helpful coding tutor. Provide clear, concise, and educational responses.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    return {
      success: true,
      content: response.choices[0].message.content.trim()
    };
  } catch (error) {
    console.error('AI Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function generateHint(problemTitle, problemDescription, userCode = null) {
  const prompt = `
You are an AI coding tutor helping a student solve a programming problem.

Problem: ${problemTitle}
Description: ${problemDescription}
${userCode ? `User's current code:\n${userCode}` : ''}

Provide a helpful hint (not the full solution) to guide the student toward solving this problem. Be encouraging and educational. Keep it under 100 words.
`;

  return await generateAIResponse(prompt);
}

async function reviewCode(code, language, problemTitle) {
  const prompt = `
You are an expert code reviewer. Review the following code for:
1. Correctness
2. Efficiency (time & space complexity)
3. Code quality (readability, naming, structure)
4. Potential bugs or edge cases

Problem: ${problemTitle}
Language: ${language}
Code:
\`\`\`${language}
${code}
\`\`\`

Provide constructive feedback with specific suggestions for improvement. Keep it concise.
`;

  return await generateAIResponse(prompt);
}

async function explainSolution(problemTitle, problemDescription, solutionCode, language) {
  const prompt = `
Explain the solution to this problem in simple terms.

Problem: ${problemTitle}
Description: ${problemDescription}

Solution Code (${language}):
\`\`\`${language}
${solutionCode}
\`\`\`

Explain:
1. The approach/strategy used
2. How the algorithm works step by step
3. Time and space complexity
4. Why this solution is correct

Keep it clear and educational, under 200 words.
`;

  return await generateAIResponse(prompt);
}

module.exports = {
  generateHint,
  reviewCode,
  explainSolution,
  generateAIResponse
};