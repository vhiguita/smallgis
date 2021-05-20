'use strict';

angular.module('smallgisApp')
  .directive('explodetool', function () {
    return {
      templateUrl: 'app/estudio/geotools/explodetool/explodetool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
