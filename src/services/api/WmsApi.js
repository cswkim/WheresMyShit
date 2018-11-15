
class WmsTrackingEvent {
  constructor(dateTime, description, city, state, zip, country) {
    this.dateTime = dateTime
    this.description = description
    this.city = city
    this.state = state
    this.zip = zip
    this.country = country
  }

  getFullLocation() {
    return `${this.city}, ${this.state} ${this.zip} ${this.country}`
  }

  getShortLocation() {
    return `${this.city}, ${this.state}`
  }

  getIntlLocation() {
    return `${this.city}, ${this.country}`
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
