import { carriers, config } from './config'
import FedexApi from './services/api/FedexApi'
import JapanPostApi from './services/api/JapanPostApi'
import UspsApi from './services/api/UspsApi'

function getCarrierApi(carrier) {
  const apiConf = carriers[carrier].api
  let subApi = null

  switch(carrier) {
    case 'fedex':
      subApi = new FedexApi(
        apiConf.url,
        apiConf.user,
        apiConf.key,
        apiConf.accountNum,
        apiConf.meterNum,
      )
      break
    case 'japanPost':
      subApi = new JapanPostApi(apiConf.url, apiConf.user, apiConf.key)
      break
    case 'usps':
      subApi = new UspsApi(apiConf.url, apiConf.user, apiConf.key)
      break
    default:
      console.log(`Carrier with key ${carrier} is missing information`)
  }

  return subApi
}

function getUniqueTrackingEventsByLocation(locations) {
  const unique = locations.filter((obj, pos, arr) => {
    let filtered = arr.map(trackingEvent => trackingEvent.getShortLocation())
    let toCheck = obj.getShortLocation()
    return filtered.indexOf(toCheck) === pos
  })

  return unique
}

function matchTrackingPattern(trackingNum) {
  let carrierKey = null

  for(let key in carriers) {
    if(carriers[key].pattern.test(trackingNum)) {
      carrierKey = key
      break
    }
  }

  return carrierKey
}

module.exports = {
  getCarrierApi,
  getUniqueTrackingEventsByLocation,
  matchTrackingPattern,
}
