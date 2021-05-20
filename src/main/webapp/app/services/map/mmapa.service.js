(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .factory('MMapa', MMapa);

    MMapa.$inject = ['$rootScope','Map'];

    function MMapa ($rootScope, Map) {
        var service = {
            getMapasByUser: getMapasByUser
        };

        return service;

        function getMapasByUser(username, callback) {
            var cb = callback || angular.noop;

            return Map.get(username,
                function (response) {
                    return cb(response);
                },
                function (err) {
                    return cb(err);
                }.bind(this)).$promise;
        }
    }
})();
