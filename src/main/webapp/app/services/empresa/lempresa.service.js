(function () {
    'use strict';

    angular
        .module('smallgisApp')
        .factory('Empresa', Empresa);

    Empresa.$inject = ['$resource'];

    function Empresa($resource) {
        var service = $resource('api/empresas/:empresanit', {}, {
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
