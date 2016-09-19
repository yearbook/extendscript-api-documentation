function SearchCtrl($scope, $http) {
  // XHR to get the map data
  $http.get('./source/search.json').success(function(data) {
    $scope.search = data;
  });
}
