// src/services/aiService.js
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// AI Hint Generator
async function generateHint(problemTitle, problemDescription, userCode = null) {
  try {
    const prompt = `
You are an AI coding tutor helping a student solve a programming problem.

Problem: ${problemTitle}
Description: ${problemDescription}
${userCode ? `User's current code:\n${userCode}` : ''}

Provide a helpful hint (not the full solution) to guide the student toward solving this problem. Be encouraging and educational. Keep it under 100 words.
`;

    const response = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [
        { role: 'system', content: 'You are a helpful coding tutor. Provide hints, not complete solutions.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return {
      success: true,
      hint: response.choices[0].message.content.trim()
    };
  } catch (error) {
    console.error('AI Hint Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// AI Code Review
async function reviewCode(code, language, problemTitle) {
  try {
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

    const response = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [
        { role: 'system', content: 'You are an expert code reviewer. Provide detailed, constructive feedback.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.5,
    });

    return {
      success: true,
      review: response.choices[0].message.content.trim()
    };
  } catch (error) {
    console.error('AI Review Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// AI Solution Explanation
async function explainSolution(problemTitle, problemDescription, solutionCode, language) {
  try {
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

    const response = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [
        { role: 'system', content: 'You are an expert coding instructor explaining solutions clearly.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.5,
    });

    return {
      success: true,
      explanation: response.choices[0].message.content.trim()
    };
  } catch (error) {
    console.error('AI Explanation Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get personalized problem recommendation
async function recommendProblem(userStats, availableProblems) {
  try {
    const prompt = `
Based on this user's stats, recommend the next problem they should solve:
- Problems solved: ${userStats.solvedCount || 0}
- Current skill level: ${userStats.level || 'beginner'}

Available problems: ${availableProblems.map(p => `${p.title} (${p.difficulty})`).join(', ')}

Recommend one problem and explain why in 2-3 sentences.
`;

    const response = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [
        { role: 'system', content: 'You are a learning advisor recommending coding problems.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return {
      success: true,
      recommendation: response.choices[0].message.content.trim()
    };
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  generateHint,
  reviewCode,
  explainSolution,
  recommendProblem
};