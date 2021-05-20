(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .controller('MapaDetailController', MapaDetailController);

    MapaDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Mapa'];

    function MapaDetailController($scope, $rootScope, $stateParams, entity, Mapa) {
        var vm = this;

        vm.mapa = entity;

        var unsubscribe = $rootScope.$on('smallgisApp:mapaUpdate', function(event, result) {
            vm.mapa = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
