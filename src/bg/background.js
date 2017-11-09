(function() {
	var defaultVals = {
		'refresh_time': 20000,
		'green_color': "#7ED321",
		'red_color': "#D0021B",
		'currency': "USD"
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
	
				var url = "https://api.coinmarketcap.com/v1/ticker/bitconnect/?convert=" + config.currency;

				request.open("GET", url, true);
				request.send(null);
			}
		},
	
		handleResponse: function(response) {
			if (response.length == 0) {
				setBadge("---");
			} else {
				var results = JSON.parse(response);
				var current_currency = "price_" + config.currency.toLowerCase();
				var current_rate = Math.round(results[0][current_currency]).toString();
				var percent_change = (results[0]["percent_change_1h"]).toString();
				BitConnect.setBadge(current_rate, percent_change);
			}
		},
	
		setBadge: function(current_rate, percent_change) {
			var color = Math.sign(percent_change) ? config.red_color : config.green_color;
			chrome.browserAction.setBadgeBackgroundColor({color: color});
			chrome.browserAction.setBadgeText({text: current_rate});
		}
	}

	return BitConnect;
	
})().init();