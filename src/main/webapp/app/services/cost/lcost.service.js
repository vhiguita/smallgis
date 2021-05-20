(function () {
    'use strict';

    angular
        .module('smallgisApp')
        .factory('Cost', Cost);

    Cost.$inject = ['$resource'];

    function Cost($resource) {
        var service = $resource('api/costos/:id', {}, {
            'query': {method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'save': { method:'POST' },
            'update': { method:'PUT' },
            'delete':{ method:'DELETE'}
        });
        return service;
    }
})();
