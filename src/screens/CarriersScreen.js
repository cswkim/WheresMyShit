import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
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
      <Text
        key={key}
        style={styles.carrier}
        onPress={() => this.onCarrierSelect(key)}>
        {carriers[key].name}
      </Text>
    )

    return (
      <View>
        {carrierItems}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  carrier: {
    height: 60,
    lineHeight: 60,
    paddingLeft: 16,
  },
})

module.exports = CarriersScreen
