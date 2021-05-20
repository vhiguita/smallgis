'use strict';

angular.module('smallgisApp')
  .directive('mergetool', function () {
    return {
      templateUrl: 'app/estudio/geotools/mergetool/mergetool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
