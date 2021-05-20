(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .factory('Layer', Layer);

    Layer.$inject = ['$resource'];

    function Layer ($resource) {
      var service = $resource('api/getCapasCount', {}, {
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
