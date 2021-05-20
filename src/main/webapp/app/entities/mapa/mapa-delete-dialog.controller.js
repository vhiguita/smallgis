(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .controller('MapaDeleteController',MapaDeleteController);

    MapaDeleteController.$inject = ['$uibModalInstance', 'entity', 'Mapa'];

    function MapaDeleteController($uibModalInstance, entity, Mapa) {
        var vm = this;

        vm.mapa = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Mapa.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
