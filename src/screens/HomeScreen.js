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
      isFetching: false,
    }

    Navigation.events().bindComponent(this)
    this.fetchKeys = this.fetchKeys.bind(this)
    this.onPressItem = this.onPressItem.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this.onRemoveItem = this.onRemoveItem.bind(this)
  }

  componentDidMount() {
    this.fetchKeys()
  }

  fetchKeys() {
    this.setState({isFetching: true})

    WmsStorage.getAllKeys().then(keys => {
      this.setState({
        allKeys: keys,
        isFetching: false,
      })
    })
  }

  navigationButtonPressed({ buttonId }) {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'ItemScreen',
        passProps: {
          isEdit: false,
        },
        options: {
          topBar: {
            title: {
              text: 'Add'
            }
          }
        },
      }
    })
  }

  onPressItem(key) {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'ItemScreen',
        passProps: {
          isEdit: true,
          storeKey: key,
        },
        options: {
          topBar: {
            title: {
              text: 'Edit'
            }
          }
        },
      }
    })
  }

  onRefresh() {
    this.fetchKeys()
  }

  onRemoveItem(key) {
    WmsStorage.removeItem(key).then(removed => {
      this.fetchKeys()
    }, error => {
      alert(`DELETE ERROR: ${error}`)
    })
  }

  render() {
    const { allKeys, isFetching } = this.state

    return (
      <View style={{flex:1}}>
        <FlatList
          data={allKeys}
          renderItem={({item}) => (
            <PackageListItem
              storeKey={item}
              removeCallback={this.onRemoveItem}
              pressCallback={this.onPressItem}
            />
          )}
          onRefresh={() => this.onRefresh()}
          refreshing={isFetching}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }
}

module.exports = HomeScreen
