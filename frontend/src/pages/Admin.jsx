// frontend/src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getProblems, createProblem, deleteProblem } from '../store/ProblemSlice';
import { logout } from '../store/authSlice';

const Admin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { problems, loading } = useSelector((state) => state.problems);
  const { user } = useSelector((state) => state.auth);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProblem, setNewProblem] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    tags: [],
    publicTestCases: [{ input: '', expectedOutput: '' }],
    referenceSolution: [{ language: 'javascript', completeCode: '' }]
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
    dispatch(getProblems());
  }, [dispatch, user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    const problemData = {
      ...newProblem,
      createdBy: user?.userId || 'admin'
    };
    await dispatch(createProblem(problemData));
    setShowCreateForm(false);
    setNewProblem({
      title: '',
      description: '',
      difficulty: 'Easy',
      tags: [],
      publicTestCases: [{ input: '', expectedOutput: '' }],
      referenceSolution: [{ language: 'javascript', completeCode: '' }]
    });
    dispatch(getProblems());
  };

  const handleDeleteProblem = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      await dispatch(deleteProblem(id));
      dispatch(getProblems());
    }
  };

  const addTestCase = () => {
    setNewProblem({
      ...newProblem,
      publicTestCases: [...newProblem.publicTestCases, { input: '', expectedOutput: '' }]
    });
  };

  const removeTestCase = (index) => {
    const testCases = [...newProblem.publicTestCases];
    testCases.splice(index, 1);
    setNewProblem({ ...newProblem, publicTestCases: testCases });
  };

  const updateTestCase = (index, field, value) => {
    const testCases = [...newProblem.publicTestCases];
    testCases[index][field] = value;
    setNewProblem({ ...newProblem, publicTestCases: testCases });
  };

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        background: '#1a1a2e',
        borderBottom: '1px solid #2a2a4a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#6c63ff', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
            ⚡ BeatCode
          </Link>
          <span style={{ color: '#ff6b6b', fontWeight: '600' }}>Admin Panel</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: '#aaa' }}>{user?.firstName || 'Admin'}</span>
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

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>📚 Manage Problems</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              padding: '10px 20px',
              background: '#6c63ff',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {showCreateForm ? 'Cancel' : '+ Create New Problem'}
          </button>
        </div>

        {/* Create Problem Form */}
        {showCreateForm && (
          <div style={{
            background: '#1a1a2e',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #2a2a4a',
            marginBottom: '24px'
          }}>
            <h3>Create New Problem</h3>
            <form onSubmit={handleCreateProblem}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#aaa', marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  value={newProblem.title}
                  onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#0a0a1a',
                    border: '1px solid #2a2a4a',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#aaa', marginBottom: '4px' }}>Description</label>
                <textarea
                  value={newProblem.description}
                  onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
                  required
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#0a0a1a',
                    border: '1px solid #2a2a4a',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#aaa', marginBottom: '4px' }}>Difficulty</label>
                <select
                  value={newProblem.difficulty}
                  onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#0a0a1a',
                    border: '1px solid #2a2a4a',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#aaa', marginBottom: '4px' }}>Tags (comma separated)</label>
                <input
                  type="text"
                  value={newProblem.tags.join(', ')}
                  onChange={(e) => setNewProblem({ 
                    ...newProblem, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                  })}
                  placeholder="Array, Hash Table, Two Pointers"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#0a0a1a',
                    border: '1px solid #2a2a4a',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#aaa', marginBottom: '4px' }}>Test Cases</label>
                {newProblem.publicTestCases.map((test, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder="Input (e.g., 2 7 11 15\n9)"
                      value={test.input}
                      onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background: '#0a0a1a',
                        border: '1px solid #2a2a4a',
                        borderRadius: '6px',
                        color: '#fff'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Expected Output (e.g., 0 1)"
                      value={test.expectedOutput}
                      onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background: '#0a0a1a',
                        border: '1px solid #2a2a4a',
                        borderRadius: '6px',
                        color: '#fff'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeTestCase(index)}
                      style={{
                        padding: '8px 12px',
                        background: '#e17055',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTestCase}
                  style={{
                    padding: '6px 12px',
                    background: '#2a2a4a',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  + Add Test Case
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#aaa', marginBottom: '4px' }}>Reference Solution (JavaScript)</label>
                <textarea
                  value={newProblem.referenceSolution[0]?.completeCode || ''}
                  onChange={(e) => setNewProblem({
                    ...newProblem,
                    referenceSolution: [{ language: 'javascript', completeCode: e.target.value }]
                  })}
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#0a0a1a',
                    border: '1px solid #2a2a4a',
                    borderRadius: '6px',
                    color: '#fff',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #6c63ff, #5a52d5)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Create Problem
              </button>
            </form>
          </div>
        )}

        {/* Problem List */}
        {loading ? (
          <div>Loading problems...</div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {problems.map((problem) => (
              <div
                key={problem._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: '#1a1a2e',
                  border: '1px solid #2a2a4a',
                  borderRadius: '8px'
                }}
              >
                <div>
                  <h4 style={{ marginBottom: '4px' }}>{problem.title}</h4>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: problem.difficulty === 'Easy' ? '#00b894' : 
                                      problem.difficulty === 'Medium' ? '#fdcb6e' : '#e17055' }}>
                      {problem.difficulty}
                    </span>
                    <span style={{ color: '#666' }}>|</span>
                    <span style={{ color: '#666' }}>{problem.submissions || 0} submissions</span>
                    <span style={{ color: '#666' }}>|</span>
                    <span style={{ color: '#666' }}>{problem.tags?.join(', ') || ''}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteProblem(problem._id)}
                  style={{
                    padding: '6px 16px',
                    background: '#e17055',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;