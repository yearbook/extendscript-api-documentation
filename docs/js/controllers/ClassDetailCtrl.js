function ClassDetailCtrl($scope, $routeParams, $http) {
  // XHR  to get class details
  $http.get('./source/classes/' + $routeParams.className + '.json').success(function(data) {
    $scope.class = data;
  });
}
