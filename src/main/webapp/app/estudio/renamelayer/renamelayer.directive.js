'use strict';

angular.module('smallgisApp')
  .directive('renamelayer', function () {
    return {
      templateUrl: 'app/estudio/renamelayer/renamelayer.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
