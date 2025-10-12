// // import React from 'react';

// // const BACKEND_URI = process.env.REACT_APP_BACKEND_URI || 'http://127.0.0.1:5000';

// // function Login() {
// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         <a className="liquid-glass btn-spotify" href={`${BACKEND_URI}/auth/login`}>
// //           login with spotify! 🎧
// //         </a>
// //       </header>
// //     </div>
// //   );
// // }

// // export default Login;

import React from 'react';
const { ipcRenderer } = window.require('electron');

function Login() {
  const handleLogin = async () => {
    try {
      const token = await ipcRenderer.invoke('spotify-login');
      console.log('Spotify token:', token);
      // You can now save it in state
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button className="liquid-glass btn-spotify" onClick={handleLogin}>
          🎧 login with Spotify
        </button>
      </header>
    </div>
  );
}

export default Login;
