import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import Geocoder from 'react-native-geocoder'
import MapView, { Marker } from 'react-native-maps'
import { getUniqueTrackingEventsByLocation } from '../util'

class TrackingMap extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const events = getUniqueTrackingEventsByLocation(this.props.events)

    return (
      <View style={styles.container}>
        <MapView style={styles.map}>
          {events.map((event, index) => (
            <Marker
              key={index}
              coordinate={{latitude: 40.687083, longitude: -73.965757}}
              title={`${event.getShortLocation()}`}
              description={`${event.description}`}
            />
          ))}
        </MapView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 175,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})

module.exports = TrackingMap
