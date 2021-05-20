'use strict';

angular
  .module('smallgisApp')
  .directive('drawposition', function () {
    return {
      templateUrl: 'app/estudio/drawposition/drawposition.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
