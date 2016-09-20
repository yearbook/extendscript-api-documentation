
var esDocApp = angular.module('esDocApp', ['ngRoute']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {templateUrl: './templates/index.html'})
      .when('/search', {templateUrl: './templates/search.html', controller: SearchCtrl})

      .when('/:namespace/:className', {templateUrl: './templates/class.html', controller: ClassCtrl})
      .when('/:namespace/:className/:elementName', {templateUrl: './templates/element.html', controller: ElementCtrl})

      .otherwise({
        redirectTo: '/'
      });

      // can't use HTML5 mode on GitHub. Boo!
      $locationProvider.html5Mode(false);
}]);

esDocApp.filter('titleCase', function () {
  return function (input) {
    if (! input) {
      return '';
    }

    var words = input.split(' ');

    for (var i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }

    return words.join(' ');
  };
});
