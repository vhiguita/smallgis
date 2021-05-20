'use strict';

angular.module('smallgisApp')
  .directive('midpointtool', function () {
    return {
      templateUrl: 'app/estudio/geotools/midpointtool/midpointtool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
