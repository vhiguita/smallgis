'use strict';

angular.module('smallgisApp')
  .directive('distancetool', function () {
    return {
      templateUrl: 'app/estudio/geotools/distancetool/distancetool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
