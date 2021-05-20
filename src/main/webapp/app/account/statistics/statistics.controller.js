(function() {
  'use strict';

  angular
  .module('smallgisApp')
  .controller('StatisticsController', StatisticsController);

  StatisticsController.$inject = ['$scope','Auth', 'Principal','LCapa','MMapa','Userapp'];

  function StatisticsController($scope, Auth, Principal,LCapa,MMapa,Userapp) {
    var vm = this;
    vm.doNotMatch = null;
    vm.error = null;
    vm.success = null;
    vm.statisticsAccount = {};
    vm.statisticsAccount.user="";
    vm.statisticsAccount.userplan="";
    vm.statisticsAccount.nlayers=0;
    vm.statisticsAccount.nmaps=0;
    vm.statisticsAccount.napps=0;

    //loadStatistics();
    $scope.$on('statistics', function(){
      Principal.identity().then(function(account) {
        vm.account = account;
        vm.statisticsAccount.user=account.login;
        vm.statisticsAccount.userplan=account.userPlan;
        LCapa.getCapasByUser({username: account.login}).then(function (result) {
          vm.statisticsAccount.nlayers=result.data;
          //console.log(result);
        }).catch(function () {

        });
        MMapa.getMapasByUser({username: account.login}).then(function (result) {
          vm.statisticsAccount.nmaps=result.data;
          //console.log(result);
        }).catch(function () {

        });
        Userapp.getAppsByUser({username: account.login}).then(function (result) {
          vm.statisticsAccount.napps=result.data;
          //console.log(result);
        }).catch(function () {

        });
        //console.log($analytics.userTimings());
      });
    });
  }
})();
