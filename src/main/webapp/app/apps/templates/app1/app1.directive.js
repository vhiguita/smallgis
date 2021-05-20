'use strict';

angular.module('smallgisApp')
  .directive('app1', function () {
    return {
      templateUrl: 'app/apps/templates/app1/app1.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
