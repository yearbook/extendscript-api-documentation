function ContentsListCtrl($scope, $http) {
  // XHR to get the map data
  $http.get('./source/contents.json').success(function(data) {
    $scope.classes = data;
  });
}
