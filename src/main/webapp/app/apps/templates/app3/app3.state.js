(function() {
  'use strict';

  angular
    .module('smallgisApp')
    .config(stateConfig);

  stateConfig.$inject = ['$stateProvider'];

  function stateConfig($stateProvider) {
    $stateProvider.state('app3', {
      parent: 'app',
      url: '/app3/:appId/:mapId',
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'apps'
      },
      views: {
        'content@': {
          templateUrl: 'app/apps/templates/app3/app3.html',
          controller: 'app3Controller',
          controllerAs: 'vm'
        }
      },
      resolve: {

      }
    });
  }
})();
