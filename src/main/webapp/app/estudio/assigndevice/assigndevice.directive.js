'use strict';

angular.module('smallgisApp')
  .directive('assigndevice', function () {
    return {
      templateUrl: 'app/estudio/assigndevice/assigndevice.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
