// frontend/src/pages/ProblemPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProblemById, submitSolution } from '../store/ProblemSlice';

const ProblemPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProblem, loading, submissionResult } = useSelector((state) => state.problems);
  const { user } = useSelector((state) => state.auth);
  
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);

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
    await dispatch(submitSolution({ problemId: id, code, language }));
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>
        Loading problem...
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>
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
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', background: '#0a0a0a', minHeight: '100vh' }}>
      <Link to="/" style={{ color: '#6c63ff', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
        ← Back to Problems
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Problem Description */}
        <div style={{ background: '#1a1a2e', padding: '24px', borderRadius: '12px', border: '1px solid #2a2a4a' }}>
          <h2 style={{ color: '#fff' }}>{currentProblem.title}</h2>
          <span style={{ color: getDifficultyColor(currentProblem.difficulty), fontWeight: '600' }}>
            {currentProblem.difficulty}
          </span>
          <div style={{ marginTop: '12px' }}>
            {currentProblem.tags?.map(tag => (
              <span key={tag} style={{
                padding: '2px 10px',
                background: '#2a2a4a',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#aaa',
                marginRight: '8px'
              }}>
                {tag}
              </span>
            ))}
          </div>
          <p style={{ marginTop: '16px', color: '#ccc', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
            {currentProblem.description}
          </p>
          
          <h4 style={{ marginTop: '20px', color: '#aaa' }}>Example Test Cases:</h4>
          {currentProblem.publicTestCases?.map((test, idx) => (
            <div key={idx} style={{ 
              background: '#0a0a1a', 
              padding: '12px', 
              borderRadius: '8px',
              marginTop: '8px'
            }}>
              <div style={{ color: '#888' }}><strong>Input:</strong> <span style={{ color: '#fff' }}>{test.input}</span></div>
              <div style={{ color: '#888' }}><strong>Output:</strong> <span style={{ color: '#00b894' }}>{test.expectedOutput}</span></div>
            </div>
          ))}
        </div>

        {/* Code Editor */}
        <div style={{ background: '#1a1a2e', padding: '24px', borderRadius: '12px', border: '1px solid #2a2a4a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#fff' }}>Solution</h3>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                padding: '6px 12px',
                background: '#0a0a1a',
                border: '1px solid #2a2a4a',
                borderRadius: '6px',
                color: '#fff'
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
              width: '100%',
              height: '350px',
              padding: '16px',
              background: '#0a0a1a',
              border: '1px solid #2a2a4a',
              borderRadius: '8px',
              color: '#fff',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'vertical',
              tabSize: 2,
              lineHeight: '1.6'
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              marginTop: '16px',
              padding: '12px 24px',
              background: submitting ? '#555' : '#6c63ff',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: '600',
              fontSize: '16px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Solution'}
          </button>

          {submissionResult && (
            <div style={{ marginTop: '16px', padding: '16px', background: '#0a0a1a', borderRadius: '8px' }}>
              <h4 style={{ color: submissionResult.passed ? '#00b894' : '#e17055' }}>
                {submissionResult.passed ? '✅ Passed!' : '❌ Failed'}
              </h4>
              <p style={{ color: '#ccc' }}>
                Passed: {submissionResult.testCaseCount?.passed || 0} / {submissionResult.testCaseCount?.total || 0}
              </p>
              {submissionResult.error && <p style={{ color: '#e17055' }}>Error: {submissionResult.error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;