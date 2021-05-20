'use strict';

angular.module('smallgisApp')
  .directive('beziertool', function () {
    return {
      templateUrl: 'app/estudio/geotools/beziertool/beziertool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
