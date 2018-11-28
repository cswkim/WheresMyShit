import axios from 'axios'
import XMLParser from 'react-xml-parser'
import { carriers, status } from '../../config'
import { WmsApi, WmsTrackingEvent } from './WmsApi'

class FedexApi extends WmsApi {
  constructor(url, user, key, accountNum, meterNum) {
    super(url, user, key)

    this.accountNum = accountNum
    this.meterNum = meterNum
  }

  getAllTracking(trackingNum) {
    return axios.post(
      this.url,
      `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v16="http://fedex.com/ws/track/v16">
          <soapenv:Header/>
          <soapenv:Body>
            <v16:TrackRequest>
              <v16:WebAuthenticationDetail>
                <v16:UserCredential>
                  <v16:Key>${this.user}</v16:Key>
                  <v16:Password>${this.key}</v16:Password>
                </v16:UserCredential>
              </v16:WebAuthenticationDetail>
              <v16:ClientDetail>
                <v16:AccountNumber>${this.accountNum}</v16:AccountNumber>
                <v16:MeterNumber>${this.meterNum}</v16:MeterNumber>
              </v16:ClientDetail>
              <v16:TransactionDetail>
                <v16:Localization>
                  <v16:LanguageCode>EN</v16:LanguageCode>
                  <v16:LocaleCode>US</v16:LocaleCode>
                </v16:Localization>
              </v16:TransactionDetail>
              <v16:Version>
                <v16:ServiceId>trck</v16:ServiceId>
                <v16:Major>16</v16:Major>
                <v16:Intermediate>0</v16:Intermediate>
                <v16:Minor>0</v16:Minor>
              </v16:Version>
              <v16:SelectionDetails>
                <v16:CarrierCode>FDXE</v16:CarrierCode>
                <v16:PackageIdentifier>
                  <v16:Type>TRACKING_NUMBER_OR_DOORTAG</v16:Type>
                  <v16:Value>${trackingNum}</v16:Value>
                </v16:PackageIdentifier>
                <v16:ShipmentAccountNumber/>
              </v16:SelectionDetails>
              <v16:ProcessingOptions>INCLUDE_DETAILED_SCANS</v16:ProcessingOptions>
            </v16:TrackRequest>
          </soapenv:Body>
        </soapenv:Envelope>`,
    )
  }

  getCurrentTracking(trackingNum) {
    return this.getAllTracking(trackingNum).then(response => {
      const parsed = new XMLParser().parseFromString(response.data)
      const summary = parsed
                        .getElementsByTagName('CompletedTrackDetails')[0]
                        .getElementsByTagName('TrackDetails')[0]
                        .getElementsByTagName('Events')[0]

      return this.parseEvent(summary)
    })
  }

  getMappedStatus(trackingEventDesc) {console.log(trackingEventDesc)
    let mapped = null
    let toCheck = trackingEventDesc.toLowerCase()

    if(toCheck.includes('delivered')) {
      mapped = status.delivered
    } else if(toCheck.includes('picked') || toCheck.includes('sent')) {
      mapped = status.preparing
    } else if(toCheck.includes('arrived') || toCheck.includes('departed') || toCheck.includes('left')) {
      mapped = status.inTransit
    } else {
      mapped = status.unknown
    }

    return mapped
  }

  parseAllTracking(trackingResponse) {
    const parsed = new XMLParser().parseFromString(trackingResponse)
    const details = parsed
                      .getElementsByTagName('CompletedTrackDetails')[0]
                      .getElementsByTagName('TrackDetails')[0]
                      .getElementsByTagName('Events')

    let events = details.map(evt => this.parseEvent(evt))

    return events
  }

  parseEvent(node) {
    const eventDesc = node.getElementsByTagName('EventDescription')[0].value.trim()
    const eventDateTime = node.getElementsByTagName('Timestamp')[0].value.trim()
    const eventAddress = node.getElementsByTagName('Address')[0]
    const eventCity = eventAddress.getElementsByTagName('City')
    const eventState = eventAddress.getElementsByTagName('StateOrProvinceCode')
    const eventZipCode = eventAddress.getElementsByTagName('PostalCode')
    const eventCountry = eventAddress.getElementsByTagName('CountryName')

    const validDateTime = eventDateTime ? new Date(eventDateTime) : null
    const validEventCity = eventCity.length > 0 ? eventCity[0].value.trim() : null
    const validEventState = eventState.length > 0 ? eventState[0].value.trim() : null
    const validEventZipCode = eventZipCode.length > 0 ? eventZipCode[0].value.trim() : null
    const validEventCountry = eventCountry.length > 0 ? eventCountry[0].value.trim() : null

    const eventObj = new WmsTrackingEvent(
      validDateTime,
      eventDesc,
      validEventCity,
      validEventState,
      validEventZipCode,
      validEventCountry,
    )

    return eventObj
  }
}

module.exports = FedexApi
