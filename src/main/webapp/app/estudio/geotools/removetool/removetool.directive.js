'use strict';

angular.module('smallgisApp')
  .directive('removetool', function () {
    return {
      templateUrl: 'app/estudio/geotools/removetool/removetool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
