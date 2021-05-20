'use strict';

angular.module('smallgisApp')
  .directive('alongtool', function () {
    return {
      templateUrl: 'app/estudio/geotools/alongtool/alongtool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
