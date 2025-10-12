const { app, BrowserWindow, ipcMain } = require('electron');
const express = require('express');
const fetch = require('node-fetch');
const queryString = require('query-string');
require('dotenv').config();

let mainWindow;

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SCOPES = 'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state';

console.log('Client ID:', SPOTIFY_CLIENT_ID);
console.log('Client Secret:', SPOTIFY_CLIENT_SECRET);

// Loopback redirect URI
const REDIRECT_PORT = 4356; // can be any free port
const REDIRECT_URI = `http://127.0.0.1:${REDIRECT_PORT}/callback`;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL('http://localhost:3000'); // React dev server
}

// Function to handle Spotify login
async function loginWithSpotify() {
  return new Promise((resolve, reject) => {
    // Start local Express server to catch Spotify redirect
    const appServer = express();

    const serverInstance = appServer.listen(REDIRECT_PORT, () => {
      console.log(`Listening for Spotify redirect at ${REDIRECT_URI}`);
    });

    appServer.get('/callback', async (req, res) => {
      const code = req.query.code;
      const error = req.query.error;

      if (error) {
        reject(error);
        res.send('Error during authentication. Check console.');
        serverInstance.close();
        return;
      }

      // Exchange code for token
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
        },
        body: queryString.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      const tokenData = await tokenResponse.json();

      res.send('Spotify login successful! You can close this window.');
      serverInstance.close(); // stop listening
      resolve(tokenData.access_token);
    });

    // Open Spotify login window
    const authWindow = new BrowserWindow({
      width: 500,
      height: 700,
      show: true,
      webPreferences: { nodeIntegration: false },
    });

    const authUrl = `https://accounts.spotify.com/authorize?${queryString.stringify({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: SCOPES,
      redirect_uri: REDIRECT_URI,
      state: 'electron-spotify',
    })}`;

    authWindow.loadURL(authUrl);
  });
}

// IPC to trigger login from renderer
ipcMain.handle('spotify-login', async () => {
  const token = await loginWithSpotify();
  return token;
});

app.whenReady().then(createWindow);
