// frontend/src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProblems } from '../store/ProblemSlice';
import { logout } from '../store/authSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const { problems, loading } = useSelector((state) => state.problems);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getProblems());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const filteredProblems = problems?.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <Link to="/" style={{ color: '#6c63ff', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
          ⚡ BeatCode
        </Link>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: '#aaa' }}>Welcome, {user?.firstName || 'User'}!</span>
          {user?.role === 'admin' && (
            <Link to="/admin" style={{
              padding: '6px 16px',
              background: '#6c63ff',
              borderRadius: '6px',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Admin Panel
            </Link>
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 16px',
              background: '#e17055',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Search */}
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="🔍 Search problems by title or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: '#1a1a2e',
              border: '1px solid #2a2a4a',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '15px',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#6c63ff'}
            onBlur={(e) => e.target.style.borderColor = '#2a2a4a'}
          />
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            padding: '12px 20px',
            background: '#1a1a2e',
            borderRadius: '10px',
            border: '1px solid #2a2a4a'
          }}>
            <span style={{ color: '#888' }}>Total Problems: </span>
            <span style={{ color: '#6c63ff', fontWeight: 'bold' }}>{problems?.length || 0}</span>
          </div>
          <div style={{
            padding: '12px 20px',
            background: '#1a1a2e',
            borderRadius: '10px',
            border: '1px solid #2a2a4a'
          }}>
            <span style={{ color: '#888' }}>Solved: </span>
            <span style={{ color: '#00b894', fontWeight: 'bold' }}>
              {user?.problemSolved?.length || 0}
            </span>
          </div>
        </div>

        {/* Problem List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
            Loading problems...
          </div>
        ) : filteredProblems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
            {searchTerm ? 'No problems found matching your search' : 'No problems available yet'}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredProblems.map((problem) => (
              <Link
                key={problem._id}
                to={`/problem/${problem._id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '18px 24px',
                  background: '#1a1a2e',
                  border: '1px solid #2a2a4a',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#fff',
                  transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(6px)';
                  e.currentTarget.style.borderColor = '#6c63ff';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(108, 99, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.borderColor = '#2a2a4a';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <h3 style={{ marginBottom: '6px', fontSize: '18px' }}>{problem.title}</h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {problem.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: '2px 10px',
                          background: '#2a2a4a',
                          borderRadius: '12px',
                          fontSize: '12px',
                          color: '#aaa'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {problem.tags?.length > 3 && (
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        +{problem.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      color: getDifficultyColor(problem.difficulty),
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    {problem.difficulty}
                  </span>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {problem.submissions || 0} submissions
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;