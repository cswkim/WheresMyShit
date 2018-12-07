import React, { Component } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { config, carriers } from '../config'

class CarriersScreen extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: 'Carriers',
        },
        leftButtons: [
          {
            id: 'backButton',
            text: 'Back',
            color: config.colorTextBase,
          },
        ]
      },
    }
  }

  constructor(props) {
    super(props)

    Navigation.events().bindComponent(this)
    this.onCarrierSelect = this.onCarrierSelect.bind(this)
  }

  navigationButtonPressed({ buttonId }) {
    Navigation.pop(this.props.componentId)
  }

  onCarrierSelect(carrierId) {
    this.props.onPassCarrier(carrierId)
    Navigation.pop(this.props.componentId)
  }

  render() {
    const carrierItems = Object.keys(carriers).map(key =>
      <TouchableOpacity
        key={key}
        style={styles.carrier}
        onPress={() => this.onCarrierSelect(key)}
      >
        <Image source={carriers[key].logoPath} style={styles.carrierImage} />
        <Text>{carriers[key].name}</Text>
      </TouchableOpacity>
    )

    return (
      <ScrollView>
        {carrierItems}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  carrier: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: config.colorSecondary,
  },
  carrierImage: {
    marginRight: 16,
  },
})

module.exports = CarriersScreen
