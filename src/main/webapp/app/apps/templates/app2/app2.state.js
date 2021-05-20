(function() {
  'use strict';

  angular
    .module('smallgisApp')
    .config(stateConfig);

  stateConfig.$inject = ['$stateProvider'];

  function stateConfig($stateProvider) {
    $stateProvider.state('app2', {
      parent: 'app',
      url: '/app2/:appId/:mapId',
      data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'apps'
      },
      views: {
        'content@': {
          templateUrl: 'app/apps/templates/app2/app2.html',
          controller: 'app2Controller',
          controllerAs: 'vm'
        }
      },
      resolve: {

      }
    });
  }
})();
