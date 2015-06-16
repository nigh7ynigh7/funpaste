var app = angular.module('app', ['ngResource','ngRoute']);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider){
    $locationProvider.html5Mode({enabled:true,requireBase:false});
    $routeProvider.when('/', {
        templateUrl:'/partials/main/main',
        controller:'mvMainController',
        controllerAs: 'main'
    }).when('/index.html', {
        templateUrl:'/partials/main/main',
        controller:'mvMainController',
        controllerAs: 'main'
    });
}]);

// attribute data
