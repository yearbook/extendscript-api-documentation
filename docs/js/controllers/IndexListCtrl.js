function IndexListCtrl($scope, $http) {
  // XHR to get the map data
  $http.get('./source/index.json').success(function(data) {
    $scope.index = data;
  });
}
