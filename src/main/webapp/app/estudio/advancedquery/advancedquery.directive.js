'use strict';

angular.module('smallgisApp')
  .directive('advancedquery', function () {
    return {
      templateUrl: 'app/estudio/advancedquery/advancedquery.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
