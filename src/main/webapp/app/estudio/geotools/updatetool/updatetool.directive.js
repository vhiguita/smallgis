'use strict';

angular.module('smallgisApp')
  .directive('updatetool', function () {
    return {
      templateUrl: 'app/estudio/geotools/updatetool/updatetool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
