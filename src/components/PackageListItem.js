import React, { Component } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Swipeout from 'react-native-swipeout'
import { carriers, config, status } from '../config'
import { getCarrierApi } from '../util'
import { WmsStorage } from '../services/WmsStorage'

class PackageListItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      description: null,
      eta: null,
      location: null,
      logoPath: '',
      status: status.unknown,
    }

    this.onRemoveItem = this.onRemoveItem.bind(this)
  }

  componentDidMount() {
    WmsStorage.getItem(this.props.storeKey).then(item => {
      const apiObj = getCarrierApi(item.carrier)
      apiObj.getCurrentTracking(item.trackingNum).then(trackingData => {
        this.setState({
          location: trackingData.getShortLocation(),
          status: apiObj.getMappedStatus(trackingData.description),
        })
      }, error => {
        alert(`API ERROR: ${error}`)
      })

      this.setState({
        description: item.description,
        logoPath: carriers[item.carrier].logoPath,
      })
    }, error => {
      alert(`LOAD ERROR: ${error}`)
    })
  }

  onRemoveItem() {
    this.props.removeCallback(this.props.storeKey)
  }

  render() {
    const { description, eta, location, logoPath, status } = this.state
    const statusStr = status.display

    return (
      <Swipeout
        right={[{text: 'Delete', type: 'delete', onPress: this.onRemoveItem}]}
        backgroundColor='#fff'
      >
        <TouchableOpacity onPress={() => this.props.pressCallback(this.props.storeKey)}>
          <View style={styles.item}>
            <Image
              source={logoPath}
              style={styles.image}
            />
            <View>
              <Text>{description || `No Description`}</Text>
              <Text>{location || `Current Location Unknown`}</Text>
            </View>
            <View style={styles.status}>
              <View style={[styles.circle, {backgroundColor: status.color}]} />
              <Text style={{color: status.color}}>{statusStr}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeout>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: config.colorSecondary,
  },
  image: {
    marginRight: 16,
    marginTop: 3,
  },
  status: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    marginRight: 4,
  },
})

module.exports = PackageListItem
