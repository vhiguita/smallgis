(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .factory('Map', Map);

    Map.$inject = ['$resource'];

    function Map ($resource) {
      var service = $resource('api/getMapasCount', {}, {
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
