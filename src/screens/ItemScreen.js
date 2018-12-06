import React, { Component } from 'react'
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { carriers, config } from '../config'
import { getCarrierApi, matchTrackingPattern } from '../util'
import { WmsStorage } from '../services/WmsStorage'
import PackageForm from '../components/PackageForm'
import TrackingEventListItem from '../components/TrackingEventListItem'

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
      history: [],
    }

    Navigation.events().bindComponent(this)
    this.onChangeCarrier = this.onChangeCarrier.bind(this)
    this.onChangeDescription = this.onChangeDescription.bind(this)
    this.onChangeTrackingNum = this.onChangeTrackingNum.bind(this)
    this.onDeleteConfirm = this.onDeleteConfirm.bind(this)
    this.onDeletePrompt = this.onDeletePrompt.bind(this)
    this.validateInput = this.validateInput.bind(this)
  }

  componentDidMount() {
    if(this.props.isEdit) {
      WmsStorage.getItem(this.props.storeKey).then(item => {
        const apiObj = getCarrierApi(item.carrier)
        apiObj.getAllTracking(item.trackingNum).then(trackingData => {
          this.setState({history: apiObj.parseAllTracking(trackingData.data)})
        }, error => {
          alert(`API ERROR: ${error}`)
        })

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
            Navigation.popToRoot(this.props.componentId)
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

  onDeletePrompt() {
    Alert.alert(
      "Delete this package?",
      "You cannot undo this removal.",
      [
        {text: "Cancel", style: 'cancel'},
        {text: "Delete", onPress: () => this.onDeleteConfirm(), style: 'destructive'},
      ],
    )
  }

  onDeleteConfirm() {
    WmsStorage.removeItem(this.props.storeKey).then(removed => {
      Navigation.popToRoot(this.props.componentId)
    }, error => {
      alert(`DELETE ERROR: ${error}`)
    })
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
    const trackingHistory = this.state.history

    return (
      <ScrollView>
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
          <Text style={styles.groupHeader}>Tracking History</Text>
        )}

        {this.props.isEdit && (
          <FlatList
            style={styles.history}
            data={trackingHistory}
            renderItem={({item}) => (
              <TrackingEventListItem event={item} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}

        {this.props.isEdit && (
          <View style={styles.deleteButtonWrapper}>
            <TouchableOpacity onPress={this.onDeletePrompt} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete Package</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  groupHeader: {
    color: config.colorSecondary,
    backgroundColor: config.colorTertiary,
    padding: 16,
  },
  history: {
    borderTopWidth: 1,
    borderTopColor: config.colorSecondary,
  },
  deleteButtonWrapper: {
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: config.colorTertiary,
  },
  deleteButton: {
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: config.colorSecondary,
    borderBottomWidth: 1,
    borderBottomColor: config.colorSecondary,
    backgroundColor: 'red',
  },
  deleteButtonText: {
    textAlign: 'center',
    color: config.colorTextBase,
    fontWeight: 'bold',
  },
})

module.exports = ItemScreen
