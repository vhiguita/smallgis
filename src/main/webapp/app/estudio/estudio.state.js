(function() {
  'use strict';

  angular
    .module('smallgisApp')
    .config(stateConfig);

  stateConfig.$inject = ['$stateProvider'];

  function stateConfig($stateProvider) {
    $stateProvider.state('estudio', {
      parent: 'app',
      url: '/estudio',
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'estudio'
      },
      views: {
        'content@': {
          templateUrl: 'app/estudio/estudio.html',
          controller: 'estudioController',
          controllerAs: 'vm'
        }
      },
      resolve: {
        translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('settings');
            return $translate.refresh();
        }]
      }
    });
  }
})();
