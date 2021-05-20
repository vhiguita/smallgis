(function () {
    'use strict';

    angular
        .module('smallgisApp')
        .factory('Cost1', Cost1);

    Cost1.$inject = ['$resource'];

    function Cost1($resource) {
        var service = $resource('api/costos/getCostos/:businesscode', {}, {
            'query': {method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                   if(data!=""){
                    data = angular.fromJson(data);
                   } 
                   return data;
                }
            }
        });
        return service;
    }
})();
