'use strict';

angular.module('smallgisApp')
  .directive('tintool', function () {
    return {
      templateUrl: 'app/estudio/geotools/tintool/tintool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
