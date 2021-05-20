'use strict';

angular.module('smallgisApp')
  .directive('squaretool', function () {
    return {
      templateUrl: 'app/estudio/geotools/squaretool/squaretool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
