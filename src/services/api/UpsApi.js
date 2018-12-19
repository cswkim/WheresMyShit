import axios from 'axios'
import XMLParser from 'react-xml-parser'
import { carriers, status } from '../../config'
import { WmsApi, WmsTrackingEvent } from './WmsApi'

class UpsApi extends WmsApi {
  constructor(url, user, key, pass) {
    super(url, user, key)

    this.pass = pass
  }

  _generateRequest(trackingNum, requestOption=0) {
    return {
      "UPSSecurity": {
        "UsernameToken": {
          "Username": `${this.user}`,
          "Password": `${this.pass}`,
        },
        "ServiceAccessToken": {
          "AccessLicenseNumber": `${this.key}`
        },
      },
      "TrackRequest": {
        "Request": {
          "RequestOption": `${requestOption}`,
          "TransactionReference": {
            "CustomerContext": "WMS UPS TrackRequest",
          },
        },
        "InquiryNumber": `${trackingNum}`,
      },
    }
  }

  getAllTracking(trackingNum) {
    return axios.post(
      this.url,
      this._generateRequest(trackingNum, 1),
    )
  }

  getCurrentTracking(trackingNum) {
    return axios.post(
      this.url,
      this._generateRequest(trackingNum),
    ).then(response => {
      const shipment = response.data.TrackResponse.Shipment

      // Not sure how to handle multiple packages, for now just select the
      // first result.
      const pkg = Array.isArray(shipment.Package) ? shipment.Package[0] : shipment.Package
      const activity = pkg.Activity

      return this.parseEvent(activity)
    })
  }

  getMappedStatus(trackingEventDesc) {
    let mapped = null
    let toCheck = trackingEventDesc.toLowerCase()

    if(toCheck.includes('delivered')) {
      mapped = status.delivered
    } else {
      mapped = status.unknown
    }

    return mapped
  }

  parseAllTracking(trackingResponse) {
    const shipment = trackingResponse.TrackResponse.Shipment

    // Not sure how to handle multiple packages, for now just select the
    // first result.
    const pkg = Array.isArray(shipment.Package) ? shipment.Package[0] : shipment.Package
    const activity = pkg.Activity
    let events = activity.map(evt => this.parseEvent(evt))

    return events
  }

  parseEvent(node) {
    const eventDesc = node.Status.Description.trim()
    const eventDate = node.Date.trim()
    const eventTime = node.Time.trim()

    let eventCity = null
    let eventState = null
    let eventZipCode = null
    let eventCountry = null
    if(node.hasOwnProperty('ActivityLocation')) {
      if(node.ActivityLocation.hasOwnProperty('Address')) {
        const address = node.ActivityLocation.Address
        eventCity = address.City
        eventState = address.StateProvinceCode
        eventZipCode = address.PostalCode
        eventCountry = address.CountryCode
      }
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

module.exports = UpsApi
