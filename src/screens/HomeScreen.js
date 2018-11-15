import React, { Component } from 'react'
import { FlatList, View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { config } from '../config'
import { WmsStorage } from '../services/WmsStorage'
import PackageListItem from '../components/PackageListItem'

class HomeScreen extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          text: 'My Shit',
        },
        leftButtons: [],
        rightButtons: [
          {
            id: 'addButton',
            text: 'Add',
            color: config.colorTextBase,
          },
        ]
      },
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      allKeys: [],
    }

    Navigation.events().bindComponent(this)
    this.fetchKeys = this.fetchKeys.bind(this)
    this.onPressItem = this.onPressItem.bind(this)
    this.onRemoveItem = this.onRemoveItem.bind(this)
  }

  componentDidMount() {
    this.fetchKeys()
  }

  fetchKeys() {
    WmsStorage.getAllKeys().then(keys => {
      this.setState({allKeys: keys})
    })
  }

  navigationButtonPressed({ buttonId }) {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'AddScreen'
      }
    })
  }

  onPressItem(key) {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'EditScreen'
      }
    })
  }

  onRemoveItem(key) {
    WmsStorage.removeItem(key).then(removed => {
      this.fetchKeys()
    }, error => {
      alert(`DELETE ERROR: ${error}`)
    })
  }

  render() {
    const allKeys = this.state.allKeys

    return (
      <View>
        <FlatList
          data={allKeys}
          renderItem={({item}) => (
            <PackageListItem
              storeKey={item}
              removeCallback={this.onRemoveItem}
              pressCallback={this.onPressItem}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }
}

module.exports = HomeScreen
