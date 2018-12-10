import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { getLatLngFromLocation, getUniqueTrackingEventsByLocation } from '../util'

class TrackingMap extends Component {
  constructor(props) {
    super(props)

    this.state = {
      events: props.events,
      markers: [],
    }

    this.getEventCoords = this.getEventCoords.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.events !== this.state.events) {
      this.getEventCoords()
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.events !== prevState.events) {
      return {events: nextProps.events}
    } else {
      return null
    }
  }

  async getEventCoords() {
    const unique = getUniqueTrackingEventsByLocation(this.state.events)
    let validMarkers = []

    for(const event of unique) {
      const location = event.getShortLocation()
      const latLng = await getLatLngFromLocation(location)

      if(latLng == null) {
        continue
      }

      validMarkers.push({
        title: location,
        description: event.description,
        pos: {lat: latLng.lat, lng: latLng.lng},
      })
    }

    this.setState({markers: validMarkers})
  }

  render() {
    const markers = this.state.markers

    return (
      <View style={styles.container}>
        <MapView style={styles.map}>
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{latitude: marker.pos.lat, longitude: marker.pos.lng}}
              title={`${marker.title}`}
              description={`${marker.description}`}
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
