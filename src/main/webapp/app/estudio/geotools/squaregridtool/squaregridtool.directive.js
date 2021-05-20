'use strict';

angular.module('smallgisApp')
  .directive('squaregridtool', function () {
    return {
      templateUrl: 'app/estudio/geotools/squaregridtool/squaregridtool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
