(function() {
	var defaultVals = {
	  'currency': 'USD',
	  'symbol': '$',
	  'symbol_prefix': true,
	};
  
	var config = {};
  
	var Options = {
	  init: function () {
		this.resetConfigVars();
		this.initializeContent();
		this.registerListeners();
	  },
  
	  initializeContent: function () {
		$('#user_currency').val(config.currency);
	  },
  
	  registerListeners: function () {
		var self = this;
		$('#btnSaveOptions').on('click', function() {
		  $(this).find('#user_currency').val();
		  localStorage['currency'] = $('#user_currency').val();
		  self.resetConfigVars();
		});
	  },
  
	  resetConfigVars: function () {
		for (var key in defaultVals) {
		  config[key] = localStorage[key] || defaultVals[key];
		}
	  },
	};
  
	return Options;
  })().init();
