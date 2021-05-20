'use strict';

angular.module('smallgisApp')
  .directive('assigndevice', function () {
    return {
      templateUrl: 'app/estudio/assigntable/assigntable.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
