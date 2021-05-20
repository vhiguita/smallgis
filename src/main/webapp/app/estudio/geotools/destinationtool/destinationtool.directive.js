'use strict';

angular.module('smallgisApp')
  .directive('destinationtool', function () {
    return {
      templateUrl: 'app/estudio/geotools/destinationtool/destinationtool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
