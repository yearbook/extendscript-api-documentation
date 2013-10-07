//= require vendor/angular.js
//= require vendor/angular-route.js
//= require vendor/angular-resource.js

//= require controllers/ContentsListCtrl.js
//= require controllers/ClassDetailCtrl.js

var ybmDocApp = angular.module('ybmDocApp', ['ngRoute']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {templateUrl: './templates/index.jade'})
      .when('/:className', {templateUrl: './templates/class-detail.jade', controller: ClassDetailCtrl});
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

// ybmDocApp.controller('ContentsListCtrl', ContentsListCtrl);
