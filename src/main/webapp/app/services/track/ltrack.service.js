(function () {
    'use strict';

    angular
        .module('smallgisApp')
        .factory('Track', Track);

    Track.$inject = ['$resource'];

    function Track($resource) {
        var service = $resource('api/tracks/:companyid', {}, {
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
