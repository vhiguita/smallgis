(function() {
'use strict';
angular
    .module('smallgisApp')
    .controller('advancedqueryController', advancedqueryController);

advancedqueryController.$inject = ['$scope', 'leafletData','$element','close','$http','$rootScope','geoOperation'];

function advancedqueryController($scope, leafletData, $element, close, $http, $rootScope,geoOperation) {

  var arrLayers=[];
  var layerID;
  $scope.mapAux;
  $scope.clcontrol;
  $scope.txt='';
  $scope.attrNames=[];
  $scope.attrValues=[];
  const winnow = {};

  var filter;
  var type;
  var linea_img = 'content/images/line.svg';
  var poligono_img = 'content/images/poligono.svg';
  var punto_img = 'content/images/punto.svg';
  var fcollection_img = 'content/images/fcollection.svg';

   leafletData.getMap("mapabase").then(function(map) {
      for(var i=0;i<$rootScope.capas.length;i++){
         //var layer=$rootScope.capas[i].capa;
         var layerId=parseInt($rootScope.capas[i].id);
         var layerName=$rootScope.capas[i].nombre;
         arrLayers.push({id:layerId,name:layerName});
      }
      /*angular.forEach($rootScope.layersMapa2, function(value, key){
               arrLayers.push($rootScope.layersMapa2[key]);
      });*/

      $scope.layersMap =arrLayers
      $scope.mapAux=map;

   });

   $scope.execute = function() {
    try{
       var features = [];
        var counter = 0;
        var sql= $scope.txt;

        layerID=$scope.ddlvalue;
        layerID=parseInt(layerID);
        var info = $scope.layersMap;
        var layerName=geoOperation.getFCNamebyID2(layerID,info);

        leafletData.getMap("mapabase").then(function(map) {
          map.eachLayer(function (layer) {
            if (layer._leaflet_id === layerID) {
                var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                angular.forEach(layer._layers, function(value, key){
                  try{
                    features.push(layer._layers[key].feature);
                  }catch(err){

                  }
                });
                var featuresAux=[];
                for(var i=0;i<features.length;i++){
                  var aData=[];
                  var feat=features[i]['properties'];
                  aData.push(feat);
                  var sq="SELECT * FROM ? WHERE "+sql;
                  //var res = alasql("SELECT * FROM ? WHERE DPTO_Codig = 15 OR MPIO_Codig='15676'",[d]);
                  var res = alasql(sq,[aData]);
                  var len=res.length;
                  //console.log(len);
                  if(len==1){
                    featuresAux.push(features[i]);
                  }
                }
                if(featuresAux.length!=0){
                  var type;
                  var fc = turf.featureCollection(featuresAux);
                  var color=geoOperation.get_random_color();
                  console.log(fc);

                  var fcg = L.geoJson(fc, {
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
                          //return {stroke: true, color: '#000000', weight:2, fillOpacity: 1.0, fillColor: color};
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
                       else if (layer instanceof L.Circle) {
                           type = 'Circle';
                       }

                     }
                  });
                  var name='Consulta ' + layerName;
                  $rootScope.clcontrol.addOverlay(fcg.addTo(map), name);
                  var lastId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
                  var typeG=geoOperation.getTypeGeometry(json);

                  if(typeG=='FeatureCollection'){
                       $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
                  }else if(typeG=='Point'){
                       $rootScope.capas.push({id:lastId,nombre:name,tipo:punto_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
                  }else if(typeG=='LineString'){
                       $rootScope.capas.push({id:lastId,nombre:name,tipo:linea_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
                  }else if(typeG=='Polygon'){
                       $rootScope.capas.push({id:lastId,nombre:name,tipo:poligono_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
                  }else{
                       $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
                  }
                  if(type=='Point'){
                    for(var i=0;i<$rootScope.capas.length;i++){
                      if(parseInt($rootScope.capas[i].id)==parseInt(lastId)){
                         $rootScope.capas[i].espunto=1;
                      }
                    }
                  }
                  map.invalidateSize();
                  map.fitBounds(fcg.getBounds());
                  $element.modal('hide');
                }else{
                  alert('No se encontraron resultados para la consulta.');
                }
            }
          });
        });
    }catch(err){
     $element.modal('hide');
     console.log(err);
    }
   };
   $scope.clear = function() {
     $scope.txt='';
   }
   $scope.fBtn_1 = function() {
       $scope.txt=$scope.txt+" =";
   }
   $scope.fBtn_2 = function() {
       $scope.txt=$scope.txt+" !=";
   }
   $scope.fBtn_3 = function() {
       $scope.txt=$scope.txt+" >";
   }
   $scope.fBtn_4 = function() {
       $scope.txt=$scope.txt+" <";
   }
   $scope.fBtn_5 = function() {
       $scope.txt=$scope.txt+" >=";
   }
   $scope.fBtn_6 = function() {
       $scope.txt=$scope.txt+" <=";
   }
   $scope.fBtn_7 = function() {
       $scope.txt=$scope.txt+" Like ";
   }
   $scope.fBtn_8 = function() {
       $scope.txt=$scope.txt+"'";
   }
   $scope.fBtn_9 = function() {
       $scope.txt=$scope.txt+" And";
   }
   $scope.fBtn_10 = function() {
       $scope.txt=$scope.txt+" Or";
   }
   $scope.selectLayer = function(){
     try{
      $scope.txt='';
      var propsName;
      layerID=$scope.ddlvalue;
      $scope.attrNames=[];
      $scope.attrValues=[];

      if(layerID!=""){
        layerID=parseInt(layerID);
        leafletData.getMap("mapabase").then(function(map) {
          map.eachLayer(function (layer) {
            if (layer._leaflet_id === layerID) {

              angular.forEach(layer._layers, function(value, key){
                try{
                  var len=Object.keys(layer._layers[key].feature.properties).length;
                  if(len>0){
                    //Get layer feature properties
                    propsName=layer._layers[key].feature.properties;
                    return false;
                  }
                }catch(err){

                }
              });
              angular.forEach(propsName, function(value, key){
                //$scope.attrNames.push({name:key});
                //Validates that key of the json <> stroke, stroke-width, fill, fill-opacity, etiqueta
                if(key!="stroke"){
                  if(key!="stroke-width"){
                    if(key!="stroke-opacity"){
                      if(key!="fill"){
                        if(key!="fill-opacity"){
                          if(key!="marker-color"){
                            if(key!="marker-size"){
                             if(key!="marker-symbol"){
                               if(key!="line-stroke"){
                                if(key!="etiqueta"){
                                 $scope.attrNames.push({name:key});
                                }
                               }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              });
            }
          });
        });
      }
     }catch(err){

     }
   }
   $scope.selectAttribute = function(){
     try{
       var attributeName=$scope.attribute.name;
       $scope.txt=$scope.txt+" "+attributeName;
       layerID=$scope.ddlvalue;
       $scope.attrValues=[];
       if(layerID!=""){
         layerID=parseInt(layerID);
         leafletData.getMap("mapabase").then(function(map) {
           map.eachLayer(function (layer) {
             if (layer._leaflet_id === layerID) {
               angular.forEach(layer._layers, function(value, key){
                 try{
                   var attributeVal=layer._layers[key].feature.properties[attributeName];
                   var b = valueInArray($scope.attrValues,attributeVal);
                   if(b==false){
                     $scope.attrValues.push({attributevalue:attributeVal});
                     console.log(attributeVal);
                   }
                 }catch(err){

                 }
               });
             }
           });
         });
       }
     }catch(err){

     }
   }
   $scope.selectAttributeValue = function(){
     try{
       var attributeValue=$scope.attributevalue.attributevalue;
       $scope.txt=$scope.txt+attributeValue;
     }catch(err){

     }
   }
   function valueInArray(array,attVal){
     var b=false;
     for(var i = 0; i < array.length; i++) {
          if (array[i].attributevalue == attVal ) {
              b=true;
              break;
          }
     }
     return b;
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
