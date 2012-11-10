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
	var markers = [];
	
	
	
	var highZoomData = [
		{location: new google.maps.LatLng(40.7143528, -74.0059731), weight: 1},
		{location: new google.maps.LatLng(40.5143528, -73.0059731), weight: .2},
		{location: new google.maps.LatLng(41.7143528, -75.0059731), weight: 1},
		{location: new google.maps.LatLng(39.7143528, -74.1059731), weight: .5},
		{location: new google.maps.LatLng(40.7143528, -74.1059731), weight: .4}
	];
	
	var heatmap = new google.maps.visualization.HeatmapLayer({
	  data: highZoomData,
	  dissipating: true
	});
	
	var lowZoomData = [
		new google.maps.LatLng(40.7143528, -74.0059731),
		new google.maps.LatLng(40.7243528, -74.0159731),
		new google.maps.LatLng(40.7133528, -74.0259731),
		new google.maps.LatLng(40.7123528, -74.0029731),
		new google.maps.LatLng(40.7213528, -74.0049731),
		new google.maps.LatLng(40.7233528, -74.0029731),
		new google.maps.LatLng(40.7093528, -74.0129731),
		new google.maps.LatLng(40.7083528, -74.0109731),
		new google.maps.LatLng(40.7073528, -74.0189731),
		new google.maps.LatLng(40.7223528, -74.0199731)
	
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
		
		placeHeatmap();
		//placeMarkers();
		
		google.maps.event.addListener(map, 'zoom_changed', zoomHandler);
		
	});
	
	function zoomHandler() {
		if (typeof this.heatmap == 'undefined')
			this.heatmap = true;
		var z = map.getZoom();
		console.log(z);
		if (this.heatmap && z >=10) {
			//if past zoom 10 and heatmap is still there
			//remove the heatmap, place markers
			placeMarkers();
			removeHeatmap();
			this.heatmap = false;
		} else if (this.heatmap && z < 10) {
			//if zoom is low and heatmap is already there
			//do nothing
			return;
		} else if (!this.heatmap && z < 10) {
			//if zoom is low and heatmap is not there
			//place the heatmap, remove the markers
			placeHeatmap();
			removeMarkers();
			this.heatmap = true;
		}
	}
	
	
	function placeMarkers() {
		var d = lowZoomData;
		var i = d.length;
		var c;
		var mr = markers;
		var mp = map;
		for (;i--;) {
			c = d[i];
			//console.log(c);
			mr.push(
				new google.maps.Marker({
					position: c,
					map: mp,
					title:"Hello World!"
				})
			);
		}
	}
	
	function removeMarkers() {
		var mr = markers;
		var i = mr.length;
		for (;i--;) {
			mr[i].setMap(null);
		}
	}
	
	
	function placeHeatmap() {
		heatmap.setMap(map);
	}
	
	function removeHeatmap() {
		heatmap.setMap(null);
	}
	
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
















