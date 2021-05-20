(function() {
'use strict';
angular
    .module('smallgisApp')
    .controller('addexternallinkController', addexternallinkController);

addexternallinkController.$inject = ['$scope', 'leafletData','$element','close','$http','$rootScope','geoOperation'];

function addexternallinkController($scope, leafletData, $element, close, $http, $rootScope,geoOperation) {

  //  This close function doesn't need to use jQuery or bootstrap, because
  //the button has the 'data-dismiss' attribute.
  var linea_img = 'content/images/line.svg';
  var poligono_img = 'content/images/poligono.svg';
  var punto_img = 'content/images/punto.svg';
  var fcollection_img = 'content/images/fcollection.svg';

  $scope.cancel = function() {

    //  Manually hide the modal.
    $element.modal('hide');

    //  Now call close, returning control to the caller.
    close(result, 500); // close, but give 500ms for bootstrap to animate
  };
  $scope.loadFile = function() {
    var urlFile=$scope.url;
    console.log("valor:"+angular.isUndefined(urlFile));
    if(angular.isUndefined(urlFile)==false){
      var filename = urlFile.substring(urlFile.lastIndexOf('/')+1);
      var name=filename.substr(0, filename.lastIndexOf('.'));
      console.log(name);
      try{
       $.getJSON(urlFile, function(data) {
          addDataToMap(data,name);
          //angular.element('#url').css('border','2px solid transparent');
          document.getElementById("url-obj").className = '';
          $element.modal('hide');
           //return;
       });
      }catch(err){

      }
    }else{
      //angular.element('#url').css('border','2px solid red');
      document.getElementById("url-obj").className = 'error';
      //return false;
    }
  };
  function addDataToMap(data,name) {
    try{
     leafletData.getMap("mapabase").then(function(map) {
        var type='';
        var radio='';
        var color=geoOperation.get_random_color();
        map.spin(true);
        var geojson = L.geoJson(data, {
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
        var typeG=geoOperation.getTypeGeometry(data);

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

     });
   }catch(err){

   }
  }
}
})();
