(function() {
'use strict';
angular
    .module('smallgisApp')
    .controller('renamelayerController', renamelayerController);

renamelayerController.$inject = ['$scope', 'leafletData','$element','close','$http','$rootScope','geoOperation'];

function renamelayerController($scope, leafletData, $element, close, $http, $rootScope,geoOperation) {
  //  This close function doesn't need to use jQuery or bootstrap, because
  //  the button has the 'data-dismiss' attribute.

 var arrLayers=[];
 var arrLayers2=[];
 $scope.mapAux;
 $scope.clcontrol;


  $scope.close = function(result) {
   close(result, 500); // close, but give 500ms for bootstrap to animate
  };
  $scope.execute = function() {
    try{
      var newname=$scope.newname;
      var layerIdRn=$scope.layerIdRn;
      //alert(newname+" "+oldname+" "+layerIdRn);

      leafletData.getMap("mapabase").then(function(map) {
        leafletData.getMap("mapabase").then(function(featureGroup) {
         featureGroup.eachLayer(function (layer) {
            if(layer._leaflet_id ===layerIdRn){
                layer.name=newname;
                var name=layer.name;
                rename(layer._leaflet_id,newname);
            }
         });
       });
      });
    }catch(err){

    }
    $element.modal('hide');
  };
  function rename(key,newname){
    for(var i=0;i<$rootScope.capas.length;i++){
      var layerId=parseInt($rootScope.capas[i].id);
      if(layerId==key){
         $rootScope.capas[i].nombre=newname;
      }
    }
  }
  //  This cancel function must use the bootstrap, 'modal' function because
  //  the doesn't have the 'data-dismiss' attribute.
  $scope.cancel = function() {

    //  Manually hide the modal.
    $element.modal('hide');

    //  Now call close, returning control to the caller.
    close(result, 500); // close, but give 500ms for bootstrap to animate
  };

}
})();
