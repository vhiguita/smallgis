(function() {
  'use strict';
  angular
  .module('smallgisApp')
  .controller('distancetoolController', distancetoolController);

  distancetoolController.$inject = ['$scope', '$element','close','geoOperation','leafletData','$rootScope'];

  function distancetoolController($scope, $element,close,geoOperation,leafletData,$rootScope){

    getConfig();
    var arrLayers=[];
    $scope.mapAux;
    $scope.clcontrol;
    $scope.distance=0;
    function getConfig(){
      leafletData.getMap("mapabase").then(function(map) {
        for(var i=0;i<$rootScope.capas.length;i++){
          if($rootScope.capas[i].enabled){
            var layerId=parseInt($rootScope.capas[i].id);
            var layerName=$rootScope.capas[i].nombre;
            map.eachLayer(function (layer) {
              if (layer._leaflet_id === layerId) {
                var geoJson=layer.toGeoJSON();//Convert the layer to geojson
                var text=JSON.stringify(geoJson);//Convert the geojson to text
                var json=JSON.parse(text);
                //console.log(text);
                var tipo=geoOperation.getTypeGeometry(json);
                if(tipo=='Point'&&json.features.length==1){
                  arrLayers.push({id:layerId,name:layerName});
                }
              }
            });
          }
        }
        $scope.layersMap =arrLayers;
        $scope.mapAux=map;
      });
    }
    $scope.process = function() {
      try{
        var layerID1=$scope.ddlvalue1;
        var layerID2=$scope.ddlvalue2;
        var units = $scope.ddlunit;
        var info = $rootScope.capas;

        var distance=executeDistance(layerID1, layerID2, units);
        $scope.distance=distance;

      }catch(err){
        alert(err);
      }
    };
    //Calcular distancia
    function executeDistance(layerID1, layerID2, units) {
      var point1,point2;
      var fc1 = geoOperation.getFCGeombyID(layerID1,$scope.mapAux);
      for (var feat in fc1) {
        point1 = {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": fc1[feat].feature.geometry.coordinates
          }
        };
      }

      var fc2 = geoOperation.getFCGeombyID(layerID2,$scope.mapAux);
      for (var feat in fc2) {
        //features.push(fc2[feat].feature);
        point2 = {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": fc2[feat].feature.geometry.coordinates
          }
        };
      }
      var distance = turf.distance(point1, point2, units);
      distance=Math.round(distance * 100) / 100;
      return distance;
    }
    $scope.close = function(result) {
      close(result, 500); // close, but give 500ms for bootstrap to animate
    };

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
