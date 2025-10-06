// const express = require('express')
// const dotenv = require('dotenv');
// const request = require('request');

// const port = 5000

// dotenv.config()

// var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
// var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

// var app = express();

// app.get('/auth/login', (req, res) => {
// });

// app.get('/auth/callback', (req, res) => {
// });

// app.listen(port, () => {
//   console.log(`Listening at http://127.0.0.1:${port}`)
// })

// var generateRandomString = function (length) {
//   var text = '';
//   var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//   for (var i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };

// app.get('/auth/login', (req, res) => {

//   var scope = "streaming \
//                user-read-email \
//                user-read-private"

//   var state = generateRandomString(16);

//   var auth_query_parameters = new URLSearchParams({
//     response_type: "code",
//     client_id: spotify_client_id,
//     scope: scope,
//     redirect_uri: "http://127.0.0.1:3000/auth/callback",
//     state: state
//   })

//   res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
// })

// app.get('/auth/callback', (req, res) => {
//   var code = req.query.code;
//   var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     form: {
//       code: code,
//       redirect_uri: "http://127.0.0.1:3000/auth/callback",
//       grant_type: 'authorization_code'
//     },
//     headers: {
//       'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
//       'Content-Type' : 'application/x-www-form-urlencoded'
//     },
//     json: true
//   };

//   request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       var access_token = body.access_token;
//       // Redirect to frontend with token as query param
//       res.redirect(`http://127.0.0.1:3000/?access_token=${access_token}`);
//     } else {
//       res.send('Error retrieving access token');
//     }
//   });
// })

// app.get('/auth/token', (req, res) => {
//   res.json({ access_token: "test_token" });
// })

// app.get('/', (req, res) => {
//   res.send('Backend is running!');
// });

const express = require('express');
const dotenv = require('dotenv');
const request = require('request');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
const port = 5000;

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

let access_token = '';

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

app.get('/auth/login', (req, res) => {
  const scope = "streaming user-read-email user-read-private";
  const state = generateRandomString(16);
  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: "http://127.0.0.1:5000/auth/callback",
    state: state
  });
  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
});

app.get('/auth/callback', (req, res) => {
  const code = req.query.code;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: "http://127.0.0.1:5000/auth/callback",
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.redirect('http://127.0.0.1:3000/');
    } else {
      console.error('Auth error:', error || body);
      res.status(500).send('Authorization failed');
    }
  });
});

app.get('/auth/token', (req, res) => {
  res.json({ access_token: access_token });
});

app.use(express.static(path.join(__dirname, '../build')));

app.listen(port, () => {
  console.log(`Listening at http://127.0.0.1:${port}`);
});
