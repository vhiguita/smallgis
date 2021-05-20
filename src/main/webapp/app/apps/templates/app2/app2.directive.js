'use strict';

angular.module('smallgisApp')
  .directive('app2', function () {
    return {
      templateUrl: 'app/apps/templates/app2/app2.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
