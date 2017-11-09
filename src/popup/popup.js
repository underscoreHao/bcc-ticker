(function() {
	var defaultVals = {
		'currency': 'USD',
		'symbol': '$',
		'symbol_prefix': true,
		'green_color': '#7ED321',
		'red_color': '#D0021B',
	};

	var config = {};

	var Popup = {
		init: function() {
			this.resetConfig();
			this.initializeContent();
			this.requestData();
		},

		initializeContent: function() {
			$('input[value=' + config.currency + ']').prop('checked', true);
		},

		resetConfig: function() {
			for (var key in defaultVals) {
				config[key] = localStorage[key] || defaultVals[key];
			}
			
			if (config.currency === 'USD') {
				config.symbol = '$';
				config.symbol_prefix = true;
			}
		},

		resetArrows: function() {
			this.hideElement('.icon-up');
			this.hideElement('.icon-down');
			$('span').each(function() {
				$(this).text('-');
			});
		},

		updateFiatPrice: function(element, price) {
			var fixedPrice = parseFloat(Math.round(price * 100) / 100).toFixed(2);
			var text = config.symbol_prefix ? config.symbol + fixedPrice : fixedPrice + config.symbol;
			$(element).text(text);
		},

		updateBitconPrice: function(element, price) {
			var text = "\u0243" + price;
			$(element).text(text);
		},

		requestData: function() {
			var request = new XMLHttpRequest();
			if (request == null) {
				console.error("Unable to create request!");
			} else {
				request.onreadystatechange = function() {
					if (request.readyState == 4) {
						Popup.handleResponse(request.responseText);
					}
				}
	
				var url = "https://api.coinmarketcap.com/v1/ticker/bitconnect/?convert=" + config.currency;

				request.open("GET", url, true);
				request.send(null);
			}
		},

		handleResponse: function(response) {
			if (response.length == 0) {
				console.error("Empty response!");
			} else {
				var results = JSON.parse(response)[0];
				var currency_price_name = "price_" + config.currency.toLowerCase();
				var current_price = Math.round(results[currency_price_name]).toString();
				var current_price_btc = results["price_btc"].toString();
				var percent_change_1h = (results["percent_change_1h"]).toString();
				var percent_change_24h = (results["percent_change_24h"]).toString();
				var percent_change_7d = (results["percent_change_7d"]).toString();

				Popup.updateFiatPrice('.price-fiat', current_price);
				Popup.updateBitconPrice('.price-btc', current_price_btc);
				Popup.updatePercentage('.hour', percent_change_1h);
				Popup.updatePercentage('.day', percent_change_24h);
				Popup.updatePercentage('.week', percent_change_7d);
				Popup.setBadge(current_price, percent_change_1h);
			}
		},

		updatePercentage: function(element, percentage) {
			if (element === '.hour') {
				if (percentage >= 0)
				{
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

		hideElement: function(element) {
			$(element).css('visibility', 'hidden');
		},
	  
		showElement: function(element) {
			$(element).css('visibility', 'visible');
		},

		setBadge: function(current_rate, percent_change) {
			var color = Math.sign(percent_change) ? config.green_color : config.red_color;
			chrome.browserAction.setBadgeBackgroundColor({color: color});
			chrome.browserAction.setBadgeText({text: current_rate});
		}

	};
	
	return Popup;
})().init();
