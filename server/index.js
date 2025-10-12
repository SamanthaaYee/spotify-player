// const express = require('express');
// const dotenv = require('dotenv');
// const request = require('request');
// const cors = require('cors');

// dotenv.config();

// const app = express();
// app.use(cors()); // allow frontend to talk to backend

// const PORT = process.env.PORT || 5000;

// const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
// const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
// // const REDIRECT_URI = 'http://127.0.0.1:5000/auth/callback'; // backend callback
// // const REDIRECT_URI = process.env.REDIRECT_URI;
// // // const REDIRECT_URI = process.env.REDIRECT_URI || `http://${HOST}:${PORT}/auth/callback`;
// // const FRONTEND_URI = process.env.FRONTEND_URI || 'http://127.0.0.1:3000';

// const REDIRECT_URI = process.env.REDIRECT_URI || `http://127.0.0.1:${PORT}/auth/callback`;
// const FRONTEND_URI = process.env.FRONTEND_URI || 'http://127.0.0.1:3000';

// // Helper to generate random state
// function generateRandomString(length = 16) {
//   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   return Array.from({ length }, () => possible.charAt(Math.floor(Math.random() * possible.length))).join('');
// }

// // Step 1: Redirect user to Spotify login
// app.get('/auth/login', (req, res) => {
//   const state = generateRandomString();
//   const scope = 'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state';

//   const authQueryParams = new URLSearchParams({
//     response_type: 'code',
//     client_id: SPOTIFY_CLIENT_ID,
//     scope: scope,
//     redirect_uri: REDIRECT_URI,
//     state: state
//   });

//   res.redirect(`https://accounts.spotify.com/authorize/?${authQueryParams.toString()}`);
// });

// // Step 2: Spotify redirects back here with code
// app.get('/auth/callback', (req, res) => {
//   const code = req.query.code;

//   const authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     form: {
//       code: code,
//       redirect_uri: REDIRECT_URI,
//       grant_type: 'authorization_code'
//     },
//     headers: {
//       'Authorization': 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     json: true
//   };

//   request.post(authOptions, (error, response, body) => {
//     if (!error && response.statusCode === 200) {
//       const access_token = body.access_token;
//       const refresh_token = body.refresh_token;

//       // Redirect user to frontend with tokens in URL
//       // res.redirect(`http://127.0.0.1:3000/?access_token=${access_token}&refresh_token=${refresh_token}`);
//       res.redirect(`${FRONTEND_URI}/?access_token=${access_token}&refresh_token=${refresh_token}`);
//     } else {
//       console.error('Auth error:', error || body);
//       res.status(500).send('Authorization failed');
//     }
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Backend listening on port ${PORT}`);
// });


const express = require('express');
const dotenv = require('dotenv');
const request = require('request');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors()); // allow frontend to talk to backend

const PORT = 5000;

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'http://127.0.0.1:5000/auth/callback'; // backend callback

// Helper to generate random state
function generateRandomString(length = 16) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => possible.charAt(Math.floor(Math.random() * possible.length))).join('');
}

// Step 1: Redirect user to Spotify login
app.get('/auth/login', (req, res) => {
  const state = generateRandomString();
  const scope = 'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state';

  const authQueryParams = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
    state: state
  });

  res.redirect(`https://accounts.spotify.com/authorize/?${authQueryParams.toString()}`);
});

// Step 2: Spotify redirects back here with code
app.get('/auth/callback', (req, res) => {
  const code = req.query.code;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;

      // Redirect user to frontend with tokens in URL
      res.redirect(`http://127.0.0.1:3000/?access_token=${access_token}&refresh_token=${refresh_token}`);
    } else {
      console.error('Auth error:', error || body);
      res.status(500).send('Authorization failed');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://127.0.0.1:${PORT}`);
});
