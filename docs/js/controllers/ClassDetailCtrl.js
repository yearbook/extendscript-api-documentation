function ClassDetailCtrl($scope, $routeParams, $http) {
  // XHR  to get class details
  $http.get('./source/' + $routeParams.namespace + '/classes/' + $routeParams.className + '.json').success(function(data) {
    $scope.class = data;
  });
}
