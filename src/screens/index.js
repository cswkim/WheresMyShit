import { Navigation } from 'react-native-navigation'
import CarriersScreen from './CarriersScreen'
import HomeScreen from './HomeScreen'
import ItemScreen from './ItemScreen'

function registerScreens() {
  Navigation.registerComponent(`HomeScreen`, () => HomeScreen)
  Navigation.registerComponent(`CarriersScreen`, () => CarriersScreen)
  Navigation.registerComponent(`ItemScreen`, () => ItemScreen)
}

module.exports = { registerScreens }
