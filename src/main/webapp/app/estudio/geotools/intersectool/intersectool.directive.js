'use strict';

angular.module('smallgisApp')
  .directive('intersectool', function () {
    return {
      templateUrl: 'app/estudio/geotools/intersectool/intersectool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
