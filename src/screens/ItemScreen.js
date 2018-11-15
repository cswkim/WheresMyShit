import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { carriers, config } from '../config'
import { matchTrackingPattern } from '../util'
import { WmsStorage } from '../services/WmsStorage'
import PackageForm from '../components/PackageForm'

class ItemScreen extends Component {
  static get options() {
    return {
      topBar: {
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

  componentDidMount() {
    if(this.props.isEdit) {
      WmsStorage.getItem(this.props.storeKey).then(item => {
        this.setState({
          description: item.description,
          carrier: item.carrier,
          trackingNum: item.trackingNum,
        })
      }, error => {
        alert(`LOAD ERROR: ${error}`)
      })
    }
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
        {this.props.isEdit && (
          <Text style={{backgroundColor:'blue'}}>Map will go here</Text>
        )}

        <PackageForm
          parentComponentId={this.props.componentId}
          description={this.state.description}
          carrier={this.state.carrier}
          trackingNum={this.state.trackingNum}
          onChangeCarrier={this.onChangeCarrier}
          onChangeDescription={this.onChangeDescription}
          onChangeTrackingNum={this.onChangeTrackingNum}
        />

        {this.props.isEdit && (
          <Text style={{backgroundColor:'pink'}}>Tracking history will go here</Text>
        )}

        {this.props.isEdit && (
          <Text style={{backgroundColor:'red'}}>Delete button will go here</Text>
        )}
      </View>
    )
  }
}

module.exports = ItemScreen
