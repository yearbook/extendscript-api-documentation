//= require vendor/angular.js
//= require vendor/angular-route.js
//= require vendor/angular-resource.js

//= require controllers/ContentsListCtrl.js
//= require controllers/SearchCtrl.js
//= require controllers/ClassCtrl.js
//= require controllers/ElementCtrl.js

var ybmDocApp = angular.module('ybmDocApp', ['ngRoute']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {templateUrl: './templates/index.jade'})
      .when('/search', {templateUrl: './templates/search.jade', controller: SearchCtrl})

      .when('/:namespace/:className', {templateUrl: './templates/class.jade', controller: ClassCtrl})
      .when('/:namespace/:className/:elementName', {templateUrl: './templates/element.jade', controller: ElementCtrl})

      .otherwise({
        redirectTo: '/'
      });

      // can't use HTML5 mode on GitHub. Boo!
      $locationProvider.html5Mode(false);
}]);

ybmDocApp.filter('titleCase', function () {
  return function (input) {
    var words = input.split(' ');

    for (var i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }

    return words.join(' ');
  };
});
