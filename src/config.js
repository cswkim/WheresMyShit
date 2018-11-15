const config = {
  colorBase: '#05a838',
  colorSecondary: '#c7c7cd',
  colorTextBase: 'white',
  storageKeyIdent: '@WMS_STORE',
}

const carriers = {
  canadaPost: {
    name: "Canada Post",
    pattern: /^[a-zA-z]{2}[0-9]{9}[Cc][Aa]$/,
    logoPath: require('./assets/img/logo-canada-post.png'),
  },
  dhlExpress: {
    name: "DHL Express",
    pattern: /[0-9]{10}/,
    logoPath: require('./assets/img/logo-dhl.png'),
  },
  fedex: {
    name: "FedEx",
    pattern: /[0-9]{12}/,
    logoPath: require('./assets/img/logo-fedex.png'),
    api: {
      url: 'https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2',
      user: '169DALOF5450',
      key: '',
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
  },
  usps: {
    name: "USPS",
    pattern: /[0-9]{20,22}/,
    logoPath: require('./assets/img/logo-usps.png'),
    api: {
      url: 'https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2',
      user: '169DALOF5450',
      key: '',
    },
  },
}

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
  status,
}