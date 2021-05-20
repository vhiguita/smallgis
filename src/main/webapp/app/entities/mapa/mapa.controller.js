(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .controller('MapaController', MapaController);

    MapaController.$inject = ['$scope', '$state', 'Mapa'];

    function MapaController ($scope, $state, Mapa) {
        var vm = this;
        
        vm.mapas = [];

        loadAll();

        function loadAll() {
            Mapa.query(function(result) {
                vm.mapas = result;
            });
        }
    }
})();
