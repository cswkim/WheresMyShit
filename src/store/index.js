import { createStore } from 'redux'
import { persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/lib/storage'
import { reducers } from './reducers'

const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler: autoMergeLevel2,
}

const reducer = persistReducer(persistConfig, reducers)
const store = createStore(reducer)

module.exports = {
  store,
}
