(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('login', {
            parent: 'components',
            url: '/',
            data: {
                authorities: []
            },
            views: {
                'content@': {
                  templateUrl: 'app/components/login/login.html',
                  controller: 'LoginController',
                  controllerAs: 'vm',
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('login');
                    return $translate.refresh();
                }]
            }
        });
    }
})();
