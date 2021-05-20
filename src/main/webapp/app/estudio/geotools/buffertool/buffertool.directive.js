'use strict';

angular.module('smallgisApp')
  .directive('buffertool', function () {
    return {
      templateUrl: 'app/estudio/geotools/buffertool/buffertool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
