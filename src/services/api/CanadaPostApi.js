import axios from 'axios'
import XMLParser from 'react-xml-parser'
import { carriers, status } from '../../config'
import { getMappedLocation } from '../../util'
import { WmsApi, WmsTrackingEvent } from './WmsApi'

class CanadaPostApi extends WmsApi {
  constructor(url, user, key, pass) {
    super(url, user, key)
  }

  getAllTracking(trackingNum) {
    const detailsUrl = `${this.url}/${trackingNum}/details`
    return axios.get(detailsUrl, {
      auth: {
        username: this.user,
        password: this.key,
      }
    })
  }

  getCurrentTracking(trackingNum) {
    return this.getAllTracking(trackingNum).then(response => {
      const parsed = new XMLParser().parseFromString(response.data)
      const events = parsed.getElementsByTagName('significant-events')[0]
      const summary = events.getElementsByTagName('occurrence')[0]

      return this.parseEvent(summary)
    })
  }

  getMappedStatus(trackingEventDesc) {
    let mapped = null
    let toCheck = trackingEventDesc.toLowerCase()

    if(toCheck.includes('delivered')) {
      mapped = status.delivered
    } else if(toCheck.includes('submitted')) {
      mapped = status.preparing
    } else if(toCheck.includes('arrived') || toCheck.includes('forwarded') || toCheck.includes('processed')) {
      mapped = status.inTransit
    } else {
      mapped = status.unknown
    }

    return mapped
  }

  parseAllTracking(trackingResponse) {
    const parsed = new XMLParser().parseFromString(trackingResponse)
    const sigEvents = parsed.getElementsByTagName('significant-events')[0]
    const details = sigEvents.getElementsByTagName('occurrence')

    let events = details.map(evt => this.parseEvent(evt))

    return events
  }

  parseEvent(node) {
    const eventSite = node.getElementsByTagName('event-site')[0].value.trim().split(',')
    const eventProvince = node.getElementsByTagName('event-province')[0].value.trim()

    const eventDesc = node.getElementsByTagName('event-description')[0].value.trim()
    const eventDate = node.getElementsByTagName('event-date')[0].value.trim()
    const eventTime = node.getElementsByTagName('event-time')[0].value.trim()

    let eventCity = null
    let eventState = null
    let eventZipCode = null
    let eventCountry = null
    if(eventProvince) {
      eventCity = eventSite[0]
      eventState = eventProvince
      eventCountry = 'Canada'
    } else if(eventSite.length > 1) {
      const decoded = getMappedLocation(eventSite[0])

      if(decoded) {
        eventCity = decoded.city
        eventState = decoded.state
        eventZipCode = decoded.zipCode
        eventCountry = decoded.country
      } else {
        eventCity = eventSite[0]
        eventCountry = eventSite[1]
      }
    } else if(eventSite[0]) {
      eventCountry = eventSite[0]
    }

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

module.exports = CanadaPostApi
