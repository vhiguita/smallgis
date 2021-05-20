(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .controller('AplicacionDeleteController',AplicacionDeleteController);

    AplicacionDeleteController.$inject = ['$uibModalInstance', 'entity', 'Aplicacion'];

    function AplicacionDeleteController($uibModalInstance, entity, Aplicacion) {
        var vm = this;

        vm.aplicacion = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Aplicacion.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
