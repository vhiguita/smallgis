(function () {
    'use strict';

    angular
        .module('smallgisApp')
        .factory('User1', User1);

    User1.$inject = ['$resource'];

    function User1 ($resource) {
        var service = $resource('api/users/getAllUsersByCode/:companyCode', {}, {
            'query': {method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                isArray: true,
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
