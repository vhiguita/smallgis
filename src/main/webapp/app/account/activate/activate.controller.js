(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .controller('ActivationController', ActivationController);

    ActivationController.$inject = ['$stateParams', '$state', 'Auth', 'LoginService'];

    function ActivationController ($stateParams, $state, Auth, LoginService) {
        var vm = this;

        Auth.activateAccount({key: $stateParams.key}).then(function () {
            vm.error = null;
            vm.success = 'OK';
        }).catch(function () {
            vm.success = null;
            vm.error = 'ERROR';
        });

        //vm.login = LoginService.open;
        vm.login=login;
        function login () {
          //$state.go('login');//Uncomment on development
          window.location.href="http://login.smallgis.co/";//Uncomment on production
        }

    }
})();
