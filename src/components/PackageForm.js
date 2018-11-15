import React, { Component } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { config, carriers } from '../config'

class PackageForm extends Component {
  constructor(props) {
    super(props)

    this.goToCarriersScreen = this.goToCarriersScreen.bind(this)
  }

  goToCarriersScreen() {
    Navigation.push(this.props.parentComponentId, {
      component: {
        name: 'CarriersScreen',
        passProps: {
          onPassCarrier: (data) => this.props.onChangeCarrier(data)
        },
      }
    })
  }

  render() {
    const carrierDisplayName = this.props.carrier ? carriers[this.props.carrier].name : ""

    return (
      <View>
        <TextInput
          placeholder="Description (optional)"
          value={this.props.description}
          autoCorrect={false}
          style={styles.input}
          onChangeText={this.props.onChangeDescription}
        />
        <TextInput
          placeholder="Tracking Number"
          value={this.props.trackingNum}
          autoCorrect={false}
          style={styles.input}
          onChangeText={this.props.onChangeTrackingNum}
        />
        <TextInput
          placeholder="Carrier"
          value={carrierDisplayName}
          autoCorrect={false}
          editable={false}
          style={styles.input}
          onTouchStart={this.goToCarriersScreen}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    height: 60,
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: config.colorSecondary,
  },
})

module.exports = PackageForm
