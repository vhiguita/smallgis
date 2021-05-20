'use strict';

angular.module('smallgisApp')
  .directive('concavetool', function () {
    return {
      templateUrl: 'app/estudio/geotools/concavetool/concavetool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
