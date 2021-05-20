'use strict';

angular.module('smallgisApp')
  .directive('clasifylayer', function () {
    return {
      templateUrl: 'app/estudio/clasifylayer/clasifylayer.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
