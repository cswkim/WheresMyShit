import { carriers, config } from './config'
import FedexApi from './services/api/FedexApi'
import JapanPostApi from './services/api/JapanPostApi'
import UspsApi from './services/api/UspsApi'

function getCarrierApi(carrier) {
  const apiConf = carriers[carrier].api
  let subApi = null

  switch(carrier) {
    case 'fedex':
      subApi = new FedexApi(apiConf.url, apiConf.user, apiConf.key)
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
  matchTrackingPattern,
}
