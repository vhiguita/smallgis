'use strict';

angular.module('smallgisApp')
  .directive('polilinetool', function () {
    return {
      templateUrl: 'app/estudio/geotools/polilinetool/polilinetool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
