function ClassCtrl($scope, $routeParams, $http) {
  $scope.namespace = $routeParams.namespace;

  // XHR  to get class details
  $http.get('./source/' + $routeParams.namespace + '/classes/' + $routeParams.className + '.json').success(function(data) {
    $scope.class = data;
  });
}
