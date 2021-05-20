(function() {
'use strict';
angular
    .module('smallgisApp')
    .controller('paymentController', paymentController);

paymentController.$inject = ['$scope','geoOperation','$http','$rootScope','$location','Principal'];
function paymentController($scope,geoOperation,$http,$rootScope,$location,Principal) {
   var vm = this;
   var hash;
   var url = geoOperation.getUrl();
   $http({
    method: 'POST',
    url: url
  }).success(function(data, status, headers, config) {
      alert(data);
  }).error(function(data, status, headers, config) {
      alert("Ha fallado la petición. Estado HTTP:"+status);
  });
   //alert(val);
   //$http.post('/someUrl', data, config).then(successCallback, errorCallback);
}
})();
