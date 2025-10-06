import React, { useState, useEffect } from 'react';

const trackTemplate = {
  name: "",
  album: { images: [{ url: "" }] },
  artists: [{ name: "" }]
};

function WebPlayback({ token }) {
  const [player, setPlayer] = useState(undefined);
  const [deviceId, setDeviceId] = useState(null);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(trackTemplate);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Sam's Web Playback SDK",
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);

        // Transfer playback to Web Playback SDK
        fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          body: JSON.stringify({ device_ids: [device_id], play: false }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state) => {
        if (!state) return;
        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        player.getCurrentState().then(s => setActive(!!s));
      });

      player.connect();
    };
  }, [token]);

  // Control buttons using the Web API to ensure they work
  const togglePlay = () => {
    fetch(`https://api.spotify.com/v1/me/player/${is_paused ? 'play' : 'pause'}?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => setPaused(!is_paused));
  };

  const nextTrack = () => {
    fetch(`https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  };

  const previousTrack = () => {
    fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  };

    return (
    <div className="container">
        <div className="main-wrapper">
        {!deviceId && <b>Loading Spotify Web Playback...</b>}
        {deviceId && (
            <>
            <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />
            <div className="now-playing__side">
                <div className="now-playing__name">{current_track.name}</div>
                <div className="now-playing__artist">{current_track.artists[0].name}</div>
                <div className="controls">
                <button className="btn-spotify" onClick={previousTrack}>&lt;&lt;</button>
                <button className="btn-spotify" onClick={togglePlay}>
                    {is_paused ? "PLAY" : "PAUSE"}
                </button>
                <button className="btn-spotify" onClick={nextTrack}>&gt;&gt;</button>
                </div>
            </div>
            </>
        )}
        </div>
    </div>
    );
}

export default WebPlayback;
