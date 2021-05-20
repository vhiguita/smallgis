(function() {
    'use strict';
    angular
        .module('smallgisApp')
        .factory('Capa', Capa);

    Capa.$inject = ['$resource'];

    function Capa ($resource) {
        var resourceUrl =  'api/capas/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
