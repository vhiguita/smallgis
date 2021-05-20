(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .controller('CapaDetailController', CapaDetailController);

    CapaDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Capa'];

    function CapaDetailController($scope, $rootScope, $stateParams, entity, Capa) {
        var vm = this;

        vm.capa = entity;

        var unsubscribe = $rootScope.$on('smallgisApp:capaUpdate', function(event, result) {
            vm.capa = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
