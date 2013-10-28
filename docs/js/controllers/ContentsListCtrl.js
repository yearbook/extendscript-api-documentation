function ContentsListCtrl($scope, $http) {
  $scope.namespace = 'InDesign';

  $scope.update = function() {
    $scope.classes = [];

    // XHR to get the map data
    $http.get('./source/' + $scope.namespace + '/contents.json').success(function(data) {
      $scope.classes = data;
    });
  };

  // do first load
  $scope.update();
}
