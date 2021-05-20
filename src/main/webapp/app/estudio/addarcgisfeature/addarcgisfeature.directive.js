'use strict';

angular.module('smallgisApp')
  .directive('addarcgisfeature', function () {
    return {
      templateUrl: 'app/estudio/addarcgisfeature/addarcgisfeature.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
