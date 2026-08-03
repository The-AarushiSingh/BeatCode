// frontend/src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProblems } from '../store/ProblemSlice';
import { logout } from '../store/authSlice'; // ✅ Changed from logoutUser to logout

const HomePage = () => {
  const dispatch = useDispatch();
  const { problems, loading } = useSelector((state) => state.problems);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getProblems());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout()); // ✅ Changed from logoutUser to logout
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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          background: 'linear-gradient(135deg, #6c63ff, #ff6b6b)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent' 
        }}>
          BeatCode
        </h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span>Welcome, {user?.firstName || 'User'}!</span>
          {user?.role === 'admin' && (
            <Link to="/admin" style={{ color: '#6c63ff', textDecoration: 'none' }}>
              Admin Panel
            </Link>
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: '#e17055',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#1a1a2e',
            border: '1px solid #2a2a4a',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '14px',
          }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading problems...</div>
      ) : filteredProblems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No problems found
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredProblems.map((problem) => (
            <Link
              key={problem._id}
              to={`/problem/${problem._id}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                background: '#1a1a2e',
                border: '1px solid #2a2a4a',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#fff',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.borderColor = '#6c63ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.borderColor = '#2a2a4a';
              }}
            >
              <div>
                <h3 style={{ marginBottom: '4px' }}>{problem.title}</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {problem.tags?.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: '2px 10px',
                        background: '#2a2a4a',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#aaa',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    color: getDifficultyColor(problem.difficulty),
                    fontWeight: '600',
                    fontSize: '14px',
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
  );
};

export default HomePage;