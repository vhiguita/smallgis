(function() {
'use strict';
angular
    .module('smallgisApp')
    .controller('appsController', appsController);

appsController.$inject = ['$scope', 'geoOperation','leafletData','$http','$rootScope','$location','Principal'];
function appsController($scope,geoOperation,leafletData,$http,$rootScope,$location,Principal) {

  var host="https://smallgis.herokuapp.com";
  //var host="http://localhost:9000";
  
  angular.extend($scope, {
     center: {
        lat: 6.2913889,
        lng: -75.5361111,
        zoom: 15
     }
  });
  init();
  function init(){
    var val = geoOperation.getUrlVars()["appId"];
    if (typeof(val) != "undefined"){
      $.ajax({
            async: false,
            type: "GET",
            url: host+"/api/aplicacions/"+val,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
              //console.log(data);

              if(data.espublico){
                var appType=data.tipoApp;
                var mapId=data.mapid;
                //console.log(appType+" "+mapId);
                loadApp(appType,val,mapId);
              }else if(data.espublico==false&&Principal.isAuthenticated()){
                var appType=data.tipoApp;
                var mapId=data.mapid;
                //console.log(appType+" "+mapId);
                loadApp(appType,val,mapId);
              }else{
                alert('No se puede visualizar la app porque requiere de inicio de sesión.');
              }

            },error: function(xhr) {
                alert("No se encontro ninguna aplicación.");
                console.clear();
            }
      });
    }else{
      alert("No se encontro ninguna aplicación.");
    }
  }
  //load app function
  function loadApp(apptype,appId,mapId){

    switch (apptype)
    {
        case 'basic':
          $location.search('appId', null);
          $location.path('/app1/'+appId+'/'+mapId);
          break;
        case 'advanced':
          $location.search('appId', null);
          $location.path('/app2/'+appId+'/'+mapId);
          break;
        case 'globemap':
          $location.search('appId', null);
          $location.path('/app3/'+appId+'/'+mapId);
          break;
    }
  }

}
})();
