(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('statistics', {
            parent: 'account',
            url: '/statistics',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'global.form.statistics'
            },
            views: {
                'content@': {
                    templateUrl: 'app/account/statistics/statistics.html',
                    controller: 'StatisticsController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('statistics');
                    return $translate.refresh();
                }]
            }
        });
    }
})();
