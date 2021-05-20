'use strict';

angular.module('smallgisApp')
  .directive('convextool', function () {
    return {
      templateUrl: 'app/estudio/geotools/convextool/convextool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
