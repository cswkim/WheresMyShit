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
      packages: [],
      isFetching: false,
    }

    Navigation.events().bindComponent(this)
    this.fetchItems = this.fetchItems.bind(this)
    this.onPressItem = this.onPressItem.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this.onRemoveItem = this.onRemoveItem.bind(this)
  }

  componentDidMount() {
    this.fetchItems()
  }

  fetchItems() {
    this.setState({isFetching: true})

    WmsStorage.getAll().then(allPkgs => {
      this.setState({
        packages: allPkgs,
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
          storeId: null,
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

  onPressItem(id) {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'ItemScreen',
        passProps: {
          isEdit: true,
          storeId: id,
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
    this.fetchItems()
  }

  onRemoveItem(id) {
    WmsStorage.removeItem(id).then(removed => {
      this.fetchItems()
    }, error => {
      alert(`DELETE ERROR: ${error}`)
    })
  }

  render() {
    const { packages, isFetching } = this.state

    return (
      <View style={{flex:1}}>
        <FlatList
          data={packages}
          renderItem={({item}) => (
            <PackageListItem
              storeId={item.id}
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
