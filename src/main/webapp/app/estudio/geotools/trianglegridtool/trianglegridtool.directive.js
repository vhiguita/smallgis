'use strict';

angular.module('smallgisApp')
  .directive('squaregridtool', function () {
    return {
      templateUrl: 'app/estudio/geotools/trianglegridtool/trianglegridtool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
