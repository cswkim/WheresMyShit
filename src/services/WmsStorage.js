import { config } from '../config'
import { store } from '../store'

const WmsStorage = {
  async getItem(id) {
    try {
      return await store.getState().packagesReducer.find(pkg => pkg.id == id)
    } catch(error) {
      console.log(`WmsStorage.getItem() Error: ${error.message}`)
    }
  },

  async getAll() {
    try {
      return await store.getState().packagesReducer
    } catch(error) {
      console.log(`WmsStorage.getAll() Error: ${error.message}`)
    }
  },

  async saveItem(toSave) {
    try {
      let savedItem = null

      if(toSave.id) {
        savedItem = await store.dispatch({type: 'EDIT_PACKAGE', item: toSave})
      } else {
        savedItem = await store.dispatch({type: 'ADD_PACKAGE', item: toSave})
      }

      return savedItem
    } catch(error) {
      console.log(`WmsStorage.addItem() Error: ${error.message}`)
    }
  },

  async removeItem(id) {
    try {
      return await store.dispatch({type: 'REMOVE_PACKAGE', id: id})
    } catch(error) {
      console.log(`WmsStorage.removeItem() Error: ${error.message}`)
    }
  }
}

module.exports = { WmsStorage }
