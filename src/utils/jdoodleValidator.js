// src/utils/jdoodleValidator.js
const axios = require('axios');

// Your JDoodle credentials
const JDOODLE_CLIENT_ID = '480fc0e9d523bde7aeb4faba9bd98536';
const JDOODLE_CLIENT_SECRET = 'ace40737894766c1587a7ccc795ed270c353b301b56a45198dd3cd0d5b12a288';

// Map your language names to JDoodle's format
function mapToJdoodleLanguage(language) {
  const map = {
    'javascript': 'nodejs',
    'js': 'nodejs',
    'python': 'python3',
    'py': 'python3',
    'cpp': 'cpp17',
    'c++': 'cpp17',
    'java': 'java',
    'go': 'go',
    'rust': 'rust',
    'ruby': 'ruby'
  };
  return map[language.toLowerCase()] || 'nodejs';
}

function getFileExtension(language) {
  const map = {
    'javascript': 'js',
    'js': 'js',
    'python': 'py',
    'py': 'py',
    'cpp': 'cpp',
    'c++': 'cpp',
    'java': 'java',
    'go': 'go',
    'rust': 'rs',
    'ruby': 'rb'
  };
  return map[language.toLowerCase()] || 'txt';
}

function buildTestHarness(code, language, testCases, template = '') {
  const harnesses = {
    javascript: `
      // Template code (if any)
      ${template}
      
      // User's solution
      ${code}
      
      // Test runner
      function runTests() {
        const testCases = ${JSON.stringify(testCases, null, 2)};
        const results = [];
        
        for (let i = 0; i < testCases.length; i++) {
          try {
            const test = testCases[i];
            // Parse input
            const lines = test.input.split('\\n').filter(line => line.trim() !== '');
            const args = lines.map(line => {
              const values = line.split(' ').map(v => {
                const num = Number(v);
                return isNaN(num) ? v : num;
              });
              return values.length === 1 ? values[0] : values;
            });
            
            // Call solution function
            if (typeof solution !== "function") {
              throw new Error("Function 'solution' is not defined");
            }
            
            const result = solution(...args);
            
            // Compare output
            const output = Array.isArray(result) ? result.join(' ') : String(result);
            const expected = test.expectedOutput.trim();
            const passed = output.trim() === expected;
            
            results.push({
              testCase: i + 1,
              input: test.input,
              expectedOutput: expected,
              actualOutput: output.trim(),
              passed,
              error: null
            });
          } catch (err) {
            results.push({
              testCase: i + 1,
              input: testCases[i].input,
              expectedOutput: testCases[i].expectedOutput.trim(),
              actualOutput: null,
              passed: false,
              error: err.message || 'Runtime error'
            });
          }
        }
        
        console.log(JSON.stringify(results));
      }
      
      runTests();
    `,
    
    python: `
      # Template code (if any)
      ${template}
      
      # User's solution
      ${code}
      
      # Test runner
      import json
      
      test_cases = ${JSON.stringify(testCases)}
      results = []
      
      for i, test in enumerate(test_cases):
          try:
              # Parse input
              lines = test['input'].strip().split('\\n')
              parsed_input = []
              for line in lines:
                  values = line.split()
                  parsed_values = []
                  for v in values:
                      try:
                          parsed_values.append(int(v))
                      except ValueError:
                          try:
                              parsed_values.append(float(v))
                          except ValueError:
                              parsed_values.append(v)
                  if len(parsed_values) == 1:
                      parsed_input.append(parsed_values[0])
                  else:
                      parsed_input.append(parsed_values)
              
              # Call solution function
              result = solution(*parsed_input)
              
              # Compare output
              if isinstance(result, list):
                  output = ' '.join(str(x) for x in result)
              else:
                  output = str(result)
              
              expected = test['expectedOutput'].strip()
              passed = output.strip() == expected
              
              results.append({
                  'testCase': i + 1,
                  'input': test['input'],
                  'expectedOutput': expected,
                  'actualOutput': output.strip(),
                  'passed': passed,
                  'error': None
              })
          except Exception as e:
              results.append({
                  'testCase': i + 1,
                  'input': test['input'],
                  'expectedOutput': test['expectedOutput'].strip(),
                  'actualOutput': None,
                  'passed': False,
                  'error': str(e)
              })
      
      print(json.dumps(results))
    `
  };
  
  return harnesses[language] || harnesses.javascript;
}

async function validateWithJDoodle({ code, language, testCases, template = '' }) {
  console.log(`🔍 Validating ${language} solution with JDoodle...`);
  
  try {
    // Build the complete code with test harness
    const fullCode = buildTestHarness(code, language, testCases, template);
    const jdoodleLanguage = mapToJdoodleLanguage(language);
    
    console.log(`📤 Sending to JDoodle: ${jdoodleLanguage}`);
    
    const response = await axios.post(
      'https://api.jdoodle.com/v1/execute',
      {
        clientId: JDOODLE_CLIENT_ID,
        clientSecret: JDOODLE_CLIENT_SECRET,
        script: fullCode,
        language: jdoodleLanguage,
        versionIndex: '0',
        stdin: ''
      },
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`📥 JDoodle responded with status: ${response.status}`);

    const result = response.data;
    
    // Check for errors
    if (result.error) {
      console.error('❌ JDoodle error:', result.error);
      return {
        allPassed: false,
        results: [],
        executionTime: 0,
        error: result.error,
        output: result.output || ''
      };
    }

    // Check if there was a runtime error
    if (result.output && result.output.includes('Error')) {
      return {
        allPassed: false,
        results: [],
        executionTime: result.cpuTime || 0,
        error: result.output,
        output: result.output
      };
    }

    // Parse test results from output
    try {
      const testResults = JSON.parse(result.output.trim());
      const allPassed = testResults.every(t => t.passed);
      
      return {
        allPassed,
        results: testResults,
        executionTime: result.cpuTime || 0,
        error: null,
        output: result.output
      };
    } catch (parseError) {
      console.error('❌ Parse error:', parseError.message);
      console.log('Raw output:', result.output);
      
      // If output isn't JSON, check if it's a success message
      if (result.output && result.output.includes('passed')) {
        return {
          allPassed: true,
          results: testCases.map((test, index) => ({
            testCase: index + 1,
            passed: true,
            error: null
          })),
          executionTime: result.cpuTime || 0,
          error: null,
          output: result.output
        };
      }
      
      return {
        allPassed: false,
        results: [],
        executionTime: result.cpuTime || 0,
        error: 'Failed to parse test results',
        output: result.output || ''
      };
    }
    
  } catch (error) {
    console.error('❌ JDoodle API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
    return {
      allPassed: false,
      results: [],
      executionTime: 0,
      error: `JDoodle API error: ${error.message}`
    };
  }
}

module.exports = { validateWithJDoodle, mapToJdoodleLanguage, getFileExtension, buildTestHarness };