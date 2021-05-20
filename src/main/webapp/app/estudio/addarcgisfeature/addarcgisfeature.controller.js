(function() {
'use strict';
angular
    .module('smallgisApp')
    .controller('addarcgisfeatureController', addarcgisfeatureController);

addarcgisfeatureController.$inject = ['$scope', 'leafletData','$element','close','$http','$rootScope','geoOperation'];

function addarcgisfeatureController($scope, leafletData, $element,close,$http, $rootScope,geoOperation) {

  //  This close function doesn't need to use jQuery or bootstrap, because
  //  the button has the 'data-dismiss' attribute.
  var zCont=1;
  var linea_img = 'content/images/line.svg';
  var poligono_img = 'content/images/poligono.svg';
  var punto_img = 'content/images/punto.svg';
  var fcollection_img = 'content/images/fcollection.svg';
  $scope.requesttype="CORS";
  $scope.close = function(result) {
   close(result, 500); // close, but give 500ms for bootstrap to animate
  };

  $scope.cancel = function() {

    //  Manually hide the modal.
    $element.modal('hide');

    //  Now call close, returning control to the caller.
    close(result, 500); // close, but give 500ms for bootstrap to animate
  };
  $scope.executeService = function() {
    var serviceUrl=$scope.service_url;
    var whclause=$scope.whclause;
    var requesttype=$scope.requesttype;
    var limittomap=$scope.limitToMap;
    //console.log(serviceUrl+","+whclause+","+requesttype+","+limittomap);
    if(serviceUrl!=""){
     addDataServiceToMap(serviceUrl,whclause,requesttype,limittomap);
    }
  };
  function addDataServiceToMap(serviceUrl,whclause,requesttype,limittomap) {
    try{
     //var name=serviceUrl;
     var name = prompt("Cual es el nombre de la capa?", "");
     if(name==""){
        name="ArcGIS Feature-"+zCont;
        zCont=zCont+1;
     }
     leafletData.getMap("mapabase").then(function(map) {
      if($scope.requesttype=="JSONP"){
        var type='';
        var color=geoOperation.get_random_color();
        var Url = serviceUrl+'/query?';
        var bbox = "";
        if(limittomap&&limittomap!=null){
           bbox=map.getBounds().toBBoxString();
        }
        var urlParams = {
          f: 'json',
          inSR: 4326,
          outSR: 4326,
          geometry: bbox,
          where: whclause,
          outfields: '*'
        };
        map.spin(true);

        var urlParameters="where="+urlParams.where+"&outFields="+urlParams.outfields+"&f="+urlParams.f+"&outSR="+urlParams.outSR+"&inSR="+urlParams.inSR+"&geometryType=esriGeometryEnvelope&geometry="+urlParams.geometry;
        var urlJSONP=Url+urlParameters;

        //get the features
        $.get(urlJSONP,parseJSONP,"JSONP");
        //this is the call back from the jsonp ajax request
        function parseJSONP(data){
          if(data.features.length>0){
        //we call the function to turn it into geoJSON and write a callback to add it to the geojson object
            toGeoJSON(data,
                function(d){
                    var geojson = L.geoJson(d, {
                       style: function (feature) {
                         if(feature.properties['stroke']!=null&&feature.properties['stroke-width']!=null&&feature.properties['stroke-opacity']!=null&&feature.properties['fill']!=null&&feature.properties['fill-opacity']!=null){
                           return {color:feature.properties['stroke'],weight:feature.properties['stroke-width'],opacity:feature.properties['stroke-opacity'],fillOpacity:feature.properties['fill-opacity'],fillColor:feature.properties['fill']};
                         }else {
                           return {stroke: true, color: '#000000', weight:2, fillOpacity: 1.0, fillColor: color};
                         }
                         //return {stroke: true, color: '#000000',fillOpacity: 1.0, fillColor: color };
                       },
                       onEachFeature: function(feature, layer){
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
                    $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
                    map.invalidateSize();
                    map.fitBounds(geojson.getBounds());
                    var lastId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
                    var typeG=geoOperation.getTypeGeometry(d);

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
                    map.spin(false);
                }
            );
          }else{
            map.spin(false);
          }
        }

      }else{
        console.log("CORS");
        var type='';
        var color=geoOperation.get_random_color();
        var Url = serviceUrl+'/query?';
        var bbox = "";
        if(limittomap&&limittomap!=null){
           bbox=map.getBounds().toBBoxString();
        }
        var urlParams = {
          f: 'json',
          inSR: 4326,
          outSR: 4326,
          geometry: bbox,
          where: whclause,
          outfields: '*'
        };
        $.ajax({
            url: Url,
            type: "POST",
            crossDomain: true,
            data: urlParams,
            dataType: "json",
            success: function (response) {
              if(response.features.length>0){
                toGeoJSON(response,
                    function(d){
                      var geojson = L.geoJson(d, {
                         style: function (feature) {
                           if(feature.properties['stroke']!=null&&feature.properties['stroke-width']!=null&&feature.properties['stroke-opacity']!=null&&feature.properties['fill']!=null&&feature.properties['fill-opacity']!=null){
                             return {color:feature.properties['stroke'],weight:feature.properties['stroke-width'],opacity:feature.properties['stroke-opacity'],fillOpacity:feature.properties['fill-opacity'],fillColor:feature.properties['fill']};
                           }else {
                             return {stroke: true, color: '#000000', weight:2, fillOpacity: 1.0, fillColor: color};
                           }
                           //return {stroke: true, color: '#000000',fillOpacity: 1.0, fillColor: color };
                         },
                         onEachFeature: function(feature, layer){
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
                      $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
                      map.invalidateSize();
                      map.fitBounds(geojson.getBounds());
                      var lastId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
                      var typeG=geoOperation.getTypeGeometry(d);

                      if(typeG=='FeatureCollection'){
                           $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:'',correo:'john@example.com',empresa:" Empresa",espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer});
                      }else if(typeG=='Point'){
                           $rootScope.capas.push({id:lastId,nombre:name,tipo:punto_img,descripcion:'',correo:'john@example.com',empresa:" Empresa",espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer});
                      }else if(typeG=='LineString'){
                           $rootScope.capas.push({id:lastId,nombre:name,tipo:linea_img,descripcion:'',correo:'john@example.com',empresa:" Empresa",espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer});
                      }else if(typeG=='Polygon'){
                           $rootScope.capas.push({id:lastId,nombre:name,tipo:poligono_img,descripcion:'',correo:'john@example.com',empresa:" Empresa",espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer});
                      }else{
                           $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:'',correo:'john@example.com',empresa:" Empresa",espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer});
                      }
                      if(type=='Point'){
                        for(var i=0;i<$rootScope.capas.length;i++){
                          if(parseInt($rootScope.capas[i].id)==parseInt(lastId)){
                             $rootScope.capas[i].espunto=1;
                          }
                        }
                                          }
                      map.spin(false);
                    }
                 );
              }
            },
            error: function (xhr, status) {
                alert("error");
            }
        });
      }

     });
   }catch(err){

   }
  }
}
})();
