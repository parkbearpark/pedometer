import React, { Component } from 'react'
import { Text, StyleSheet } from 'react-native'
import { Pedometer } from 'expo-legacy'
import dayjs from 'dayjs'

export default class DisplaySteps extends Component {
  constructor(props) {
    super(props)
    this.state = { steps: 0 }
  }

  componentDidMount() {
    this.getSteps()
  }

  getSteps = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync()

      if (!isAvailable) {
        return
      }

      const now = dayjs()
      const since = dayjs()
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0)

      const { steps } = await Pedometer.getStepCountAsync(
        new Date(since),
        new Date(now)
      ).catch((e) => console.log(e))

      this.setState({
        steps,
      })
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    return <Text style={styles.text}>{this.state.steps}</Text>
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 100,
    fontFamily: 'sans-serif',
    color: '#FFFFFF',
  },
})
