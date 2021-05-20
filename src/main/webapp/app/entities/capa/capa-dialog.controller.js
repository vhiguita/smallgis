(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .controller('CapaDialogController', CapaDialogController);

    CapaDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Capa'];

    function CapaDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Capa) {
        var vm = this;

        vm.capa = entity;
        vm.clear = clear;
        vm.save = save;

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.capa.id !== null) {
                Capa.update(vm.capa, onSaveSuccess, onSaveError);
            } else {
                Capa.save(vm.capa, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('smallgisApp:capaUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
