import { Navigation } from 'react-native-navigation'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { store } from './store'
import { config } from './config'
import { registerScreens } from './screens'

function start() {
  Navigation.events().registerAppLaunchedListener(() => {
    persistStore(store, null, () => {
      registerScreens(store, Provider)

      Navigation.setRoot({
        root: {
          stack: {
            options: {
              topBar: {
                title: {
                  color: config.colorTextBase
                },
                noBorder: true,
                background: {
                  color: config.colorBase,
                },
              },
              layout: {
                backgroundColor: config.colorTertiary,
              },
            },
            children: [
              {
                component: {
                  name: 'HomeScreen'
                }
              },
            ]
          }
        }
      })
    })
  })
}

module.exports = { start }
