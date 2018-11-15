import moment from 'moment'

class WmsTrackingEvent {
  constructor(dateTime, description, city, state, zip, country) {
    this.dateTime = dateTime
    this.description = description
    this.city = city
    this.state = state
    this.zip = zip
    this.country = country
  }

  getDateTime() {
    const eventDate = this.getDate()
    const eventTime = this.getTime()
    const eventDateTime = eventDate && eventTime ? `${this.getDate()}, ${this.getTime()}` : ""
    return eventDateTime
  }

  getDate() {
    const eventDate = this.dateTime ? moment(this.dateTime).format("MMM D") : ""
    return eventDate
  }

  getTime() {
    const eventTime = this.dateTime ? moment(this.dateTime).format("h:mm A") : ""
    return eventTime
  }

  getFullLocation() {
    return `${this.city}, ${this.state} ${this.zip} ${this.country}`
  }

  getShortLocation() {
    let location = ""

    if(this.city && this.state) {
      location = `${this.city}, ${this.state}`
    } else if(this.city && this.country) {
      location = `${this.city}, ${this.country}`
    } else if(this.city) {
      location = this.city
    } else if(this.country) {
      location = this.country
    }

    return location
  }
}

class WmsApi {
  constructor(url, user, key) {
    this.url = url
    this.user = user
    this.key = key
  }

  getAllTracking(trackingNum) {
    throw new Error('getAllTracking method has not been implemented')
  }

  getCurrentTracking(trackingNum) {
    throw new Error('getCurrentTracking method has not been implemented')
  }

  getMappedStatus(trackingEventDesc) {
    throw new Error('getMappedStatus method has not been implemented')
  }

  parseAllTracking(trackingResponse) {
    throw new Error('parseAllTracking method has not been implemented')
  }

  parseEvent(node) {
    throw new Error('parseEvent method has not been implemented')
  }
}

module.exports = {
  WmsApi,
  WmsTrackingEvent,
}
