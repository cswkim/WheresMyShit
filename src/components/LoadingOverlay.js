import React, { Component } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { config } from '../config'

class LoadingOverlay extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.overlay}>
        <ActivityIndicator size='large' color={config.colorBase} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.75,
    backgroundColor: config.colorSecondary,
  },
})

module.exports = LoadingOverlay
