// src/testJDoodle.js
const { validateWithJDoodle } = require('./utils/jdoodleValidator');

async function testJDoodle() {
  console.log('🧪 Testing JDoodle API...\n');
  
  // Test with a simple JavaScript solution
  const testCode = `
    function solution(nums, target) {
      const map = new Map();
      for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
          return [map.get(complement), i];
        }
        map.set(nums[i], i);
      }
      return [];
    }
  `;
  
  const testCases = [
    {
      input: "2 7 11 15\n9",
      expectedOutput: "0 1"
    },
    {
      input: "3 2 4\n6",
      expectedOutput: "1 2"
    }
  ];
  
  const result = await validateWithJDoodle({
    code: testCode,
    language: 'javascript',
    testCases: testCases,
    template: ''
  });
  
  console.log('📊 Test Results:');
  console.log('All Passed:', result.allPassed);
  console.log('Execution Time:', result.executionTime, 'ms');
  console.log('Results:', JSON.stringify(result.results, null, 2));
  if (result.error) {
    console.log('Error:', result.error);
  }
}

testJDoodle();