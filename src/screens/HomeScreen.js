import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Pedometer } from 'expo-legacy'
import dayjs from 'dayjs'
import TwitterButtons from '../components/TwitterButtons'

function render() {
  const [steps, setSteps] = useState(0)

  useEffect(() => {
    const getSteps = async () => {
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

        setSteps(steps)
      } catch (err) {
        console.log(err)
      }
    }

    getSteps()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.steps}>{steps}</Text>
      <TwitterButtons steps={steps} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC9D2',
  },
  steps: {
    fontFamily: 'sans-serif',
    fontSize: 64,
    color: '#FFFFFF',
  },
})

export default render
