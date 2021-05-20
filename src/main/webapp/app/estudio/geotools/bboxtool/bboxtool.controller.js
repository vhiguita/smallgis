(function() {
'use strict';
angular
    .module('smallgisApp')
    .controller('bboxtoolController', bboxtoolController);

bboxtoolController.$inject = ['$scope', '$element','close','geoOperation','leafletData','$rootScope'];

function bboxtoolController($scope, $element, close, geoOperation,leafletData,$rootScope){

  getConfigBuffer();
  var arrLayers=[];
  $scope.mapAux;
  $scope.clcontrol;
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
           var nombreCapa='';
           if(layerName.length>=10){
             nombreCapa='Bbox ' + layerName.substring(0, 10);//Assign new name for the layer
           }else{
             nombreCapa='Bbox ' + layerName.substring(0, layerName.length);//Assign new name for the layer
           }
           var fcgj = executeBbox(layerID);
           if(fcgj!=""){
            leafletData.getMap().then(function(map) {
                  $rootScope.clcontrol.addOverlay(fcgj.addTo(map),nombreCapa);
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

   function executeBbox(layerID) {
    var features = [];
    var geojson="";

    var fc1 = geoOperation.getFCGeombyID(layerID,$scope.mapAux);
    for (var feat in fc1) {
        features.push(fc1[feat].feature);
    }
    var fc = turf.featureCollection(features);
    var envelope = turf.envelope(fc);
      /*geojson=L.geoJson(envelope,{
              onEachFeature: geoOperation.onEachFeature,
              pointToLayer: geoOperation.pointToLayer
      });*/
      var color=geoOperation.get_random_color();
      geojson=L.geoJson(envelope, {
        style: function (feature) {
          if(feature.properties['stroke']!=null&&feature.properties['stroke-width']!=null&&feature.properties['stroke-opacity']!=null&&feature.properties['fill']!=null&&feature.properties['fill-opacity']!=null){
            return {color:feature.properties['stroke'],weight:feature.properties['stroke-width'],opacity:feature.properties['stroke-opacity'],fillOpacity:feature.properties['fill-opacity'],fillColor:feature.properties['fill']};
          }else if(feature.properties['stroke']!=null&&feature.properties['stroke-width']!=null&&feature.properties['stroke-opacity']!=null){
            if(feature.properties['line-stroke']!=null){
              if(feature.properties['line-stroke']=='stroke1'){
                return {stroke: true, color:feature.properties['stroke'], weight:feature.properties['stroke-width'], opacity:feature.properties['stroke-opacity'],dashArray:'1'};
              }else if(feature.properties['line-stroke']=='stroke2'){
                return {stroke: true, color:feature.properties['stroke'], weight:feature.properties['stroke-width'], opacity:feature.properties['stroke-opacity'],dashArray:'10,10'};
              }else if(feature.properties['line-stroke']=='stroke3'){
                return {stroke: true, color:feature.properties['stroke'], weight:feature.properties['stroke-width'], opacity:feature.properties['stroke-opacity'],dashArray:'15, 10, 1, 10'};
              }

            }else{
              return {stroke: true, color:feature.properties['stroke'], weight:feature.properties['stroke-width'], opacity:feature.properties['stroke-opacity']};
            }
          }else {
            return {stroke: true, color: '#000000', weight:2, fillOpacity: 1.0, fillColor: color};
          }
        },
        onEachFeature: function(feature, layer){
          try{
            if(feature.properties['marker-color']!=null&&feature.properties['marker-symbol']!=null){

              var markerSymbol=feature.properties['marker-symbol'];
              var markerColor=feature.properties['marker-color'];
              var markerSize=feature.properties['marker-size'];
              var mSize="s";

              if(markerSize=="small"){
                mSize="s";
              }else if(markerSize=="medium"){
                mSize="m";
              }else if(markerSize=="large"){
                mSize="l";
              }else{
                mSize="s";
                markerSize="small";
              }
              var iconSize;
              switch (markerSize) {
                case "small":
                iconSize = [20, 50];
                break;
                case "medium":
                iconSize = [30, 70];
                break;
                case "large":
                iconSize = [35, 90];
                break;
              }
              markerColor=markerColor.replace("#","");
              //Set marker icon
              if(markerSymbol!=""){
                if(markerSymbol!=" "){
                  var iconURL=$rootScope.mapAPI+'pin-'+mSize+'-'+markerSymbol+'+'+markerColor+'.png';
                  layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                    iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                    popupAnchor: [0, -iconSize[1] / 2]}));
                  }
                }
              }
            }catch(err){

            }
            geoOperation.bindPopup(layer);
            if (layer instanceof L.Marker) {
              type = 'Point';
            } else if (layer instanceof L.Polygon) {
              type = 'Polygon';
            } else if (layer instanceof L.Polyline) {
              type = 'LineString';
            }
          }
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