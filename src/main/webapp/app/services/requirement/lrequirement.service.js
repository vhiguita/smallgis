(function () {
    'use strict';

    angular
        .module('smallgisApp')
        .factory('Requirement', Requirement);

    Requirement.$inject = ['$resource'];

    function Requirement($resource) {
        var service = $resource('api/requirements/:reqid', {}, {
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
