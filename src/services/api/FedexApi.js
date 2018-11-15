import axios from 'axios'
import XMLParser from 'react-xml-parser'
import { carriers, status } from '../../config'
import { WmsApi, WmsTrackingEvent } from './WmsApi'

class FedexApi extends WmsApi {
  constructor(url, user, key) {
    super(url, user, key)
  }

  getAllTracking(trackingNum) {
    return null
  }

  getCurrentTracking(trackingNum) {
    return null
  }

  getMappedStatus(trackingEventDesc) {
    return null
  }

  parseAllTracking(trackingResponse) {
    return null
  }

  parseEvent(node) {
    return null
  }
}

module.exports = FedexApi
