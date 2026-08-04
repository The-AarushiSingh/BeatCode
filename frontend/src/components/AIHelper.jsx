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
      setError(err.response?.data?.error || 'Error getting hint');
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
      setError(err.response?.data?.error || 'Error getting review');
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
      setError(err.response?.data?.error || 'Solve the problem first');
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
      background: 'rgba(20, 20, 20, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      border: '1px solid rgba(108, 99, 255, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '16px',
        borderBottom: '1px solid rgba(108, 99, 255, 0.1)',
        paddingBottom: '16px'
      }}>
        <button
          onClick={() => handleTabChange('hint')}
          disabled={loading}
          style={{
            padding: '8px 18px',
            background: activeTab === 'hint' ? 'linear-gradient(135deg, #6c63ff 0%, #4f46e5 100%)' : 'transparent',
            border: activeTab === 'hint' ? 'none' : '1px solid #2a2a2a',
            borderRadius: '8px',
            color: activeTab === 'hint' ? '#ffffff' : '#8b8b8b',
            fontSize: '13px',
            fontWeight: activeTab === 'hint' ? '500' : '400',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'hint' ? '0 2px 12px rgba(108, 99, 255, 0.2)' : 'none'
          }}
        >
          Hint
        </button>
        
        <button
          onClick={() => handleTabChange('review')}
          disabled={loading}
          style={{
            padding: '8px 18px',
            background: activeTab === 'review' ? 'linear-gradient(135deg, #6c63ff 0%, #4f46e5 100%)' : 'transparent',
            border: activeTab === 'review' ? 'none' : '1px solid #2a2a2a',
            borderRadius: '8px',
            color: activeTab === 'review' ? '#ffffff' : '#8b8b8b',
            fontSize: '13px',
            fontWeight: activeTab === 'review' ? '500' : '400',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'review' ? '0 2px 12px rgba(108, 99, 255, 0.2)' : 'none'
          }}
        >
          Review
        </button>
        
        <button
          onClick={() => handleTabChange('explanation')}
          disabled={loading}
          style={{
            padding: '8px 18px',
            background: activeTab === 'explanation' ? 'linear-gradient(135deg, #6c63ff 0%, #4f46e5 100%)' : 'transparent',
            border: activeTab === 'explanation' ? 'none' : '1px solid #2a2a2a',
            borderRadius: '8px',
            color: activeTab === 'explanation' ? '#ffffff' : '#8b8b8b',
            fontSize: '13px',
            fontWeight: activeTab === 'explanation' ? '500' : '400',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'explanation' ? '0 2px 12px rgba(108, 99, 255, 0.2)' : 'none'
          }}
        >
          Explanation
        </button>
        
        {loading && (
          <span style={{ color: '#6b6b6b', fontSize: '13px', marginLeft: 'auto' }}>
            Loading...
          </span>
        )}
      </div>

      {error && (
        <div style={{
          padding: '10px 14px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          color: '#ef4444',
          fontSize: '13px',
          marginBottom: '12px'
        }}>
          {error}
        </div>
      )}

      {activeTab === 'hint' && hint && (
        <div style={{
          padding: '16px',
          background: 'rgba(10, 10, 10, 0.6)',
          borderRadius: '8px',
          border: '1px solid rgba(108, 99, 255, 0.15)'
        }}>
          <div style={{ color: '#6c63ff', fontSize: '11px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Hint
          </div>
          <p style={{ color: '#e0e0e0', margin: 0, lineHeight: '1.6', fontSize: '14px' }}>{hint}</p>
        </div>
      )}

      {activeTab === 'review' && review && (
        <div style={{
          padding: '16px',
          background: 'rgba(10, 10, 10, 0.6)',
          borderRadius: '8px',
          border: '1px solid rgba(108, 99, 255, 0.15)'
        }}>
          <div style={{ color: '#6c63ff', fontSize: '11px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Code Review
          </div>
          <p style={{ color: '#e0e0e0', margin: 0, lineHeight: '1.6', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
            {review}
          </p>
        </div>
      )}

      {activeTab === 'explanation' && explanation && (
        <div style={{
          padding: '16px',
          background: 'rgba(10, 10, 10, 0.6)',
          borderRadius: '8px',
          border: '1px solid rgba(108, 99, 255, 0.15)'
        }}>
          <div style={{ color: '#6c63ff', fontSize: '11px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Explanation
          </div>
          <p style={{ color: '#e0e0e0', margin: 0, lineHeight: '1.6', fontSize: '14px' }}>{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default AIHelper;