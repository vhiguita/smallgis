'use strict';

angular.module('smallgisApp')
  .directive('withintool', function () {
    return {
      templateUrl: 'app/estudio/geotools/withintool/withintool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
