(function() {
  'use strict';

  angular
    .module('smallgisApp')
    .config(stateConfig);

  stateConfig.$inject = ['$stateProvider'];

  function stateConfig($stateProvider) {
    $stateProvider.state('apps', {
      parent: 'app',
      url: '/apps',
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'apps'
      },
      views: {
        'content@': {
          templateUrl: 'app/apps/apps.html',
          controller: 'appsController',
          controllerAs: 'vm'
        }
      },
      resolve: {

      }
    });
  }
})();
