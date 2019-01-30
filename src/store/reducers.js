import { combineReducers } from 'redux'
import {
  ADD_PACKAGE,
  EDIT_PACKAGE,
  REMOVE_PACKAGE,
} from './actions'

// Reusable utility functions

function updateObject(oldObject, newValues) {
  return Object.assign({}, oldObject, newValues)
}

function updateItemInArray(array, itemId, updateItemCallback) {
  const updatedItems = array.map(item => {
    if (item.id !== itemId) {
      return item
    }

    const updatedItem = updateItemCallback(item)
    return updatedItem
  })

  return updatedItems
}

function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if(handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

// Case reducers

function addPackage(packagesState, action) {
  const newPackages = packagesState.concat({
    id: Date.now(),
    description: action.item.description,
    carrier: action.item.carrier,
    trackingNum: action.item.trackingNum,
    updatedAt: Date.now(),
  })

  return newPackages
}

function editPackage(packagesState, action) {
  const newPackages = updateItemInArray(packagesState, action.item.id, pkg => {
    return updateObject(pkg, {
      description: action.item.description,
      carrier: action.item.carrier,
      trackingNum: action.item.trackingNum,
      updatedAt: Date.now(),
    })
  })

  return newPackages
}

function removePackage(packagesState, action) {
  return packagesState.filter(pkg => pkg.id !== action.id)
}

// Slice reducers

const packagesReducer = createReducer([], {
  ADD_PACKAGE: addPackage,
  EDIT_PACKAGE: editPackage,
  REMOVE_PACKAGE: removePackage,
})

const reducers = combineReducers({
  packagesReducer,
})

module.exports = { reducers }
