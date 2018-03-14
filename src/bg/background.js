(() => {
  var defaultVals = {
    'refresh_time': 20000,
    'green_color': '#1A9923',
    'red_color': '#D0021B',
    'currency': 'USD',
    'crypto_currency': 'bitcoin',
  };

  var config = {};

  var Crypto = {
    init() {
      this.resetCurrentVals();
      this.initRequest();
    },

    resetCurrentVals() {
      for (var key in defaultVals) {
        config[key] = localStorage[key] || defaultVals[key];
      }
    },

    initRequest() {
      this.getCurrentExchangeRate();
      var self = this;
      this.globalIntervalId = window.setInterval(() => {
        self.resetCurrentVals();
        self.getCurrentExchangeRate();
      }, config.refresh_time);
    },

    getCurrentExchangeRate() {
      var request = new XMLHttpRequest();
      if (request == null) {
        console.error('Unable to create request!');
      } else {
        request.onreadystatechange = () => {
          if (request.readyState == 4) {
            Crypto.handleResponse(request.responseText);
          }
        }

        var url = 'https://api.coinmarketcap.com/v1/ticker/' + config.crypto_currency + '/?convert=' + config.currency;

        request.open('GET', url, true);
        request.send(null);
      }
    },

    handleResponse(response) {
      if (response.length == 0) {
        setBadge('---');
      } else {
        var results = JSON.parse(response)[0];
        var current_currency = 'price_' + config.currency.toLowerCase();
        var current_rate = results[current_currency];

        if (current_rate > 100) {
          current_rate = Math.round(current_rate).toString();
        } else {
          current_rate = parseFloat(current_rate).toFixed(2).toString();
        }

        var percent_change = (results['percent_change_1h']).toString();
        Crypto.setBadge(current_rate, percent_change);
      }
    },

    setBadge(current_rate, percent_change) {
      var color = percent_change >= 0 ? config.green_color : config.red_color;
      chrome.browserAction.setBadgeBackgroundColor({ color: color });
      chrome.browserAction.setBadgeText({ text: current_rate });
    }
  }

  return Crypto;
})().init();
