import { AsyncStorage } from 'react-native'
import { config } from '../config'

const WmsStorage = {
  async getItem(key) {
    try {
      const item = await AsyncStorage.getItem(key)
      return JSON.parse(item)
    } catch(error) {
      console.log(`AsyncStorage Error: ${error.message}`)
    }
  },

  async getAllKeys() {
    try {
      return await AsyncStorage.getAllKeys()
    } catch(error) {
      console.log(`AsyncStorage Error: ${error.message}`)
    }
  },

  async removeItem(key) {
    try {
      return await AsyncStorage.removeItem(key)
    } catch(error) {
      console.log(`AsyncStorage Error: ${error.message}`)
    }
  },

  async saveItem(key, value) {
    try {
      return await AsyncStorage.setItem(`${config.storageKeyIdent}:${key}`, JSON.stringify(value))
    } catch(error) {
      console.log(`AsyncStorage Error: ${error.message}`)
    }
  }
}

module.exports = { WmsStorage }
