var myApp = angular.module('myApp',[]);



function mainCtrl ($scope, $element, $rootScope) {
	var jqElement = $($element);
	var $frontpage = jqElement.find('#frontpage');
	var $makeReport = jqElement.find('#make-report');
	var $viewReports = jqElement.find('#view-reports');
	//$makeReport.hide();
	//$viewReports.hide();

	
	
	$rootScope.$on('make', function (event, data) {
		$frontpage.hide();
		$makeReport.show();
	});
	
	$rootScope.$on('view', function (event, data) {
		$frontpage.hide();
		$viewReports.show();
	});
	

}




function frontpageCtrl ($scope, $element, $rootScope) {
	
	$scope.make = function make () {
		$rootScope.$broadcast('make', 'Hello World');
	}
	
	$scope.view = function view () {
		$rootScope.$broadcast('view', 'Hello World');
	}
	
}


function makeReportCtrl ($scope, $element, $rootScope) {

}

function viewReportsCtrl ($scope, $element, $rootScope) {
	var map;
	var geocoder;
	
	var lowZoomData = [
	
	];
	
	var highZoomData = [
		{location: new google.maps.LatLng(40.7143528, -74.0059731), weight: 1},
		{location: new google.maps.LatLng(40.5143528, -73.0059731), weight: .2},
		{location: new google.maps.LatLng(41.7143528, -75.0059731), weight: 1},
		{location: new google.maps.LatLng(39.7143528, -74.1059731), weight: .5},
		{location: new google.maps.LatLng(40.7143528, -74.1059731), weight: .4}
	];
	
	var lowZoomData = [
		
	
	];
	
	$rootScope.$on('view', function (event, data) {
		geocoder = new google.maps.Geocoder();
		//geocoder.geocode
		var mapOptions = {
		  center: new google.maps.LatLng(40.7143528, -74.0059731),
		  zoom: 8,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var $mapElement = $($element).find('#map-display');
		console.log($mapElement);
		map = new google.maps.Map(document.getElementById("map-display"), mapOptions);
		
		
		var heatmap = new google.maps.visualization.HeatmapLayer({
		  data: highZoomData,
		  dissipating: true
		});
		
		heatmap.setMap(map);
		
	});
	
	if (navigator.geolocation) {
		console.log('getting location');
		navigator.geolocation.getCurrentPosition(setGeoLocation, showError);
    }

	
	function setGeoLocation(position) {
		console.log('location found');
		console.log(position);
	}
	
	function showError(error) {
		console.log('an error occured');
		console.log(error);
	}
	
	
}
















