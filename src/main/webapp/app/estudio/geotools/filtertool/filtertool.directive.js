'use strict';

angular.module('smallgisApp')
  .directive('filtertool', function () {
    return {
      templateUrl: 'app/estudio/geotools/filtertool/filtertool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
