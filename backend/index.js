const express = require('express')
const bodyParser = require('body-parser')
const Twitter = require('twitter-lite')
require('dotenv').config()

const app = express()
app.use(bodyParser.json())

let twitter = new Twitter({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET,
})

app.listen(3000, () => {
  console.log('Twitter login backend listening to port 3000')
})

app.get('/request-token', (req, res) => {
  twitter
    .getRequestToken(req.query.callback_url)
    .then((response) => {
      console.log('Fetched request token!', response)
      res.json(response)
    })
    .catch((error) => {
      console.log('Could not fetch request token', error)
      res.status(500).json({ message: error.message })
    })
})

app.get('/access-token', (req, res) => {
  const options = {
    key: req.query.oauth_token,
    secret: req.query.oauth_token_secret,
    verifier: req.query.oauth_verifier,
  }

  twitter
    .getAccessToken(options)
    .then((response) => {
      console.log('Access token fetched!', response)
      twitter = new Twitter({
        consumer_key: process.env.API_KEY,
        consumer_secret: process.env.API_SECRET,
        access_token_key: response.oauth_token,
        access_token_secret: response.oauth_token_secret,
      })
      res.json(response)
    })
    .catch((error) => {
      console.log('Could not fetch access token', error)
      res.status(500).json({ message: error.message })
    })
})

app.post('/post-tweet', (req) => {
  twitter
    .post('statuses/update', {
      status: req.body.message,
    })
    .catch((e) => console.log('error', e))
})
