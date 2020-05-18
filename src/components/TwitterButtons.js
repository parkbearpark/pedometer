import React, { useState, useCallback } from 'react'
import { View, Button, StyleSheet } from 'react-native'
import * as AuthSession from 'expo-auth-session'
import dayjs from 'dayjs'
import axios from 'axios'

const requestTokenURL = 'http://192.168.0.2:3000/request-token'
const accessTokenURL = 'http://192.168.0.2:3000/access-token'
const postTweetURL = 'http://192.168.0.2:3000/post-tweet'

const redirect = 'https://auth.expo.io/@parkbearpark/pedometer'
console.log(`Callback URL: ${redirect}`)

function render({ steps }) {
  const [username, setUsername] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const onLogout = useCallback(() => {
    setUsername()
    setLoading(false)
    setError()
  }, [])

  const onLogin = useCallback(async () => {
    setLoading(true)

    try {
      const requestParams = toQueryString({ callback_url: redirect })
      const requestResponces = await axios
        .get(requestTokenURL + requestParams)
        .catch((e) => console.log('request error', e))
      const requestTokens = {
        oauth_token: requestResponces.data['oauth_token'],
        oauth_token_secret: requestResponces.data['oauth_token_secret'],
      }

      console.log('Request tokens fetched!', requestTokens)

      const authResponse = await AuthSession.startAsync({
        authUrl:
          'https://api.twitter.com/oauth/authenticate' +
          toQueryString(requestTokens),
      })

      console.log('Auth response received!', authResponse)

      if (authResponse.params && authResponse.params.denied) {
        return setError('AuthSession failed, user did not authorize the app')
      }

      const accessParams = toQueryString({
        oauth_token: requestTokens.oauth_token,
        oauth_token_secret: requestTokens.oauth_token_secret,
        oauth_verifier: authResponse.params.oauth_verifier,
      })
      const accessResponces = await axios.get(accessTokenURL + accessParams)
      const accessTokens = accessResponces.data

      console.log('Access tokens fetched!', accessTokens)

      setUsername(accessTokens.screen_name)
    } catch (error) {
      console.log('Something went wrong...', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const onPostPress = async () => {
    const today = dayjs().format('YYYY/MM/DD')
    const message = `${today}の歩数: ${steps}\n#歩いた`

    await axios
      .post(postTweetURL, {
        message,
      })
      .catch((e) => console.warn('post error', e))
  }

  if (username === undefined) {
    return (
      <View>
        <Button onPress={onLogin} title="Twitterでログインする" />
      </View>
    )
  } else {
    return (
      <View>
        <Button
          style={styles.button}
          onPress={onLogout}
          title="Twitterからログアウトする"
        />
        <Button style={styles.button} onPress={onPostPress} title="Tweetする" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    margin: 2,
  },
})

function toQueryString(params) {
  return (
    '?' +
    Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&')
  )
}

export default render
