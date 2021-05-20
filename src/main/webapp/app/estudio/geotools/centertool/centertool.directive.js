'use strict';

angular.module('smallgisApp')
  .directive('centertool', function () {
    return {
      templateUrl: 'app/estudio/geotools/centertool/centertool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
