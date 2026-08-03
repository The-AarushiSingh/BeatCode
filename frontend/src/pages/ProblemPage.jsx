// frontend/src/pages/ProblemPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProblemById, submitSolution } from '../store/ProblemSlice';
import { logout } from '../store/authSlice';
import AIHelper from '../components/AIHelper';

const ProblemPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProblem, loading, submissionResult } = useSelector((state) => state.problems);
  const { user } = useSelector((state) => state.auth);
  
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getProblemById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProblem?.codeTemplates?.length > 0) {
      const template = currentProblem.codeTemplates.find(t => t.language === language);
      if (template) {
        setCode(template.code);
      }
    }
  }, [currentProblem, language]);

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
      case 'Easy': return '#00b894';
      case 'Medium': return '#fdcb6e';
      case 'Hard': return '#e17055';
      default: return '#888';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a', 
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        background: '#1a1a2e',
        borderBottom: '1px solid #2a2a4a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ color: '#6c63ff', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          ⚡ BeatCode
        </Link>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: '#aaa' }}>{user?.firstName || 'User'}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 16px',
              background: '#e17055',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Logout
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
            background: '#1a1a2e', 
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid #2a2a4a',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{currentProblem.title}</h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: getDifficultyColor(currentProblem.difficulty), fontWeight: '600' }}>
                {currentProblem.difficulty}
              </span>
              {currentProblem.tags?.map(tag => (
                <span key={tag} style={{
                  padding: '2px 10px',
                  background: '#2a2a4a',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#aaa'
                }}>
                  {tag}
                </span>
              ))}
            </div>
            
            <div style={{ 
              color: '#ccc', 
              lineHeight: '1.8',
              whiteSpace: 'pre-wrap',
              borderTop: '1px solid #2a2a4a',
              paddingTop: '16px'
            }}>
              {currentProblem.description}
            </div>
            
            <h4 style={{ marginTop: '20px', color: '#aaa' }}>Example Test Cases:</h4>
            {currentProblem.publicTestCases?.map((test, idx) => (
              <div key={idx} style={{ 
                background: '#0a0a1a', 
                padding: '12px', 
                borderRadius: '8px',
                marginTop: '8px'
              }}>
                <div><span style={{ color: '#888' }}>Input:</span> <span style={{ color: '#fff' }}>{test.input}</span></div>
                <div><span style={{ color: '#888' }}>Output:</span> <span style={{ color: '#00b894' }}>{test.expectedOutput}</span></div>
              </div>
            ))}
          </div>

          {/* Right: Code Editor */}
          <div style={{ 
            background: '#1a1a2e', 
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid #2a2a4a',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#fff' }}>Write Your Solution</h3>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  padding: '6px 12px',
                  background: '#0a0a1a',
                  border: '1px solid #2a2a4a',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                {currentProblem.codeTemplates?.map(t => (
                  <option key={t.language} value={t.language}>{t.language}</option>
                ))}
              </select>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                flex: 1,
                minHeight: '300px',
                padding: '16px',
                background: '#0a0a1a',
                border: '1px solid #2a2a4a',
                borderRadius: '8px',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '14px',
                resize: 'vertical',
                tabSize: 2,
                lineHeight: '1.6',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6c63ff'}
              onBlur={(e) => e.target.style.borderColor = '#2a2a4a'}
            />

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                marginTop: '16px',
                padding: '12px 24px',
                background: submitting ? '#555' : 'linear-gradient(135deg, #6c63ff, #5a52d5)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontWeight: '600',
                fontSize: '16px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!submitting) e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {submitting ? '⏳ Submitting...' : '🚀 Submit Solution'}
            </button>

            {showResult && submissionResult && (
              <div style={{ 
                marginTop: '16px', 
                padding: '16px', 
                background: '#0a0a1a', 
                borderRadius: '8px',
                border: `1px solid ${submissionResult.passed ? '#00b894' : '#e17055'}`
              }}>
                <h4 style={{ color: submissionResult.passed ? '#00b894' : '#e17055', marginBottom: '8px' }}>
                  {submissionResult.passed ? '✅ All Tests Passed!' : '❌ Some Tests Failed'}
                </h4>
                <div style={{ color: '#ccc' }}>
                  <div>Passed: <span style={{ color: '#00b894' }}>{submissionResult.testCaseCount?.passed || 0}</span> / {submissionResult.testCaseCount?.total || 0}</div>
                </div>
                {submissionResult.error && (
                  <div style={{ color: '#e17055', marginTop: '8px', fontSize: '14px' }}>
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