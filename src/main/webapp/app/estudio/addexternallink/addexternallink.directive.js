'use strict';

angular.module('smallgisApp')
  .directive('addexternallink', function () {
    return {
      templateUrl: 'app/estudio/addexternallink/addexternallink.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
