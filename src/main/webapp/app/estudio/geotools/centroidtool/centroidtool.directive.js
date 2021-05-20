'use strict';

angular.module('smallgisApp')
  .directive('centroidtool', function () {
    return {
      templateUrl: 'app/estudio/geotools/centroidtool/centroidtool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
