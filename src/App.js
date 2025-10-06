import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback';
import Login from './Login';
import './App.css';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    async function getToken() {
      const response = await fetch('http://127.0.0.1:5000/auth/token');
      const json = await response.json();
      setToken(json.access_token);
    }
    getToken();
  }, []);

  return (
    <>
      {token === '' ? <Login /> : <WebPlayback token={token} />}
    </>
  );
}

export default App;
