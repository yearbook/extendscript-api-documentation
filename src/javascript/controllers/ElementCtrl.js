function ElementCtrl($scope, $routeParams, $http) {
  $scope.namespace = $routeParams.namespace;

  // XHR  to get element details
  $http.get('./source/' + $routeParams.namespace + '/classes/' + $routeParams.className + '.json').success(function(data) {
    $scope.class = data;

    // search data for the element we need
    data.elements.forEach(function(element) {

      if (element.property) {
        element.property.forEach(function(property) {
          if (property.name == $routeParams.elementName) {
            $scope.property = property;
          }
        });
      }

      if (element.method) {
        element.method.forEach(function(method) {
          if (method.name == $routeParams.elementName) {
            $scope.method = method;
          }
        });
      }

    });
  });
}
