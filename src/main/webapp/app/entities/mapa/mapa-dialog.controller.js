(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .controller('MapaDialogController', MapaDialogController);

    MapaDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Mapa'];

    function MapaDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Mapa) {
        var vm = this;

        vm.mapa = entity;
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
            if (vm.mapa.id !== null) {
                Mapa.update(vm.mapa, onSaveSuccess, onSaveError);
            } else {
                Mapa.save(vm.mapa, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('smallgisApp:mapaUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
