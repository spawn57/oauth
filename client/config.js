var app = angular.module('app', ['chart.js']);

// Optional configuration
app.config(['ChartJsProvider', function (ChartJsProvider) {
	'use strict';		
	// Configure all charts
	ChartJsProvider.setOptions({
	chartColors: ['#FF5252', '#FF8A80'],
	responsive: true
	});
	// Configure all line charts
	ChartJsProvider.setOptions('line', {
	showLines: false
	});
}]);
