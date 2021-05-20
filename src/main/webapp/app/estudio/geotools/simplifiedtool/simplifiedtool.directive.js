'use strict';

angular.module('smallgisApp')
  .directive('simplifiedtool', function () {
    return {
      templateUrl: 'app/estudio/geotools/simplifiedtool/simplifiedtool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
