(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .factory('App', App);

     App.$inject = ['$resource'];

    function  App($resource) {
      var service = $resource('api/getAppsCount', {}, {
          'get': { method: 'GET', params: {}, isArray: false,
              interceptor: {
                  response: function(response) {
                      // expose response
                      return response;
                  }
              }
          }
      });

        return service;
    }
})();
