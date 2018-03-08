(function() {
	var defaultVals = {
		'currency': 'USD',
		'crypto_currency': 'bitcoin',
	  'symbol': '$',
	  'symbol_prefix': true,
	};
  
	var config = {};
  
	var Options = {
	  init() {
			this.resetConfigVars();
			this.initializeContent();
			this.registerListeners();
	  },
  
	  initializeContent() {
			$('#user_currency').val(config.currency);
			$('#crypto_currency').val(config.crypto_currency);
	  },
  
	  registerListeners() {
			var self = this;
			$('#btnSaveOptions').on('click', function() {
				$(this).find('#user_currency').val();
				$(this).find('#crypto_currency').val();
				localStorage['currency'] = $('#user_currency').val();
				localStorage['crypto_currency'] = $('#crypto_currency').val();
				self.resetConfigVars();
		});
	  },
  
	  resetConfigVars() {
			for (var key in defaultVals) {
				config[key] = localStorage[key] || defaultVals[key];
			}
	  },
	};
  
	return Options;
  })().init();
