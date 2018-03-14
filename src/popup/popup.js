(() => {
  var defaultVals = {
    'currency': 'USD',
    'crypto_currency': 'bitcoin',
    'symbol': '$',
    'symbol_prefix': true,
    'green_color': '#1A9923',
    'red_color': '#D0021B',
  };

  var config = {};

  var Popup = {
    init() {
      this.resetConfig();
      this.requestData();
    },

    resetConfig() {
      for (var key in defaultVals) {
        config[key] = localStorage[key] || defaultVals[key];
      }

      if (config.currency === 'USD') {
        config.symbol = '$';
        config.symbol_prefix = true;
      } else if (config.currency === 'EUR') {
        config.symbol = '\u20AC';
        config.symbol_prefix = true;
      } else if (config.currency === 'CAD') {
        config.symbol = '$';
        config.symbol_prefix = true;
      } else if (config.currency === 'GBP') {
        config.symbol = '\u00A3';
        config.symbol_prefix = true;
      } else if (config.currency === 'CNY') {
        config.symbol = '\u5143';
        config.symbol_prefix = true;
      } else if (config.currency === 'JPY') {
        config.symbol = '\u00A5';
        config.symbol_prefix = true;
      } else if (config.currency === 'INR') {
        config.symbol = '\u20B9';
        config.symbol_prefix = true;
      } else if (config.currency === 'RUB') {
        config.symbol = '\u20BD';
        config.symbol_prefix = true;
      } else if (config.currency === 'HKD') {
        config.symbol = 'HK$';
        config.symbol_prefix = true;
      } else {
        config.symbol = config.currency;
        config.symbol_prefix = false;
      }
    },

    resetArrows() {
      this.hideElement('.icon-up');
      this.hideElement('.icon-down');
      $('span').each(() => {
        $(this).text('-');
      });
    },

    updateFiatPrice(element, price) {
      var fixedPrice = parseFloat(Math.round(price * 100) / 100).toFixed(2);
      var text = config.symbol_prefix ? config.symbol + fixedPrice : fixedPrice + config.symbol;
      $(element).text(text);
    },

    updateBitconPrice(element, price) {
      var text = '\u0243' + price;
      $(element).text(text);
    },

    requestData() {
      var request = new XMLHttpRequest();
      if (request == null) {
        console.error('Unable to create request!');
      } else {
        request.onreadystatechange = () => {
          if (request.readyState == 4) {
            Popup.handleResponse(request.responseText);
          }
        }

        var url = 'https://api.coinmarketcap.com/v1/ticker/' + config.crypto_currency + '/?convert=' + config.currency;

        request.open('GET', url, true);
        request.send(null);
      }
    },

    handleResponse(response) {
      if (response.length == 0) {
        console.error('Empty response!');
      } else {
        var results = JSON.parse(response)[0];
        var currency_price_name = 'price_' + config.currency.toLowerCase();
        var current_price_btc = results['price_btc'].toString();
        var percent_change_1h = (results['percent_change_1h']).toString();
        var percent_change_24h = (results['percent_change_24h']).toString();
        var percent_change_7d = (results['percent_change_7d']).toString();
        var current_price = results[currency_price_name];

        if (current_price > 100) {
          current_price = Math.round(current_price).toString();
        } else {
          current_price = parseFloat(current_price).toFixed(2).toString();
        }

        Popup.updateFiatPrice('.price-fiat', current_price);
        Popup.updateBitconPrice('.price-btc', current_price_btc);
        Popup.updatePercentage('.hour', percent_change_1h);
        Popup.updatePercentage('.day', percent_change_24h);
        Popup.updatePercentage('.week', percent_change_7d);
        Popup.setBadge(current_price, percent_change_1h);
      }
    },

    updatePercentage(element, percentage) {
      if (element === '.hour') {
        if (percentage >= 0) {
          this.hideElement('.icon-down');
          this.showElement('.icon-up');
        } else {
          this.hideElement('.icon-up');
          this.showElement('.icon-down');
        }
      }

      var percentageText = percentage >= 0 ? '+' : '';
      var text = percentageText + percentage + '%';
      $(element).text(text);
    },

    hideElement(element) {
      $(element).css('visibility', 'hidden');
    },

    showElement(element) {
      $(element).css('visibility', 'visible');
    },

    setBadge(current_rate, percent_change) {
      var color = percent_change >= 0 ? config.green_color : config.red_color;
      chrome.browserAction.setBadgeBackgroundColor({ color: color });
      chrome.browserAction.setBadgeText({ text: current_rate });
    }

  };

  return Popup;
})().init();
