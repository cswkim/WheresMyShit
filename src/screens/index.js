import { Navigation } from 'react-native-navigation'
import AddScreen from './AddScreen'
import CarriersScreen from './CarriersScreen'
import EditScreen from './EditScreen'
import HomeScreen from './HomeScreen'
import ItemScreen from './ItemScreen'

function registerScreens() {
  Navigation.registerComponent(`HomeScreen`, () => HomeScreen)
  Navigation.registerComponent(`AddScreen`, () => AddScreen)
  Navigation.registerComponent(`CarriersScreen`, () => CarriersScreen)
  Navigation.registerComponent(`EditScreen`, () => EditScreen)
  Navigation.registerComponent(`ItemScreen`, () => ItemScreen)
}

module.exports = { registerScreens }
