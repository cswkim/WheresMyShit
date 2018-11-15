import React, { Component } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { config } from '../config'

class TrackingEventListItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const event = this.props.event
    const dateTime = event.getDateTime()
    const location = event.getShortLocation()

    return (
      <View style={styles.event}>
        <Text style={styles.altText}>{dateTime}</Text>
        <Text>{location}</Text>
        <Text style={styles.altText}>{event.description}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  event: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: config.colorSecondary,
  },
  altText: {
    color: config.colorSecondary,
  },
})

module.exports = TrackingEventListItem
