(function() {
'use strict';
angular
    .module('smallgisApp')
    .controller('assigndeviceController', assigndeviceController);

assigndeviceController.$inject = ['$scope', '$element','close','geoOperation','Requirement','leafletData','$timeout','$rootScope'];

function assigndeviceController($scope, $element,close,geoOperation,Requirement,leafletData,$timeout,$rootScope){

 //  This close function doesn't need to use jQuery or bootstrap, because
 //  the button has the 'data-dismiss' attribute.
 var interval;
 $scope.arrLayers=[];
 $scope.mapAux;
 $scope.clcontrol;
 $scope.value = 1;
 $rootScope.arrAssignedRequirements=[];//Array of assigned requirements
 getConfig();  
 function getConfig(){
    leafletData.getMap("mapabase").then(function(map) {
      //console.log($rootScope.capasreq);
      for(var i=0;i<$rootScope.capasreq.length;i++){
        if($rootScope.capasreq[i].enabled){
          var layerId=parseInt($rootScope.capasreq[i].id);
          var layerName=$rootScope.capasreq[i].nombre;
          map.eachLayer(function (layer) {
            if (layer._leaflet_id === layerId) {    
                 $scope.arrLayers.push({id:layerId,name:layerName});
            }
          });
        }
      }
      $scope.mapAux=map;
     });
  }
  $scope.close = function(result) {
   close(result, 500); // close, but give 500ms for bootstrap to animate
  };
  //Execute assignment requirement
  $scope.process = function(result) {
   var distance = $('#distance').val();//Distance or radio to the last tracking position in the map
   var layerID=parseInt($scope.ddlvalue1);
   if(isNaN(layerID)==false){
    var reqid="";
    for(var i=0;i<$rootScope.capasreq.length;i++){
        var id=parseInt($rootScope.capasreq[i].id);
        if(id==layerID){
          reqid=$rootScope.capasreq[i].nombre;
        }
    }  
    $element.modal('hide');
    close(result, 500); // close, but give 500ms for bootstrap to animate
    $rootScope.$broadcast('assignreq',[reqid,distance,layerID]);
   }else{
     alert('Debe de seleccionar por lo menos una capa.');
   }
  };
  function onReqUpdateSuccess(result) {
    $scope.$emit('smallgisApp:requirementUpdate', result);
  }
  function onReqSaveError() {

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
