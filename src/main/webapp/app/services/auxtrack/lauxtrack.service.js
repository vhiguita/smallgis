(function () {
    'use strict';

    angular
        .module('smallgisApp')
        .factory('Auxtrack', Auxtrack);

    Auxtrack.$inject = ['$resource'];

    function Auxtrack($resource) {
        var service = $resource('api/auxtracks/:id', {}, {
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
            'delete':{ method:'DELETE',params: {id: 'id'}}
        });

        return service;
    }
})();
