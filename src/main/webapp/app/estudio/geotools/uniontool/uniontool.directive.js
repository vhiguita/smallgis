'use strict';

angular.module('smallgisApp')
  .directive('uniontool', function () {
    return {
      templateUrl: 'app/estudio/geotools/uniontool/uniontool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
