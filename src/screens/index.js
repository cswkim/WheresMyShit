import { Navigation } from 'react-native-navigation'
import CarriersScreen from './CarriersScreen'
import HomeScreen from './HomeScreen'
import ItemScreen from './ItemScreen'

function registerScreens(store, provider) {
  Navigation.registerComponentWithRedux(`HomeScreen`, () => HomeScreen, provider, store)
  Navigation.registerComponentWithRedux(`CarriersScreen`, () => CarriersScreen, provider, store)
  Navigation.registerComponentWithRedux(`ItemScreen`, () => ItemScreen, provider, store)
}

module.exports = { registerScreens }
