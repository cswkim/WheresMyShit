import { Navigation } from 'react-native-navigation'
import { config } from './config'
import { registerScreens } from './screens'

function start() {
  registerScreens()

  Navigation.events().registerAppLaunchedListener(() => {
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
}

module.exports = { start }
