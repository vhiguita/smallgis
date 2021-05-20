(function() {
'use strict';
angular
    .module('smallgisApp')
    .controller('filtertoolController', filtertoolController);

filtertoolController.$inject = ['$scope', '$element','close','geoOperation','leafletData','$rootScope'];

function filtertoolController($scope, $element,close,geoOperation,leafletData,$rootScope){


  getConfig();
  var arrLayers=[];
  $scope.mapAux;
  $scope.clcontrol;
  function getConfig(){
        $scope.filter_img="../../assets/iconosTurf/turf-filter.png";
   }
   leafletData.getMap().then(function(map) {
               leafletData.getLayers().then(function(baselayers) {
                  /*var lcontrol=L.control.layers(baselayers.baselayers, baselayers.overlays);
                  angular.forEach(lcontrol._layers, function(value, key){
                           arrLayers.push(lcontrol._layers[key]);
                  });*/
                  angular.forEach($rootScope.layersMapa2, function(value, key){
                           arrLayers.push($rootScope.layersMapa2[key]);
                  });
                  $scope.layersMap =arrLayers
                  $scope.mapAux=map;
               });
   });

   $scope.process = function() {
    try{
       var layerID=$scope.ddlvalue;
       var propertyName=$scope.propertyName;
       var propertyVal=$scope.propertyValue;

       var info = $scope.layersMap;

       var layerName=geoOperation.getFCNamebyID(layerID,info);
       //alert(layerName+" "+propertyName+" "+propertyVal);
       if(typeof layerName !== "undefined"){
           //Invoke executeFilter tool function
          var fcgj = executeFilter(layerID,propertyName,propertyVal);

          if(fcgj!=""){
            leafletData.getMap().then(function(map) {
                     $scope.clcontrol.addOverlay(fcgj.addTo(map), 'Filter ' + layerName.substring(0, 10));
                     $rootScope.layersMapa2=$scope.clcontrol._layers;
             });
          }

       }
       $element.modal('hide');
    }catch(err){
     console.log(err);
    }

   };
   function executeFilter(layerID,key,value) {

     var features = [];
     var fcgj="";
     var fc1 = geoOperation.getFCGeombyID(layerID,$scope.mapAux);
     for (var f in fc1) {
       angular.forEach(fc1[f].feature.properties,function(value, key){
          fc1[f].feature.properties[key]=String(value);
       });
     }
     for (var feat in fc1) {
     features.push(fc1[feat].feature);
     }
     var fc = turf.featurecollection(features);

     var filter = turf.filter(fc, key, value);

     //var isolineas = turf.isolines(fc, 'GRID_CODE', 5, breaks);
     if(filter.features.length!=0){
       fcgj = L.geoJson(filter, {
           onEachFeature: geoOperation.onEachFeature,
           pointToLayer: geoOperation.pointToLayer
           //style: style
       });
     }

     return fcgj;
   }

   /*function executeFilter(layerID,key,value) {

     var features = [];

     var fc1 = geoOperation.getFCGeombyID(layerID,$scope.mapAux);
     for (var feat in fc1) {
     features.push(fc1[feat].feature);
     }
     var fc = turf.featurecollection(features);

     var filter = turf.filter(fc, key, value);
     //var isolineas = turf.isolines(fc, 'GRID_CODE', 5, breaks);
     var fcgj = L.geoJson(filter, {
         onEachFeature: geoOperation.onEachFeature,
         pointToLayer: geoOperation.pointToLayer
         //style: style
     });
     return fcgj;
   }*/

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
