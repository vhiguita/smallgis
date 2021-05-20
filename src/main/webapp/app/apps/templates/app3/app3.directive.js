'use strict';

angular.module('smallgisApp')
  .directive('app3', function () {
    return {
      templateUrl: 'app/apps/templates/app3/app3.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
