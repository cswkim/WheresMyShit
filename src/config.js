import {
  API_CP_USER,
  API_CP_KEY,
  API_DHL_USER,
  API_DHL_KEY,
  API_FEDEX_USER,
  API_FEDEX_KEY,
  API_FEDEX_ACCOUNT_NUM,
  API_FEDEX_METER_NUM,
  API_UPS_USER,
  API_UPS_PASS,
  API_UPS_KEY,
  API_USPS_USER,
} from 'react-native-dotenv'

const config = {
  colorBase: '#05a838',
  colorSecondary: '#c7c7cd',
  colorTertiary: '#f1eeee',
  colorTextBase: 'white',
  storageKeyIdent: '@WMS_STORE',
}

const carriers = {
  canadaPost: {
    name: "Canada Post",
    pattern: /^[a-zA-z]{2}[0-9]{9}[Cc][Aa]$/,
    logoPath: require('./assets/img/logo-canada-post.png'),
    api: {
      url: 'https://soa-gw.canadapost.ca/vis/track/pin',
      user: API_CP_USER,
      key: API_CP_KEY,
    },
  },
  dhlExpress: {
    name: "DHL Express",
    pattern: /[0-9]{10}/,
    logoPath: require('./assets/img/logo-dhl.png'),
    api: {
      url: 'https://xmlpitest-ea.dhl.com/XMLShippingServlet',
      user: API_DHL_USER,
      key: API_DHL_KEY,
    },
  },
  fedex: {
    name: "FedEx",
    pattern: /[0-9]{12}/,
    logoPath: require('./assets/img/logo-fedex.png'),
    api: {
      url: 'https://wsbeta.fedex.com:443/web-services',
      user: API_FEDEX_USER,
      key: API_FEDEX_KEY,
      accountNum: API_FEDEX_ACCOUNT_NUM,
      meterNum: API_FEDEX_METER_NUM,
    },
  },
  japanPost: {
    name: "Japan Post",
    pattern: /^[A-Za-z]{2}[0-9]{9}JP$/,
    logoPath: require('./assets/img/logo-japan-post.png'),
  },
  ups: {
    name: "UPS",
    pattern: /^1Z[0-9a-zA-Z]{16}$/,
    logoPath: require('./assets/img/logo-ups.png'),
    api: {
      // url: 'https://onlinetools.ups.com/rest/Track', // Production
      url: 'https://wwwcie.ups.com/rest/Track', // Testing
      user: API_UPS_USER,
      pass: API_UPS_PASS,
      key: API_UPS_KEY,
    },
  },
  usps: {
    name: "USPS",
    pattern: /[0-9]{20,22}/,
    logoPath: require('./assets/img/logo-usps.png'),
    api: {
      url: 'https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2',
      user: API_USPS_USER,
    },
  },
}

const locationJFK = {
  city: "JFK Airport",
  state: "NY",
  zipCode: "11430",
  country: "USA",
}

const locationMap = [
  {key: 'usjfka', mapped: locationJFK},
]

const status = {
  unknown: {
    display: "Unknown",
    color: config.colorSecondary,
  },
  preparing: {
    display: "Preparing",
    color: "yellow",
  },
  inTransit: {
    display: "In Transit",
    color: "orange",
  },
  outForDelivery: {
    display: "Out For Delivery",
    color: "blue",
  },
  delivered: {
    display: "Delivered",
    color: "green",
  },
  exception: {
    display: "Delivery Exception",
    color: "red",
  },
}

module.exports = {
  config,
  carriers,
  locationMap,
  status,
}
