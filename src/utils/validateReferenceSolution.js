// validateReferenceSolution.js
// const validateUtils = require("../utils/validate")
const axios = require("axios");

async function validateReferenceSolution({
  code,
  language,
  testCases,
  template = "",
}) {
  const fullCode = buildTestHarness(code, language, testCases, template);
  const pistonLanguage = mapToPistonLanguage(language);

  try {
    console.log(`📤 Sending to Piston: ${pistonLanguage}`);
    
    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: pistonLanguage,
        version: "*",
        files: [
          {
            name: `solution.${getFileExtension(language)}`,
            content: fullCode,
          },
        ],
        stdin: "",           // ✅ ADD THIS - required field
        args: [],            // ✅ ADD THIS - required field
        run_timeout: 5000,   // ✅ ADD THIS
        compile_timeout: 10000, // ✅ ADD THIS
        run_memory_limit: -1, // ✅ ADD THIS
        compile_memory_limit: -1, // ✅ ADD THIS
      },
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`📥 Piston responded with status: ${response.status}`);

    const result = response.data;
    
    if (!result.run) {
      throw new Error("Invalid Piston response");
    }

    if (result.run.code !== 0) {
      return {
        allPassed: false,
        results: [],
        executionTime: result.run.time || 0,
        error: result.run.stderr || "Runtime error",
        output: result.run.stdout || "",
      };
    }

    // Parse JSON output from test harness
    try {
      const testResults = JSON.parse(result.run.stdout);
      const allPassed = testResults.every((t) => t.passed);

      return {
        allPassed,
        results: testResults,
        executionTime: result.run.time || 0,
        error: null,
        output: result.run.stdout,
      };
    } catch (parseError) {
      console.error("❌ Parse error:", parseError.message);
      console.log("Raw output:", result.run.stdout);
      
      return {
        allPassed: false,
        results: [],
        executionTime: result.run.time || 0,
        error: "Invalid test output format",
        output: result.run.stdout,
      };
    }
  } catch (error) {
    console.error("❌ Piston API Error:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received");
    } else {
      console.error("Error:", error.message);
    }

    if (error.code === "ECONNABORTED") {
      return {
        allPassed: false,
        results: [],
        executionTime: 0,
        error: "Execution timeout - Piston API took too long",
      };
    }

    return {
      allPassed: false,
      results: [],
      executionTime: 0,
      error: `Piston API error: ${error.message}`,
    };
  }
}

function buildTestHarness(code, language, testCases, template) {
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
            // Parse input based on problem format
            const inputLines = test.input.split('\\n').filter(line => line.trim() !== '');
            const args = inputLines.map(line => {
              const values = line.split(' ').map(v => {
                const num = Number(v);
                return isNaN(num) ? v : num;
              });
              return values.length === 1 ? values[0] : values;
            });
            
            // Call solution function (expecting a function named 'solution')
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
        
        process.stdout.write(JSON.stringify(results));
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
    `,
  };

  return harnesses[language] || harnesses.javascript;
}

function mapToPistonLanguage(language) {
  const map = {
    javascript: "javascript",
    js: "javascript",
    python: "python",
    py: "python",
    cpp: "cpp",
    "c++": "cpp",
    java: "java",
    go: "go",
    rust: "rust",
    ruby: "ruby",
  };
  return map[language.toLowerCase()] || language.toLowerCase();
}

function getFileExtension(language) {
  const map = {
    javascript: "js",
    python: "py",
    cpp: "cpp",
    java: "java",
    go: "go",
    rust: "rs",
    ruby: "rb",
  };
  return map[language.toLowerCase()] || "txt";
}

module.exports = {
  validateReferenceSolution,
  buildTestHarness,
  mapToPistonLanguage,
  getFileExtension
};
