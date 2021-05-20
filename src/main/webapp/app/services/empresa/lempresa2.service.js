(function () {
    'use strict';

    angular
        .module('smallgisApp')
        .factory('Empresa2', Empresa2);

    Empresa2.$inject = ['$resource'];

    function Empresa2($resource) {
        var service = $resource('api/empresas/:empresanit/:empresacode', {}, {
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
