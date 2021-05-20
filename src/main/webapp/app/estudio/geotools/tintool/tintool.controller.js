(function() {
  'use strict';
  angular
  .module('smallgisApp')
  .controller('tintoolController', tintoolController);

  tintoolController.$inject = ['$scope', '$element','close','geoOperation','leafletData','$rootScope'];

  function tintoolController($scope, $element,close,geoOperation,leafletData,$rootScope){


    getConfigBuffer();
    var arrLayers=[];
    $scope.mapAux;
    var type='';
    var linea_img = 'content/images/line.svg';
    var poligono_img = 'content/images/poligono.svg';
    var punto_img = 'content/images/punto.svg';
    var fcollection_img = 'content/images/fcollection.svg';
    function getConfigBuffer(){
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
                if(tipo=='Point'){
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
        var layerID=$scope.ddlvalue;
        var propertyName=$scope.propertyName;
        var info = $rootScope.capas;

        var layerName=geoOperation.getFCNamebyID(layerID,info);

        if(typeof layerName !== "undefined"){
          //Invoke executeTin tool function
          var fcgj = executeTin(layerID,propertyName);
          if(fcgj!=""){
            leafletData.getMap("mapabase").then(function(map) {
              var nombreCapa='';
              if(layerName.length>=10){
                nombreCapa='Tin ' + layerName.substring(0, 10);//Assign new name for the layer
              }else{
                nombreCapa='Tin ' + layerName.substring(0, layerName.length);//Assign new name for the layer
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
        }
        $element.modal('hide');
      }catch(err){
        alert(err);
      }

    };
    function executeTin(layerID,propertyName) {

      var features = [];
      var tinArr = [];
      var geojson="";

      var fc1 = geoOperation.getFCGeombyID(layerID,$scope.mapAux);
      for (var feat in fc1) {
        features.push(fc1[feat].feature);
      }

      var fc = turf.featureCollection(features);
      var tin = turf.tin(fc, propertyName);
      if(tin.features.length!=0){
        tin.features.forEach(function (feature) {
          feature.properties["fill"] = "#25561F";
          feature.properties["stroke"] = "#25561F";
          feature.properties["stroke-width"] = 5;
        });

        geojson=L.geoJson(tin,{
          onEachFeature: geoOperation.onEachFeature,
          pointToLayer: geoOperation.pointToLayer
        });
      }
      return geojson;
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
