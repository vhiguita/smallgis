(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .controller('AplicacionController', AplicacionController);

    AplicacionController.$inject = ['$scope', '$state', 'Aplicacion'];

    function AplicacionController ($scope, $state, Aplicacion) {
        var vm = this;
        
        vm.aplicacions = [];

        loadAll();

        function loadAll() {
            Aplicacion.query(function(result) {
                vm.aplicacions = result;
            });
        }
    }
})();
