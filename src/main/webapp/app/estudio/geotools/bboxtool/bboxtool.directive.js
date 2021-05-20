'use strict';

angular.module('smallgisApp')
  .directive('bboxtool', function () {
    return {
      templateUrl: 'app/estudio/geotools/bboxtool/bboxtool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
