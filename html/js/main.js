var myApp = angular.module('myApp',[]);

var geocoder = new google.maps.Geocoder();
var defaultLocation = new google.maps.LatLng(40.7143528, -74.0059731);

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(setGeoLocation, showError);
}


function setGeoLocation(position) {
	//console.log(position);
	defaultLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
}

function showError(error) {
	console.log('Could not get GeoLocation');
	console.log(error);
}

function mainCtrl ($scope, $element, $rootScope) {
	var jqElement = $($element);
	var $frontpage = jqElement.find('#frontpage');
	var $makeReport = jqElement.find('#make-report');
	var $viewReports = jqElement.find('#view-reports');
	//$makeReport.hide();
	//$viewReports.hide();

	
	$rootScope.$on('home', function (event, data) {
		$frontpage.show();
		$makeReport.hide();
		$viewReports.hide();
	});
	
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
	var step = 1;
	$scope.reportData = {};
	
	var $step1 = $($element).find('#step1');
	var $step2 = $($element).find('#step2');
	var $step3 = $($element).find('#step3');
	var $result = $($element).find('#result');
	
	$rootScope.$on('make', function (event, data) {
		var mapOptions = {
		  center: defaultLocation,
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
			geocoder.geocode({'latLng': event.latLng}, setLocationData);
			
		});
		
	});
	
	
	
	$scope.next = function next() {
		if (step === 1) {
			if (typeof $scope.reportData.location == 'undefined') {
				
				alert('Select a location');
			} else {
				$step1.hide();
				$step2.show();
				step++;
			}			
			return;
		} else if (step === 2) {
			//console.log($scope.reportData);
			if (validateForm()) {
				//console.log('all ok');
				//submit data
				socket.emit('create-report', $scope.reportData);
				//disable forms
				$($element).find('#step2').find('input, select, textarea').attr('disabled', true);
			} else {
				alert('Please fill in required fields.');
			}
			return;
		}
	
	
	
	
	
	}
	
	//One of these will fire after form submission
	socket.on('save-success', function(data) {
		//on success move to step 3
		/*
		step++;
		$scope.reportData._id = data;
		$step2.hide();
		$step3.show();
		*/
		//No Step 3 yet...
		alert('Saved. Sorry, image upload not working...');
		$rootScope.$broadcast('home');
		
		$step1.show();
		$step2.hide();
		marker.setMap();
		marker = null;
		$scope.reportData = {};
	});
	
	socket.on('save-error', function(data) {
		//on fail, alert then go home 
		alert('Error: Could not save the data.');
		$rootScope.$broadcast('home');
	});
	
	
	
	
	function validateForm () {
		var formData = $scope.reportData;
		
		if (typeof formData.type === 'undefined'  ||  formData.type === '') {
			return false;
		} else if (typeof formData.date === 'undefined'  ||  formData.date === '') {
			return false;
		} else if (typeof formData.details === 'undefined'  ||  formData.details === '') {
			return false;
		}
		return true;
		
		formData = null;
	}
	
	function setLocationData (data) {
		if(!data.length) return;
		var location = data[0];
		//console.log(location);
		var formattedData = {};
		var a = location.address_components;
		var i = a.length;
		var c;
		
		var latLng = marker.getPosition();
		
		formattedData.Ya = latLng.Ya;
		formattedData.Za = latLng.Za;
		
		
		for	(;i--;) {
			c = a[i];
			
			switch (c.types[0]) {
				case 'locality' : 
					formattedData.locality = c.long_name;
				break;
				case 'administrative_area_level_2' :
					if (!formattedData.areaLevel1) formattedData.areaLevel1 = c.long_name;
				break;
				case 'administrative_area_level_1' : 
					formattedData.areaLevel1 = c.long_name;
				break;
				case 'country' : 
					formattedData.country = c.short_name;
				break;
			
			}
			
		}
		
		//console.log(formattedData);
		
		$scope.reportData.location = formattedData;
		
		
		formattedData = null;
	}
	
	
	
	
	
	
	
	


}

function viewReportsCtrl ($scope, $element, $rootScope) {
	var map;
	var markers = [];
	$scope.currentReport = {};
	
	
	var highZoomData = [
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
		socket.emit('get-hzd');
	
		var mapOptions = {
		  center: defaultLocation,
		  zoom: 8,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById("map-display"), mapOptions);
		
		//placeHeatmap();
		//placeMarkers();
		
		google.maps.event.addListener(map, 'zoom_changed', zoomHandler);
		
	});
	
	socket.on('high-zoom-data', function(data) {
		highZoomData.length = 0;
		var row;
		for(var prop in data) {
			
			row = data[prop];
			highZoomData.push({location: new google.maps.LatLng(row.Ya, row.Za), weight: row.count});
		}
		row = null;
		//console.log(highZoomData);
		placeHeatmap();
	});
	
	socket.on('low-zoom-data', function(data) {
		lowZoomData.length = 0;
		//console.log(data);
		var i = data.length;
		var c;
		for (;i--;) {
			c = data[i];
			lowZoomData.push({
				location: new google.maps.LatLng(c.location.Ya, c.location.Za),
				details: c.details,
				event: c.event,
				type: c.type,
				datetime: new Date(Date.parse(c.date))
				
			});
		}
		
		removeMarkers();
		placeMarkers();
	})
	
	
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
			socket.emit('get-lzd');
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
	
	
	
	
}
















