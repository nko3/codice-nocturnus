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
	var map;
	var marker;
	
	$rootScope.$on('make', function (event, data) {
		geocoder = new google.maps.Geocoder();
		//geocoder.geocode
		var mapOptions = {
		  center: new google.maps.LatLng(40.7143528, -74.0059731),
		  zoom: 8,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById("map-pick"), mapOptions);
		
		
		google.maps.event.addListener(map, 'click', function(event) {
			//console.log(event);
			if (typeof marker == 'undefined') {
				marker = new google.maps.Marker({
					position: event.latLng,
					map: map
				});
			} else {
				marker.setPosition(event.latLng);
			}
			
			
		});
		
	});



}

function viewReportsCtrl ($scope, $element, $rootScope) {
	var map;
	var geocoder;
	var markers = [];
	$scope.currentReport = {};
	
	
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
		{location: new google.maps.LatLng(40.7143528, -74.0059731),
		details: 'something goes here',
		event: 'Sandy',
		type: 'flood',
		datetime: new Date()
		
		},
		{location: new google.maps.LatLng(40.7243528, -74.0159731),
		details: 'something else goes here',
		event: 'Sandy',
		type: 'fire',
		datetime: new Date()
		
		},
		{location: new google.maps.LatLng(40.7133528, -74.0259731),
		details: 'blah blah',
		event: 'Irene',
		type: 'hail',
		datetime: new Date()
		
		},
		{location: new google.maps.LatLng(40.7123528, -74.0029731),
		details: 'foo',
		event: 'Sandy',
		type: 'wind',
		datetime: new Date()
		
		},
		{location: new google.maps.LatLng(40.7213528, -74.0049731),
		details: 'bar',
		event: '',
		type: 'flood',
		datetime: new Date()
		
		},
		{location: new google.maps.LatLng(40.7233528, -74.0029731),
		details: 'things',
		event: 'Sandy',
		type: 'wind',
		datetime: new Date()
		
		},
		{location: new google.maps.LatLng(40.7093528, -74.0129731),
		details: 'something',
		event: '',
		type: 'flood',
		datetime: new Date()
		
		}
	
	];
	
	$rootScope.$on('view', function (event, data) {
		geocoder = new google.maps.Geocoder();
		//geocoder.geocode
		var mapOptions = {
		  center: new google.maps.LatLng(40.7143528, -74.0059731),
		  zoom: 8,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById("map-display"), mapOptions);
		
		placeHeatmap();
		//placeMarkers();
		
		google.maps.event.addListener(map, 'zoom_changed', zoomHandler);
		
	});
	
	function zoomHandler() {
		if (typeof this.heatmap == 'undefined')
			this.heatmap = true;
		var z = map.getZoom();
		//console.log(z);
		if (this.heatmap && z >=10) {
			//if past zoom 10 and heatmap is still there
			//remove the heatmap, place markers
			this.heatmap = false;
			placeMarkers();
			removeHeatmap();
		} else if (this.heatmap && z < 10) {
			//if zoom is low and heatmap is already there
			//do nothing
			return;
		} else if (!this.heatmap && z < 10) {
			//if zoom is low and heatmap is not there
			//place the heatmap, remove the markers
			this.heatmap = true;
			placeHeatmap();
			removeMarkers();
		}
	}
	
	
	function placeMarkers() {
		var d = lowZoomData;
		var i = d.length;
		var c;
		var mr = markers;
		var mp = map;
		var holder;
		for (;i--;) {
			c = d[i];
			//console.log(c);
			
			holder = new google.maps.Marker({
						position: c.location,
						map: mp
					});
			
			google.maps.event.addListener(holder, 'click', (function() {
				var clicked = c;
				//console.log(clicked);
				return function() {
					setCurrentReport(clicked);
				}
			})()
			);
			 
			
			mr.push(holder);
		}
	}
	
	function setCurrentReport(data) {
		$scope.currentReport = data;
		//console.log(data);
		$scope.$apply();
	}
	
	function removeMarkers() {
		var mr = markers;
		var i = mr.length;
		for (;i--;) {
			mr[i].setMap(null);
		}
		mr.length = 0;
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
















