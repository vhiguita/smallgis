(function() {
  'use strict';

  angular
    .module('smallgisApp')
    .config(stateConfig);

  stateConfig.$inject = ['$stateProvider'];

  function stateConfig($stateProvider) {
    $stateProvider.state('app1', {
      parent: 'app',
      url: '/app1/:appId/:mapId',
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'apps'
      },
      views: {
        'content@': {
          templateUrl: 'app/apps/templates/app1/app1.html',
          controller: 'app1Controller',
          controllerAs: 'vm'
        }
      },
      resolve: {

      }
    });
  }
})();
