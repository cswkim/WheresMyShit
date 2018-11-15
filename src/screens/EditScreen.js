import React, { Component } from 'react'
import { View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { carriers, config } from '../config'
import { matchTrackingPattern } from '../util'
import { WmsStorage } from '../services/WmsStorage'
import PackageForm from '../components/PackageForm'

class EditScreen extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: 'Edit',
        },
        leftButtons: [
          {
            id: 'cancelButton',
            text: 'Cancel',
            color: config.colorTextBase,
          },
        ],
        rightButtons: [
          {
            id: 'saveButton',
            text: 'Save',
            color: config.colorTextBase,
          },
        ]
      },
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      description: null,
      carrier: null,
      trackingNum: null,
    }

    Navigation.events().bindComponent(this)
    this.onChangeCarrier = this.onChangeCarrier.bind(this)
    this.onChangeDescription = this.onChangeDescription.bind(this)
    this.onChangeTrackingNum = this.onChangeTrackingNum.bind(this)
    this.validateInput = this.validateInput.bind(this)
  }

  navigationButtonPressed({ buttonId }) {
    if(buttonId === "cancelButton") {
      Navigation.pop(this.props.componentId)
    } else if (buttonId === "saveButton") {
      let errors = this.validateInput()

      if(errors.length > 0) {
        alert(errors.join("\n\n"))
      } else {
        let toSave = {
          description: this.state.description,
          carrier: this.state.carrier,
          trackingNum: this.state.trackingNum,
        }
        WmsStorage.saveItem(Date.now().toString(), toSave)
          .then(item => {
            Navigation.push(this.props.componentId, {
              component: {
                name: 'HomeScreen'
              }
            })
          }, error => {
            alert(`SAVE ERROR: ${error}`)
          })
      }
    }
  }

  onChangeCarrier(newCarrier) {
    this.setState({carrier: newCarrier})
  }

  onChangeDescription(newDescription) {
    this.setState({description: newDescription})
  }

  onChangeTrackingNum(newTrackingNum) {
    newTrackingNum = newTrackingNum.replace(/\s+/g, '')

    let match = matchTrackingPattern(newTrackingNum)

    if(match) {
      this.setState({carrier: match})
    }

    this.setState({trackingNum: newTrackingNum})
  }

  validateInput() {
    let errors = []

    if(this.state.trackingNum === null || this.state.trackingNum === "") {
      errors.push("The tracking number is missing.")
    }
    if(!(this.state.carrier in carriers)) {
      errors.push("The carrier is not valid.")
    }

    return errors
  }

  render() {
    return (
      <View>
        <PackageForm
          parentComponentId={this.props.componentId}
          description={this.state.description}
          carrier={this.state.carrier}
          trackingNum={this.state.trackingNum}
          onChangeCarrier={this.onChangeCarrier}
          onChangeDescription={this.onChangeDescription}
          onChangeTrackingNum={this.onChangeTrackingNum}
        />
      </View>
    )
  }
}

module.exports = EditScreen
