(function() {
'use strict';
angular
    .module('smallgisApp')
    .controller('temp0Controller', temp0Controller);

temp0Controller.$inject = ['$scope','geoOperation','leafletData','$http','$rootScope','Auth','$routeParams','Principal'];
function temp0Controller($scope,geoOperation,leafletData,$http,$rootScope,Auth,$routeParams,Principal) {

  var host="https://smallgis.herokuapp.com";
  //var host="http://localhost:9000";
  var mapAPI="http://api.tiles.mapbox.com/v3/marker/";
  angular.extend($scope, {
     center: {
        lat: 6.2913889,
        lng: -75.5361111,
        zoom: 15
     }
  });
  init();
  function init(){
    var mapId= $routeParams.mapId;
    if(mapId!=null){
       var f=geoOperation.mapIsSaved(mapId);
       if(f){
         $.ajax({
               async: false,
               type: "GET",
               url: host+"/api/maps/"+mapId,
               contentType: "application/json; charset=utf-8",
               dataType: "json",
               success: function (data) {
                 if(data.isPrivate==false){
                   loadMap(mapId);
                 }else if(data.isPrivate&&Auth.isLoggedIn()){
                   loadMap(mapId);
                 }else{
                   alert('No se puede  visualizar el mapa porque requiere de inicio de sesión.');
                 }
               },error: function(xhr) {
                   alert("No se encontro ningun mapa.");
                   console.clear();
               }
         });
       }else{
         alert("El id del mapa no es valido o no existe.");
       }
    }else{
      alert("El id del mapa no es valido o no existe.");
    }
  }
  //Load the map from the app
  function loadMap(mapId){
    var arrLayers=[];
    $.ajax({
          async: false,
          type: "GET",
          url: host+"/api/maps/"+mapId,
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (data) {
              arrLayers=data.layers;
              showMap(arrLayers);
          },error: function(xhr) {
              alert("No se encontro ningun mapa en la aplicación.");
              console.clear();
          }
    });
  }
  //Show map
  function showMap(arrLayers){
    var namesNotFound="";
    var cont=0;//Number of layers removed from the database
    for(var i=0;i<arrLayers.length;i++){
      var layerId=arrLayers[i].layer_Id;//Read layerId from the map collection (mongo database)
       $.ajax({
             async: false,
             type: "GET",
             url: host+"/api/layers/"+layerId,//GET the layer with the layerID from mongo database in a synchronously way
             contentType: "application/json; charset=utf-8",
             success: function (res) {
               if(res!=null){
                    loadLayer(layerId);//Load the layerId to the leaflet map
               }

             },error: function(xhr) {
                 cont=cont+1;
             }
         });
    }
    if(arrLayers.length==cont){
        alert("Todas las capas del mapa fueron borradas de la base de datos.");
    }
  }
  //Load layer from the mongo database
  function loadLayer(layerId){
     try{
      $.ajax({
            async: false,
            type: "GET",
            url: host+"/api/layers/"+layerId,//GET the layer with the layerID from mongo database in a synchronously way
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {

              var fc = turf.featurecollection(res.geojson);
              var color=geoOperation.get_random_color();
              angular.forEach(fc.features, function(value, key){
                if (fc.features[key].properties==null){
                    fc.features[key].properties={};
                }
              });
              leafletData.getMap("map").then(function(map) {
                  map.spin(true);
                  var geojson=L.geoJson(fc, {
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
                            var iconURL=mapAPI+'pin-'+mSize+'-'+markerSymbol+'+'+markerColor+'.png';
                            layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                                  iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                                  popupAnchor: [0, -iconSize[1] / 2]}));
                          }
                        }
                      }
                    }catch(err){

                    }
                    var content = '<table class="dropchop-table"><tr>';
                     if (layer.feature.properties) {
                       for (var prop in layer.feature.properties) {
                        if(prop=="fill"){
                           content += '<tr><td><strong>' + prop + '</strong></td><td><div style="width:100%;height:20px;background-color:' + layer.feature.properties[prop] + ';"></div></td></tr>';
                        }else if(prop=="stroke"){
                          content += '<tr><td><strong>' + prop + '</strong></td><td><div style="width:100%;height:20px;background-color:' + layer.feature.properties[prop] + ';"></div></td></tr>';
                        }else if(prop=="line-stroke"){
                            var sColor=layer.feature.properties["stroke"];
                           if(layer.feature.properties['line-stroke']=='stroke1'){
                               content += '<tr><td><strong>' + prop + '</strong></td><td><div style="width:100%;height:20px;margin-top: -15px;border-bottom:2px solid '+sColor+';"></div></td></tr>';
                           }else if(layer.feature.properties['line-stroke']=='stroke2'){
                               content += '<tr><td><strong>' + prop + '</strong></td><td><div style="width:95%;height:20px;margin-top: -15px;border-bottom: 2px dashed '+sColor+';"></div></td></tr>';
                           }else if(layer.feature.properties['line-stroke']=='stroke3'){
                               content += '<tr><td><strong>' + prop + '</strong></td><td><div style="width:100%;height:20px;margin-top: -15px;border-bottom: 2px dotted '+sColor+';"></div></td></tr>';
                           }else{
                               content += '<tr><td><strong>' + prop + '</strong></td><td><div style="width:100%;height:20px;margin-top: -15px;border-bottom:2px solid '+sColor+';"></div></td></tr>';
                           }
                        }else if(prop=="marker-symbol"){
                          var mColor=layer.feature.properties["marker-color"];
                          mColor=mColor.replace('#','');
                          var mSrc=mapAPI+'pin-m-'+layer.feature.properties[prop]+'+'+mColor+'.png';
                          var img='<img src="'+mSrc+'" width="20" height="35" style="margin-top: 15px;">';
                          content += '<tr><td><strong>' + prop + '</strong></td><td style="text-align:center;">' + img + '</td></tr>';
                        }else{
                          if(prop!="marker-color"){
                            content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
                          }

                        }

                       }
                     }else {
                       //content += '<p></p>';
                     }
                     content += '</table>';
                     layer.bindPopup(L.popup({
                       maxWidth: 450,
                       maxHeight: 200,
                       autoPanPadding: [45, 45],
                       className: 'dropchop-popup'
                     }, layer).setContent(content));
                  }

                }).addTo(map);
                map.fitBounds(geojson.getBounds());
                map.spin(false);
            });
          },error: function(xhr) {
            console.log(xhr);
            //console.clear();
          }
      });
    }catch(err){
      //console.log(err);
    }
  }


}
})();
