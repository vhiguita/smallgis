(function() {
  'use strict';

  angular
    .module('smallgisApp')
    .config(stateConfig);

  stateConfig.$inject = ['$stateProvider'];

  function stateConfig($stateProvider) {
    $stateProvider.state('payment', {
      parent: 'app',
      url: '/payment',
      data: {
        authorities: []
      },
      views: {
        'content@': {
          templateUrl: 'app/payment/payment.html',
          controller: 'paymentController',
          controllerAs: 'vm'
        }
      },
      resolve: {

      }
    });
  }
})();
