(function() {
'use strict';
angular
    .module('smallgisApp')
    .controller('drawpositionController', drawpositionController);

drawpositionController.$inject = ['$scope', 'leafletData','$element','close','$http','$rootScope','geoOperation'];

function drawpositionController($scope, leafletData, $element, close, $http, $rootScope,geoOperation) {

   //  This close function doesn't need to use jQuery or bootstrap, because
   //  the button has the 'data-dismiss' attribute.
   var punto_img = 'content/images/punto.svg';
   $scope.cancel = function() {

      //  Manually hide the modal.
      $element.modal('hide');

      //  Now call close, returning control to the caller.
      close(result, 500); // close, but give 500ms for bootstrap to animate
    };
    $scope.drawCoordinate = function() {
        var x=Number($scope.x);
        var y=Number($scope.y);
        if(isNaN(x)!=true&&isNaN(y)!=true){
          leafletData.getMap("mapabase").then(function(map) {
            //var featGr = new L.FeatureGroup([L.marker([x, y])]);
            var geojsonFeature = {
                "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Point",
                        "coordinates": [x, y]
                }
            }
            var geojson=L.geoJson(geojsonFeature, {
                  style: function (feature) {
                      return {stroke: true, color: '#000000', weight:4, opacity: 0.5, fill: false};
                  },
                  onEachFeature: function(feature, layer){
                      geoOperation.bindPopup(layer);
                  }
            });
            var name="Coord "+$rootScope.position;
            $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
            var lastId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];

            $rootScope.capas.push({id:lastId,nombre:name,tipo:punto_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:1,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
            $rootScope.position=$rootScope.position+1
            /*$rootScope.layersMapa2= $rootScope.clcontrol._layers;
            var lastId = Object.keys($rootScope.layersMapa2)[Object.keys($rootScope.layersMapa2).length - 1];
            $rootScope.arrayEditLayer[lastId]=0;
            $rootScope.selectedLayer[lastId]=1;
            $rootScope.arrayType[lastId]='Feature<Point>';
            $rootScope.position=$rootScope.position+1;*/
            map.invalidateSize();
            map.fitBounds(geojson.getBounds());

            $element.modal('hide');
          });
        }else{
          alert("Las coordenadas ingresadas no son validas.")
        }

    };
 }
})();
