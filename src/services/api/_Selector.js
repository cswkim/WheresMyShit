import { carriers } from '../../config'
import CanadaPostApi from './CanadaPostApi'
import DhlApi from './DhlApi'
import FedexApi from './FedexApi'
import JapanPostApi from './JapanPostApi'
import UpsApi from './UpsApi'
import UspsApi from './UspsApi'

function getCarrierApi(carrier) {
  const apiConf = carriers[carrier].api
  let subApi = null

  switch(carrier) {
    case 'canadaPost':
      subApi = new CanadaPostApi(apiConf.url, apiConf.user, apiConf.key)
      break
    case 'dhlExpress':
      subApi = new DhlApi(apiConf.url, apiConf.user, apiConf.key)
      break
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
    case 'ups':
      subApi = new UpsApi(apiConf.url, apiConf.user, apiConf.key, apiConf.pass)
      break
    case 'usps':
      subApi = new UspsApi(apiConf.url, apiConf.user, apiConf.key)
      break
    default:
      console.log(`Carrier with key ${carrier} is missing information`)
  }

  return subApi
}

module.exports = {
  getCarrierApi,
}
