import axios from 'axios'
import XMLParser from 'react-xml-parser'
import { carriers, status } from '../../config'
import { WmsApi, WmsTrackingEvent } from './WmsApi'

class DhlApi extends WmsApi {
  constructor(url, user, key) {
    super(url, user, key)
  }

  _generateRequest(trackingNum, level) {
    return `<?xml version="1.0" encoding="UTF-8"?>
            <req:KnownTrackingRequest xmlns:req="http://www.dhl.com"
                                      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                      xsi:schemaLocation="http://www.dhl.com
                                      TrackingRequestKnown.xsd">
              <Request>
                <ServiceHeader>
                  <SiteID>${this.user}</SiteID>
                  <Password>${this.key}</Password>
                </ServiceHeader>
              </Request>
              <LanguageCode>en</LanguageCode>
              <AWBNumber>${trackingNum}</AWBNumber>
              <LevelOfDetails>${level}</LevelOfDetails>
            </req:KnownTrackingRequest>`
  }

  getAllTracking(trackingNum) {
    return axios.post(
      this.url,
      this._generateRequest(trackingNum, 'ALL_CHECK_POINTS'),
    )
  }

  getCurrentTracking(trackingNum) {
    return axios.post(
      this.url,
      this._generateRequest(trackingNum, 'LAST_CHECK_POINT_ONLY'),
    ).then(response => {
      const parsed = new XMLParser().parseFromString(response.data)
      const summary = parsed.getElementsByTagName('ShipmentEvent')[0]

      return this.parseEvent(summary)
    })
  }

  getMappedStatus(trackingEventDesc) {
    let mapped = null
    let toCheck = trackingEventDesc.toLowerCase()

    if(toCheck.includes('delivered')) {
      mapped = status.delivered
    } else if(toCheck.includes('received')) {
      mapped = status.preparing
    } else if(
      toCheck.includes('processed') ||
      toCheck.includes('processing') ||
      toCheck.includes('transferred') ||
      toCheck.includes('customs') ||
      toCheck.includes('arrived') ||
      toCheck.includes('departed')
    ) {
      mapped = status.inTransit
    } else {
      mapped = status.unknown
    }

    return mapped
  }

  parseAllTracking(trackingResponse) {
    const parsed = new XMLParser().parseFromString(trackingResponse)
    const details = parsed.getElementsByTagName('ShipmentEvent')

    let events = details.map(evt => this.parseEvent(evt)).reverse()

    return events
  }

  parseEvent(node) {
    const serviceEvent = node.getElementsByTagName('ServiceEvent')[0]
    const serviceArea = node.getElementsByTagName('ServiceArea')[0]
    const serviceAreaDesc = serviceArea.getElementsByTagName('Description')[0].value.trim()
    const cityState = serviceAreaDesc.split('-')[0].trim().split(',')

    const eventDesc = serviceEvent.getElementsByTagName('Description')[0].value.trim()
    const eventDate = node.getElementsByTagName('Date')[0].value.trim()
    const eventTime = node.getElementsByTagName('Time')[0].value.trim()
    const eventCity = (cityState.length > 0) ? cityState[0].trim() : null
    const eventState = (cityState.length > 1) ? cityState[1].trim() : null
    const eventZipCode = null
    const eventCountry = serviceAreaDesc.split('-')[1].trim()

    const validDateTime = eventDate && eventTime ? new Date(`${eventDate} ${eventTime}`) : null

    const eventObj = new WmsTrackingEvent(
      validDateTime,
      eventDesc,
      eventCity,
      eventState,
      eventZipCode,
      eventCountry,
    )

    return eventObj
  }
}

module.exports = DhlApi
