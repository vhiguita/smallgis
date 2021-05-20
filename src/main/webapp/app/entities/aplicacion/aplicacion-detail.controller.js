(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .controller('AplicacionDetailController', AplicacionDetailController);

    AplicacionDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Aplicacion'];

    function AplicacionDetailController($scope, $rootScope, $stateParams, entity, Aplicacion) {
        var vm = this;

        vm.aplicacion = entity;

        var unsubscribe = $rootScope.$on('smallgisApp:aplicacionUpdate', function(event, result) {
            vm.aplicacion = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
