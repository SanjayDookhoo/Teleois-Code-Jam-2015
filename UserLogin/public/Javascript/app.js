var app = angular.module("myApp", ['ui.router']);
app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider.state('home', {
        url: '/login',
        templateUrl: 'Templates/LogIn.html',
        controller: 'LogInCtrl'
    })
    .state('SignUp', {
        url: '/signup',
        templateUrl: 'Templates/SignUp.html',
        controller: 'SignUpCtrl'
    })
    .state('Map', {
        url: '/map',
        templateUrl: 'Templates/Map.html',
        controller: 'MapCtrl'
    })
    .state('User', {
        url: '/user',
        templateUrl: 'Templates/UserPage.html',
        controller: 'UserCtrl'
    })
})