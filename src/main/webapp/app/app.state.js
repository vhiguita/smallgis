(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider','$mdThemingProvider'];

    function stateConfig($stateProvider,$mdThemingProvider) {
      //configurar tema de Angular Material
      $mdThemingProvider.theme('default')
      .primaryPalette('grey')
      .accentPalette('orange')
      .warnPalette('red');
        $stateProvider.state('app', {
            abstract: true,
            views: {
                'navbar@': {
                    templateUrl: 'app/layouts/navbar/navbar.html',
                    controller: 'NavbarController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                authorize: ['Auth',
                    function (Auth) {
                        return Auth.authorize();
                    }
                ],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('global');
                }]
            }
        });

    }
})();
