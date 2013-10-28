function ContentsListCtrl($scope, $http) {
  $scope.namespace = 'indesign';


  $scope.update = function() {
    // XHR to get the map data
    $http.get('./source/' + $scope.namespace + '/contents.json').success(function(data) {
      $scope.classes = data;
    });
  };

  $scope.update();
}
