// frontend/src/pages/ProblemPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProblemById, submitSolution } from '../store/ProblemSlice';
import { logout } from '../store/authSlice';
import AIHelper from '../components/AIHelper';
import Editor from '@monaco-editor/react';

const ProblemPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProblem, loading, submissionResult } = useSelector((state) => state.problems);
  const { user } = useSelector((state) => state.auth);
  
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const editorRef = useRef(null);

  // ✅ Available languages (fallback if no templates)
  const AVAILABLE_LANGUAGES = ['javascript', 'python', 'java', 'cpp', 'go', 'rust'];

  // ✅ Helper function - define at component level
  const getDefaultBoilerplate = (lang) => {
  const templates = {
    'javascript': `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function solution(nums, target) {
    // Write your solution here
    
}`,
    'python': `from typing import List

def solution(nums: List[int], target: int) -> List[int]:
    # Write your solution here
    pass`,
    'java': `class Solution {
    public int[] solution(int[] nums, int target) {
        // Write your solution here
        
    }
}`,
    'cpp': `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        // Write your solution here
        
    }
};`,
    'go': `package main

func solution(nums []int, target int) []int {
    // Write your solution here
    
}`,
    'rust': `impl Solution {
    pub fn solution(nums: Vec<i32>, target: i32) -> Vec<i32> {
        // Write your solution here
        
    }
}`
  };
  return templates[lang] || '// Write your solution here';
};

  useEffect(() => {
    if (id) {
      dispatch(getProblemById(id));
    }
  }, [dispatch, id]);

  // ✅ Set code when problem loads or language changes
  useEffect(() => {
    if (currentProblem) {
      // Check if there are code templates
      const templates = currentProblem.codeTemplates || [];
      
      // Find template for current language
      const template = templates.find(t => t.language === language);
      
      if (template && template.code) {
        setCode(template.code);
      } else {
        // Use default boilerplate
        setCode(getDefaultBoilerplate(language));
      }
      
      // ✅ If no templates exist, set language to javascript
      if (templates.length === 0 && language !== 'javascript') {
        setLanguage('javascript');
      }
    }
  }, [currentProblem, language]);

  // ✅ Get available languages from problem or use defaults
  const getAvailableLanguages = () => {
    if (currentProblem?.codeTemplates?.length > 0) {
      return currentProblem.codeTemplates.map(t => t.language);
    }
    return AVAILABLE_LANGUAGES;
  };

  // ✅ Format language name for display
  const formatLanguageName = (lang) => {
    const names = {
      'javascript': 'JavaScript',
      'js': 'JavaScript',
      'python': 'Python',
      'py': 'Python',
      'cpp': 'C++',
      'c++': 'C++',
      'java': 'Java',
      'go': 'Go',
      'rust': 'Rust',
      'ruby': 'Ruby'
    };
    return names[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: true,
      smoothScrolling: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setShowResult(false);
    const result = await dispatch(submitSolution({ problemId: id, code, language }));
    setSubmitting(false);
    setShowResult(true);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const getLanguageForEditor = (lang) => {
    const map = {
      'javascript': 'javascript',
      'js': 'javascript',
      'python': 'python',
      'py': 'python',
      'cpp': 'cpp',
      'c++': 'cpp',
      'java': 'java',
      'go': 'go',
      'rust': 'rust',
      'ruby': 'ruby'
    };
    return map[lang] || 'javascript';
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0a0a0a',
        color: '#fff'
      }}>
        Loading...
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0a0a0a',
        color: '#fff'
      }}>
        Problem not found
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#22c55e';
      case 'Medium': return '#eab308';
      case 'Hard': return '#ef4444';
      default: return '#6b6b6b';
    }
  };

  const availableLanguages = getAvailableLanguages();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a', 
      color: '#fff',
      fontFamily: 'Inter, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 32px',
        background: 'rgba(20, 20, 20, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(108, 99, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ 
          color: '#fff', 
          textDecoration: 'none', 
          fontSize: '22px', 
          fontWeight: '800',
          background: 'linear-gradient(135deg, #6c63ff 0%, #a78bfa 50%, #4f46e5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          BeatCode
        </Link>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: '#8b8b8b' }}>{user?.firstName || 'User'}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 16px',
              background: 'transparent',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              color: '#8b8b8b',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#ef4444';
              e.target.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#2a2a2a';
              e.target.style.color = '#8b8b8b';
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <Link to="/" style={{ color: '#6c63ff', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
          ← Back to Problems
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Left: Problem Description */}
          <div style={{ 
            background: 'rgba(20, 20, 20, 0.8)',
            backdropFilter: 'blur(10px)',
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid rgba(108, 99, 255, 0.1)',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{currentProblem.title}</h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{ color: getDifficultyColor(currentProblem.difficulty), fontWeight: '600' }}>
                {currentProblem.difficulty}
              </span>
              {currentProblem.tags?.map(tag => (
                <span key={tag} style={{
                  padding: '2px 10px',
                  background: 'rgba(42, 42, 42, 0.6)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#8b8b8b'
                }}>
                  {tag}
                </span>
              ))}
            </div>
            
            <div style={{ 
              color: '#ccc', 
              lineHeight: '1.8',
              whiteSpace: 'pre-wrap',
              borderTop: '1px solid #2a2a2a',
              paddingTop: '16px'
            }}>
              {currentProblem.description}
            </div>
            
            <h4 style={{ marginTop: '20px', color: '#8b8b8b' }}>Example Test Cases:</h4>
            {currentProblem.publicTestCases?.map((test, idx) => (
              <div key={idx} style={{ 
                background: 'rgba(10, 10, 10, 0.6)', 
                padding: '12px', 
                borderRadius: '8px',
                marginTop: '8px',
                border: '1px solid #2a2a2a'
              }}>
                <div><span style={{ color: '#6b6b6b' }}>Input:</span> <span style={{ color: '#fff' }}>{test.input}</span></div>
                <div><span style={{ color: '#6b6b6b' }}>Output:</span> <span style={{ color: '#22c55e' }}>{test.expectedOutput}</span></div>
              </div>
            ))}
          </div>

          {/* Right: Monaco Editor */}
          <div style={{ 
            background: 'rgba(20, 20, 20, 0.8)',
            backdropFilter: 'blur(10px)',
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid rgba(108, 99, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#fff' }}>Solution</h3>
              
              {/* ✅ FIXED: Language Dropdown */}
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  padding: '8px 14px',
                  background: 'rgba(10, 10, 10, 0.8)',
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  minWidth: '120px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#6c63ff'}
                onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
              >
                {availableLanguages.length > 0 ? (
                  availableLanguages.map(lang => (
                    <option key={lang} value={lang}>
                      {formatLanguageName(lang)}
                    </option>
                  ))
                ) : (
                  <option value="javascript">JavaScript</option>
                )}
              </select>
            </div>

            {/* Monaco Editor */}
            <div style={{ 
              flex: 1, 
              minHeight: '400px',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#1e1e1e'
            }}>
              <Editor
                height="400px"
                language={getLanguageForEditor(language)}
                value={code}
                onChange={setCode}
                theme="vs-dark"
                onMount={handleEditorDidMount}
                options={{
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollbar: {
                    vertical: 'visible',
                    horizontal: 'visible',
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                  },
                  padding: { top: 16, bottom: 16 },
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: true,
                  smoothScrolling: true,
                  bracketPairColorization: { enabled: true },
                  renderWhitespace: 'selection',
                  formatOnPaste: true,
                  formatOnType: true,
                  suggestOnTriggerCharacters: true,
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                marginTop: '16px',
                padding: '14px',
                background: submitting ? '#2a2a2a' : 'linear-gradient(135deg, #6c63ff 0%, #4f46e5 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontWeight: '600',
                fontSize: '15px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: submitting ? 'none' : '0 4px 20px rgba(108, 99, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 30px rgba(108, 99, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(108, 99, 255, 0.2)';
                }
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Solution'}
            </button>

            {showResult && submissionResult && (
              <div style={{ 
                marginTop: '16px', 
                padding: '16px', 
                background: 'rgba(10, 10, 10, 0.6)',
                borderRadius: '10px',
                border: `1px solid ${submissionResult.passed ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
              }}>
                <h4 style={{ color: submissionResult.passed ? '#22c55e' : '#ef4444', marginBottom: '8px' }}>
                  {submissionResult.passed ? '✅ All Tests Passed!' : '❌ Some Tests Failed'}
                </h4>
                <div style={{ color: '#ccc' }}>
                  <div>Passed: <span style={{ color: '#22c55e' }}>{submissionResult.testCaseCount?.passed || 0}</span> / {submissionResult.testCaseCount?.total || 0}</div>
                </div>
                {submissionResult.error && (
                  <div style={{ color: '#ef4444', marginTop: '8px', fontSize: '14px' }}>
                    Error: {submissionResult.error}
                  </div>
                )}
              </div>
            )}

            <AIHelper 
              problemId={id} 
              code={code} 
              language={language} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;