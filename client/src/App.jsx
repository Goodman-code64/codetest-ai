import { useState, useEffect } from 'react';
import Login from "./login.jsx";
import Dashboard from "./dashboard.jsx";
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendMsg, setBackendMsg] = useState(''); // New state for backend message

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    // Fetch backend health message here
    fetch(`${import.meta.env.VITE_API_URL}/api/health`)
      .then(res => res.json())
      .then(data => {
        setBackendMsg(data.message);
      })
      .catch(() => {
        setBackendMsg('Could not connect to backend');
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div>
        <p>Backend status: {backendMsg}</p> {/* Display backend status */}
      </div>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={setUser} />
      )}
    </>
  );
}

export default App;



