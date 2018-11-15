import axios from 'axios'
import XMLParser from 'react-xml-parser'
import { carriers, status } from '../../config'
import { WmsApi, WmsTrackingEvent } from './WmsApi'

class UspsApi extends WmsApi {
  constructor(url, user, key) {
    super(url, user, key)
  }

  getAllTracking(trackingNum) {
    return axios.get(this.url, {
      params: {
        XML: `<TrackFieldRequest USERID="${this.user}">
                <TrackID ID="${trackingNum}" />
              </TrackFieldRequest>`,
      }
    })
  }

  getCurrentTracking(trackingNum) {
    return this.getAllTracking(trackingNum).then(response => {
      const parsed = new XMLParser().parseFromString(response.data)
      const summary = parsed.getElementsByTagName('TrackSummary')[0]
      return this.parseEvent(summary)
    })
  }

  getMappedStatus(trackingEventDesc) {
    let mapped = null
    let toCheck = trackingEventDesc.toLowerCase()

    if(toCheck.includes('delivered')) {
      mapped = status.delivered
    } else if(toCheck.includes('acceptance') || toCheck.includes('preparing')) {
      mapped = status.preparing
    } else if(toCheck.includes('processed') || toCheck.includes('arrived') || toCheck.includes('departed')) {
      mapped = status.inTransit
    } else {
      mapped = status.unknown
    }

    return mapped
  }

  parseAllTracking(trackingResponse) {
    const parsed = new XMLParser().parseFromString(trackingResponse)
    const summary = parsed.getElementsByTagName('TrackSummary')[0]
    const details = parsed.getElementsByTagName('TrackDetail')

    let events = details.map(evt => this.parseEvent(evt))
    events.unshift(this.parseEvent(summary))

    return events
  }

  parseEvent(node) {
    const eventDesc = node.getElementsByTagName('Event')[0].value
    const eventDate = node.getElementsByTagName('EventDate')[0].value
    const eventTime = node.getElementsByTagName('EventTime')[0].value
    const eventCity = node.getElementsByTagName('EventCity')[0].value
    const eventState = node.getElementsByTagName('EventState')[0].value
    const eventZipCode = node.getElementsByTagName('EventZIPCode')[0].value
    const eventCountry = node.getElementsByTagName('EventCountry')[0].value

    const eventObj = new WmsTrackingEvent(
      new Date(`${eventDate} ${eventTime}`),
      eventDesc,
      eventCity,
      eventState,
      eventZipCode,
      eventCountry,
    )

    return eventObj
  }
}

module.exports = UspsApi
