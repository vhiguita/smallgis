(function() {
    'use strict';
    angular
        .module('smallgisApp')
        .factory('Mapa', Mapa);

    Mapa.$inject = ['$resource'];

    function Mapa ($resource) {
        var resourceUrl =  'api/mapas/:id';

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
