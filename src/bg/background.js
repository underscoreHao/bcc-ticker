(function() {
	var defaultVals = {
		'refresh_time': 20000,
		'green_color': "#7ED321",
		'red_color': "#D0021B",
		'currency': "USD",
		'crypto_currency': "bitcoin",
	};

	var config = {};

	var BitConnect = {
		init: function() {
			this.resetCurrentVals();
			this.initRequest();
		},

		resetCurrentVals: function() {
			for (var key in defaultVals) {
				config[key] = localStorage[key] || defaultVals[key];
			}
		},
	
		initRequest: function() {
			this.getCurrentExchangeRate();
			var self = this;
			this.globalIntervalId = window.setInterval(function() {
				self.resetCurrentVals();
				self.getCurrentExchangeRate();
			}, config.refresh_time);
		},
	
		getCurrentExchangeRate: function() {
			var request = new XMLHttpRequest();
			if (request == null) {
				console.error("Unable to create request!");
			} else {
				request.onreadystatechange = function() {
					if (request.readyState == 4) {
						BitConnect.handleResponse(request.responseText);
					}
				}
	
				var url = "https://api.coinmarketcap.com/v1/ticker/" + config.crypto_currency + "/?convert=" + config.currency;

				request.open("GET", url, true);
				request.send(null);
			}
		},
	
		handleResponse: function(response) {
			if (response.length == 0) {
				setBadge("---");
			} else {
				var results = JSON.parse(response)[0];
				var current_currency = "price_" + config.currency.toLowerCase();
				var current_rate = Math.round(results[current_currency]).toString();
				var percent_change = (results["percent_change_1h"]).toString();
				BitConnect.setBadge(current_rate, percent_change);
			}
		},
	
		setBadge: function(current_rate, percent_change) {
			var color = percent_change >= 0 ? config.green_color : config.red_color;
			chrome.browserAction.setBadgeBackgroundColor({color: color});
			chrome.browserAction.setBadgeText({text: current_rate});
		}
	}

	return BitConnect;
	
})().init();
