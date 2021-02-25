const express = require('express');
const db = require('../models');
const router = express.Router();
const Playlist = require('../models/playlist');
const axios = require('axios');
const querystring = require('querystring')
var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var token;
var returnSearch;
var headers;

const data = {
  grant_type: 'client_credentials',
  client_id: 'client_id',
  client_secret: 'client_secret'
}
const refreshData = {
  grant_type: 'refresh_token',
  refresh_token: 'refresh_token'
}

//get route to display the searched songs
router.get('/token', (req, res) => {
  console.log('hitting the route')
  headers = {
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')), //Basic <base64 encoded client_id:client_secret>
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  axios.post('https://accounts.spotify.com/api/token', querystring.stringify(data), headers)
  .then(response => {
    token = response.data.access_token;
    res.send(token);
    console.log(token)
    console.log(response.data)
  })
  .catch( err => {
    console.error(`🐶WE HAVE AN ERROR IN THE AXIOS CALL`, err);
  })

})

router.get('/', (req, res) => {
  let queryValues = Object.values(req.query);
  returnSearch = queryValues[0];
  headers ={headers: {
  'Authorization': 'Bearer ' + queryValues[1],
  'Content-Type': 'application/x-www-form-urlencoded'
  }}
  axios.get(`https://api.spotify.com/v1/search?q=${returnSearch}&type=track&market=US&limit=10&offset=5` , headers)
    .then (response => {
      // console.log('🦀', (response.query));
      //must have .album.name or .album.uri
      res.json({
        song: response.data.tracks.items,
      })
    }).catch(err => {
      if (err) {
        console.error(`WE HAVE AN ERROR IN THE SECOND AXIOS Get`+ err);
      }
    })
});

router.post('/', (req, res)=>{
  Playlist.findById(req.body.id, (err, playlist)=>{
    if(err) {
      console.error(`Error in the GET ID for playlists\n${err}`);
      res.status(500).json({error: `Error in the Detail ROUTE for playlists`});
    } else {
      playlist.songs.push({
        name: req.body.name,
        spotify_id: req.body.spotify_id,
        spotify_uri: req.body.uri
      });
      console.log(playlist);
    }
  })

})

module.exports = router;