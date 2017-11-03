chrome.runtime.onStartup.addListener(function(){
	BitConnect.setupExtension();
});

chrome.runtime.onInstalled.addListener(function(){
	BitConnect.setupExtension();
});

chrome.alarms.onAlarm.addListener(function(alarm) {
	if (alarm.name == chrome.runtime.getManifest().name) {
		BitConnect.getCurrentExchangeRate();
	}
  });

var BitConnect = {
	setupExtension: function(receiver) {
		chrome.browserAction.setBadgeBackgroundColor({color: [0,0,0,128]});
		this.startRequesting();
	},

	startRequesting: function() {
		this.getCurrentExchangeRate();
		var self = this;
		this.globalIntervalId = window.setInterval(function() {
			self.getCurrentExchangeRate();
		}, 20000);
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

			var url = "https://api.coinmarketcap.com/v1/ticker/bitconnect/";
			request.open("GET", url, true);
			request.send(null);
		}
	},

	handleResponse: function(response) {
		if (response.length == 0) {
			setBadge("---");
		} else {
			var results = JSON.parse(response);
			var current_rate = Math.round(results[0].price_usd).toString();
			BitConnect.setBadge(current_rate);
		}
	},

	setBadge: function(current_rate) {
		chrome.browserAction.setBadgeText({text: current_rate});
	}
}
