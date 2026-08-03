// frontend/src/components/AIHelper.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AIHelper = ({ problemId, code, language }) => {
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState('');
  const [review, setReview] = useState('');
  const [explanation, setExplanation] = useState('');
  const [activeTab, setActiveTab] = useState('hint');
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token');

  const getHint = async () => {
    setLoading(true);
    setError('');
    setHint('');
    try {
      const token = getToken();
      const response = await axios.post(
        `http://localhost:3000/api/problems/${problemId}/hint`,
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHint(response.data.hint || 'No hint available');
    } catch (err) {
      setError(err.response?.data?.error || 'Error getting hint. Please try again.');
    }
    setLoading(false);
  };

  const getReview = async () => {
    setLoading(true);
    setError('');
    setReview('');
    try {
      const token = getToken();
      const response = await axios.post(
        `http://localhost:3000/api/problems/${problemId}/review`,
        { code, language },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReview(response.data.review || 'No review available');
    } catch (err) {
      setError(err.response?.data?.error || 'Error getting review. Please try again.');
    }
    setLoading(false);
  };

  const getExplanation = async () => {
    setLoading(true);
    setError('');
    setExplanation('');
    try {
      const token = getToken();
      const response = await axios.get(
        `http://localhost:3000/api/problems/${problemId}/explanation`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExplanation(response.data.explanation || 'No explanation available');
    } catch (err) {
      setError(err.response?.data?.error || 'Please solve the problem first to get an explanation.');
    }
    setLoading(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'hint' && !hint) getHint();
    if (tab === 'review' && !review) getReview();
    if (tab === 'explanation' && !explanation) getExplanation();
  };

  return (
    <div style={{
      marginTop: '20px',
      padding: '20px',
      background: '#1a1a2e',
      borderRadius: '12px',
      border: '1px solid #2a2a4a'
    }}>
      <h4 style={{ color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🤖 AI Assistant
        {loading && <span style={{ fontSize: '14px', color: '#888' }}>⏳ Thinking...</span>}
      </h4>
      
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <button
          onClick={() => handleTabChange('hint')}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: activeTab === 'hint' ? '#fdcb6e' : 'transparent',
            border: activeTab === 'hint' ? 'none' : '1px solid #2a2a4a',
            borderRadius: '8px',
            color: activeTab === 'hint' ? '#0a0a0a' : '#aaa',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s'
          }}
        >
          💡 Hint
        </button>
        
        <button
          onClick={() => handleTabChange('review')}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: activeTab === 'review' ? '#6c63ff' : 'transparent',
            border: activeTab === 'review' ? 'none' : '1px solid #2a2a4a',
            borderRadius: '8px',
            color: activeTab === 'review' ? '#fff' : '#aaa',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s'
          }}
        >
          📝 Code Review
        </button>
        
        <button
          onClick={() => handleTabChange('explanation')}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: activeTab === 'explanation' ? '#00b894' : 'transparent',
            border: activeTab === 'explanation' ? 'none' : '1px solid #2a2a4a',
            borderRadius: '8px',
            color: activeTab === 'explanation' ? '#fff' : '#aaa',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s'
          }}
        >
          📖 Explanation
        </button>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          background: 'rgba(255, 107, 107, 0.1)',
          border: '1px solid #e17055',
          borderRadius: '8px',
          color: '#e17055',
          marginBottom: '12px'
        }}>
          {error}
        </div>
      )}

      {activeTab === 'hint' && hint && (
        <div style={{
          padding: '16px',
          background: '#0a0a1a',
          borderRadius: '8px',
          border: '1px solid #fdcb6e'
        }}>
          <p style={{ color: '#fdcb6e', fontWeight: '600', marginBottom: '8px' }}>💡 AI Hint</p>
          <p style={{ color: '#ddd', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{hint}</p>
        </div>
      )}

      {activeTab === 'review' && review && (
        <div style={{
          padding: '16px',
          background: '#0a0a1a',
          borderRadius: '8px',
          border: '1px solid #6c63ff'
        }}>
          <p style={{ color: '#6c63ff', fontWeight: '600', marginBottom: '8px' }}>📝 AI Code Review</p>
          <p style={{ color: '#ddd', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{review}</p>
        </div>
      )}

      {activeTab === 'explanation' && explanation && (
        <div style={{
          padding: '16px',
          background: '#0a0a1a',
          borderRadius: '8px',
          border: '1px solid #00b894'
        }}>
          <p style={{ color: '#00b894', fontWeight: '600', marginBottom: '8px' }}>📖 AI Explanation</p>
          <p style={{ color: '#ddd', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{explanation}</p>
        </div>
      )}

      {loading && (
        <div style={{ padding: '16px', textAlign: 'center', color: '#888' }}>
          ⏳ AI is thinking...
        </div>
      )}
    </div>
  );
};

export default AIHelper;