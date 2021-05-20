(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .factory('Userapp', Userapp);

    Userapp.$inject = ['$rootScope','App'];

    function Userapp ($rootScope, App) {
        var service = {
            getAppsByUser: getAppsByUser
        };

        return service;

        function getAppsByUser(username, callback) {
            var cb = callback || angular.noop;

            return App.get(username,
                function (response) {
                    return cb(response);
                },
                function (err) {
                    return cb(err);
                }.bind(this)).$promise;
        }
    }
})();
