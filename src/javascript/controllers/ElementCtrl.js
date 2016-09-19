function ElementCtrl($scope, $routeParams, $http) {
  $scope.namespace = $routeParams.namespace;

  // XHR  to get element details
  $http.get('./source/' + $routeParams.namespace + '/classes/' + $routeParams.className + '.json').success(function(data) {
    $scope.class = data;

    // search data for the element we need
    for (var type in data.elements) {
      var element = data.elements[type];

      if (element.properties) {
        element.properties.forEach(function(property) {
          if (property.name == $routeParams.elementName) {
            $scope.property = property;
          }
        });
      }

      if (element.methods) {
        element.methods.forEach(function(method) {
          if (method.name == $routeParams.elementName) {
            $scope.method = method;
          }
        });
      }
    }
  });
}

