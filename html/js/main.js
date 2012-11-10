var myApp = angular.module('myApp',[]);



function mainCtrl ($scope, $element, $rootScope) {
	var jqElement = $($element);
	var $frontpage = jqElement.find('#frontpage');
	var $makeReport = jqElement.find('#make-report');
	var $viewReports = jqElement.find('#view-reports');
	$makeReport.hide();
	$viewReports.hide();

	
	
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
		console.log('make');
		$rootScope.$broadcast('make', 'Hello World');
	}
	
	$scope.view = function view () {
		console.log('view');
		$rootScope.$broadcast('view', 'Hello World');
	}
	
}


function makeReportCtrl ($scope, $element, $rootScope) {

}

function viewReportsCtrl ($scope, $element, $rootScope) {

}