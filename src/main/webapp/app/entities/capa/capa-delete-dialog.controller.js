(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .controller('CapaDeleteController',CapaDeleteController);

    CapaDeleteController.$inject = ['$uibModalInstance', 'entity', 'Capa'];

    function CapaDeleteController($uibModalInstance, entity, Capa) {
        var vm = this;

        vm.capa = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Capa.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
