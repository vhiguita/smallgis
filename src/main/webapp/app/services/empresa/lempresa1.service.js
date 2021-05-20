(function () {
    'use strict';

    angular
        .module('smallgisApp')
        .factory('Empresa1', Empresa1);

    Empresa1.$inject = ['$resource'];

    function Empresa1($resource) {
        var service = $resource('api/empresas/getEmpresaCode/:empresacode', {}, {
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
