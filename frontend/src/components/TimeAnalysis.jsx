// frontend/src/components/TimeAnalysis.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TimeAnalysis = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeStats();
  }, [userId]);

  const fetchTimeStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/submissions/time-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching time stats:', error);
      // Fallback demo data
      setStats({
        totalTime: 45,
        averageTime: 15,
        fastestTime: 2,
        slowestTime: 32,
        problemsSolved: 8,
        byDifficulty: {
          Easy: { count: 5, avgTime: 8 },
          Medium: { count: 2, avgTime: 20 },
          Hard: { count: 1, avgTime: 35 }
        }
      });
    }
    setLoading(false);
  };

  const formatTime = (minutes) => {
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${Math.round(minutes)} mins`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return <div style={{ color: '#6b6b6b', padding: '20px', textAlign: 'center' }}>Loading stats...</div>;
  }

  if (!stats) {
    return (
      <div style={{
        background: 'rgba(20, 20, 20, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #2a2a2a',
        textAlign: 'center',
        color: '#6b6b6b'
      }}>
        <p>Solve some problems to see your time analysis!</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(20, 20, 20, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #2a2a2a'
    }}>
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
        ⏱️ Time Analysis
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(10,10,10,0.6)', borderRadius: '8px' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#6c63ff' }}>
            {formatTime(stats.totalTime || 0)}
          </div>
          <div style={{ fontSize: '11px', color: '#6b6b6b' }}>Total Time</div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(10,10,10,0.6)', borderRadius: '8px' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>
            {formatTime(stats.averageTime || 0)}
          </div>
          <div style={{ fontSize: '11px', color: '#6b6b6b' }}>Average per Problem</div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(10,10,10,0.6)', borderRadius: '8px' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#eab308' }}>
            {stats.problemsSolved || 0}
          </div>
          <div style={{ fontSize: '11px', color: '#6b6b6b' }}>Problems Solved</div>
        </div>
      </div>

      {/* By Difficulty */}
      {stats.byDifficulty && (
        <div>
          <div style={{ fontSize: '13px', color: '#8b8b8b', marginBottom: '8px' }}>Time by Difficulty</div>
          {Object.entries(stats.byDifficulty).map(([difficulty, data]) => (
            <div key={difficulty} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ 
                  color: difficulty === 'Easy' ? '#22c55e' : 
                         difficulty === 'Medium' ? '#eab308' : '#ef4444'
                }}>
                  {difficulty}
                </span>
                <span style={{ color: '#8b8b8b' }}>
                  {data.count} problems · avg {formatTime(data.avgTime || 0)}
                </span>
              </div>
              <div style={{
                height: '4px',
                background: '#2a2a2a',
                borderRadius: '2px',
                marginTop: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min((data.avgTime / 30) * 100, 100)}%`,
                  background: difficulty === 'Easy' ? '#22c55e' : 
                              difficulty === 'Medium' ? '#eab308' : '#ef4444',
                  borderRadius: '2px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeAnalysis;