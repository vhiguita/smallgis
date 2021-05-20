(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .factory('LCapa', LCapa);

    LCapa.$inject = ['$rootScope','Layer'];

    function LCapa ($rootScope, Layer) {
        var service = {
            getCapasByUser: getCapasByUser
        };

        return service;

        function getCapasByUser(username, callback) {
            var cb = callback || angular.noop;

            return Layer.get(username,
                function (response) {
                    return cb(response);
                },
                function (err) {
                    return cb(err);
                }.bind(this)).$promise;
        }
    }
})();
