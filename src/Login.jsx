import React from 'react';

const BACKEND_URI = process.env.REACT_APP_BACKEND_URI || 'http://127.0.0.1:5000';

function Login() {
  return (
    <div className="App">
      <header className="App-header">
        <a className="liquid-glass btn-spotify" href={`${BACKEND_URI}/auth/login`}>
          login with spotify! 🎧
        </a>
      </header>
    </div>
  );
}

export default Login;
