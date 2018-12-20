import Geocoder from 'react-native-geocoder'
import { carriers, locationMap } from './config'

function getLatLngFromLocation(location) {
  return Geocoder.geocodeAddress(location).then(resp => {
    return resp[0].position
  }).catch(err => {
    console.log(`Geocoder error for location '${location}': ${err}`)
    return null
  })
}

function getMappedLocation(toDecode) {
  const result = locationMap.filter(loc => loc.key == toDecode.toLowerCase())
  const found = result.length > 0 ? result[0].mapped : null
  return found
}

function getUniqueTrackingEventsByLocation(locations) {
  const unique = locations.filter((obj, pos, arr) => {
    let filtered = arr.map(trackingEvent => trackingEvent.getShortLocation())
    let toCheck = obj.getShortLocation()
    return filtered.indexOf(toCheck) === pos
  })

  return unique
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
  getLatLngFromLocation,
  getMappedLocation,
  getUniqueTrackingEventsByLocation,
  matchTrackingPattern,
}
