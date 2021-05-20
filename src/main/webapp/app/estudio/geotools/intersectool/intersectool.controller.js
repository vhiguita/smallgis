(function() {
'use strict';
angular
    .module('smallgisApp')
    .controller('intersectoolController', intersectoolController);

intersectoolController.$inject = ['$scope', '$element','close','geoOperation','leafletData','$rootScope'];

function intersectoolController($scope, $element,close,geoOperation,leafletData,$rootScope){
  //  This close function doesn't need to use jQuery or bootstrap, because
  //  the button has the 'data-dismiss' attribute.
 getConfigIntersect();
 var arrLayers=[];
 var type='';
 var linea_img = 'content/images/line.svg';
 var poligono_img = 'content/images/poligono.svg';
 var punto_img = 'content/images/punto.svg';
 var fcollection_img = 'content/images/fcollection.svg';
 $scope.mapAux;
 function getConfigIntersect(){
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
             if(tipo=='Polygon'){
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

  $scope.close = function(result) {
   close(result, 500); // close, but give 500ms for bootstrap to animate
  };
  $scope.process = function() {
    try{
      var layerID1=$scope.ddlvalue1;
      var layerID2=$scope.ddlvalue2;
      var info = $rootScope.capas;

      var layerName1=geoOperation.getFCNamebyID(layerID1,info);
      var layerName2=geoOperation.getFCNamebyID(layerID2,info);

      if((typeof layerName1 !== "undefined")&&(typeof layerName2 !== "undefined")){
          //Invoke executeIntersect tool function
          var fcgj = executeIntersect(layerID1,layerID2);
          leafletData.getMap().then(function(map) {
            var nombreCapa1='';
            var nombreCapa2='';
            if(layerName1.length>=10){
              nombreCapa1=layerName1.substring(0, 10);//Assign new name for the layer
            }else{
              nombreCapa1=layerName1.substring(0, layerName1.length);//Assign new name for the layer
            }
            if(layerName2.length>=10){
              nombreCapa2=layerName2.substring(0, 10);//Assign new name for the layer
            }else{
              nombreCapa2=layerName2.substring(0, layerName2.length);//Assign new name for the layer
            }
            var nombreCapa='Intersect ' + nombreCapa1 + ' ' + nombreCapa2;
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

  function executeIntersect(layerID1,layerID2) {
    var conflictlist = [];
    var fc1 = geoOperation.getFCGeombyID(layerID1,$scope.mapAux);
    var fc2 = geoOperation.getFCGeombyID(layerID2,$scope.mapAux);

    for (var f in fc1) {
        for (var g in fc2) {
            try {
                var feature = turf.intersect(fc1[f].feature, fc2[g].feature);
                if (typeof (feature) != "undefined") {
                    feature.properties = fc1[f].feature.properties || {};
                    conflictlist.push(feature);
                }
            } catch (err) {
                //dc.notify('error', err);
                //m.spin(false);
            }
        }
    }
    var color=geoOperation.get_random_color();
    var geojson=L.geoJson(conflictlist, {
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
