(function() {
'use strict';
angular
    .module('smallgisApp')
    .controller('centertoolController', centertoolController);

centertoolController.$inject = ['$scope', '$element','close','geoOperation','leafletData','$rootScope'];

function centertoolController($scope, $element,close,geoOperation,leafletData,$rootScope){
  //  This close function doesn't need to use jQuery or bootstrap, because
  //  the button has the 'data-dismiss' attribute.
 var type='';
 var linea_img = 'content/images/line.svg';
 var poligono_img = 'content/images/poligono.svg';
 var punto_img = 'content/images/punto.svg';
 var fcollection_img = 'content/images/fcollection.svg';
 getConfigCenter();
 var arrLayers=[];

 $scope.mapAux;
 $scope.clcontrol;
 function getConfigCenter(){
    leafletData.getMap("mapabase").then(function(map) {
      for(var i=0;i<$rootScope.capas.length;i++){
        if($rootScope.capas[i].enabled){
         var layerId=parseInt($rootScope.capas[i].id);
         var layerName=$rootScope.capas[i].nombre;
         arrLayers.push({id:layerId,name:layerName});
        }
      }
      $scope.layersMap =arrLayers;
      $scope.mapAux=map;
     });
  }
  $scope.close = function(result) {
   close(result, 500); // close, but give 500ms for bootstrap to animate
  };
  $scope.process = function() {
    try{
      var layerID=$scope.ddlvalue;
      var info = $rootScope.capas;
      var layerName=geoOperation.getFCNamebyID(layerID,info);

      if(typeof layerName !== "undefined"){
          //Invoke executeCenter tool function
          var fcgj = executeCenter(layerID);
          leafletData.getMap("mapabase").then(function(map) {
            var nombreCapa='';
            if(layerName.length>=10){
              nombreCapa='Center ' + layerName.substring(0, 10);//Assign new name for the layer
            }else{
              nombreCapa='Center ' + layerName.substring(0, layerName.length);//Assign new name for the layer
            }
            $rootScope.clcontrol.addOverlay(fcgj.addTo(map), nombreCapa);
            map.invalidateSize();
            map.fitBounds(fcgj.getBounds());

            var lastId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
            if(type=='Point'){
              $rootScope.capas.push({id:lastId,nombre:nombreCapa,tipo:punto_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
            }else if(type=='LineString'){
              $rootScope.capas.push({id:lastId,nombre:nombreCapa,tipo:linea_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
            }else if(type=='Polygon'){
              $rootScope.capas.push({id:lastId,nombre:nombreCapa,tipo:poligono_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
            }else{
              $rootScope.capas.push({id:lastId,nombre:nombreCapa,tipo:fcollection_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
            }
            if(type=='Point'){
              for(var i=0;i<$rootScope.capas.length;i++){
                if(parseInt($rootScope.capas[i].id)==parseInt(lastId)){
                   $rootScope.capas[i].espunto=1;
                }
              }
            }
          });
      }
      $element.modal('hide');
    }catch(err){
     alert(err);
    }
  };

  function executeCenter(layerID) {
    var features = [];
    var centers = [];
    var fc1 = geoOperation.getFCGeombyID(layerID,$scope.mapAux);
    for (var feat in fc1) {
        features.push(fc1[feat].feature);
    }
    var fc = turf.featureCollection(features);
    for (var i = 0; i < fc.features.length; i++) {
        var center = turf.center(fc.features[i]);
        centers.push(center);
    }
    var geojson=L.geoJson(centers,{
      onEachFeature: function(feature, layer){
          geoOperation.bindPopup(layer);
      },
      pointToLayer: geoOperation.pointToLayer
    });
    return geojson;
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
