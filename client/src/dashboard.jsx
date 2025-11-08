import { useState } from 'react';
import axios from 'axios';
import './dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard({ user, onLogout }) {
  // ... state

  const handleGenerateTests = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/tests/generate`,
        { topic, difficulty, language: 'javascript' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTests(response.data.tests || []);
    } catch (err) {
      setError('Failed to generate tests');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component



  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>CodeTest AI</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}!</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="controls">
          <h2>Generate Test Cases</h2>
          
          <div className="form-group">
            <label>Topic</label>
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="factorial">Factorial</option>
              <option value="fibonacci">Fibonacci</option>
              <option value="palindrome">Palindrome</option>
            </select>
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button 
            onClick={handleGenerateTests} 
            disabled={loading}
            className="generate-btn"
          >
            {loading ? 'Generating...' : 'Generate Tests'}
          </button>

          {error && <div className="error">{error}</div>}
        </section>

        <section className="tests-section">
          <h2>Test Cases</h2>
          {tests.length === 0 ? (
            <p className="no-tests">No tests generated yet. Generate tests to see them here!</p>
          ) : (
            <div className="tests-grid">
              {tests.map((test, idx) => (
                <div key={idx} className="test-card">
                  <h3>{test.name}</h3>
                  <p><strong>Description:</strong> {test.description}</p>
                  <p><strong>Input:</strong> {test.input}</p>
                  <p><strong>Expected Output:</strong> {test.expectedOutput}</p>
                  <span className={`difficulty ${test.difficulty}`}>
                    {test.difficulty}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}




