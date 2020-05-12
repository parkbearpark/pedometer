import React from 'react'
import { StyleSheet, View } from 'react-native'
import DisplaySteps from './src/components/DisplaySteps'

export default function App() {
  return (
    <View style={styles.container}>
      <DisplaySteps />
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
})
