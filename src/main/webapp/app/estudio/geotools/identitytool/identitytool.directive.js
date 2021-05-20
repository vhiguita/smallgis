'use strict';

angular.module('smallgisApp')
  .directive('identitytool', function () {
    return {
      templateUrl: 'app/estudio/geotools/identitytool/identitytool.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
