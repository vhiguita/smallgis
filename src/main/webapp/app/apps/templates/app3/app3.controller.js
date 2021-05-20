(function() {
  'use strict';
  angular
  .module('smallgisApp')
  .controller('app3Controller', app3Controller);
  app3Controller.$inject = ['$scope','geoOperation','leafletData','$http','$rootScope','Auth','$stateParams','Principal'];
  function app3Controller($scope,geoOperation,leafletData,$http,$rootScope,Auth,$stateParams,Principal) {
    
    var host="https://smallgis.herokuapp.com";
    //var host="http://localhost:9000";
    var mapAPI="http://api.tiles.mapbox.com/v3/marker/";
    var arrLayers=[];//All the layers of each map stored in the database
    var capas=[];
    //var viewer = new Cesium.Viewer('cesiumContainer');
    var viewer = new Cesium.Viewer('cesiumContainer');
    viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
      url : '//assets.agi.com/stk-terrain/world',
      requestWaterMask : true,
      requestVertexNormals : true
    });
    init();
    function init(){

      var appId= $stateParams.appId;
      var mapId= $stateParams.mapId;
      var paramLen=Object.keys($stateParams).length;
      //console.log(appId+" "+mapId+" "+paramLen);
      if(paramLen==2){
        if(appId!=null){
          var isPrivateApp=geoOperation.appIsPrivate(appId);// Indicates 0(not found app), 1 (app is private), 2 (app is public)
          if(isPrivateApp==2){
            if(mapId!=null){
              var f=geoOperation.mapIsSaved(mapId);
              if(f){
                loadApp(mapId);
              }else{
                alert("El id del mapa no es valido o no existe.");
              }
            }else{
              alert("El id del mapa no es valido o no existe.");
            }
          }else if(isPrivateApp==1&&Principal.isAuthenticated()){
            if(mapId!=null){
              var f=geoOperation.mapIsSaved(mapId);
              if(f){
                loadApp(mapId);
              }else{
                alert("El id del mapa no es valido o no existe.");
              }
            }else{
              alert("El id del mapa no es valido o no existe.");
            }
          }else{
            alert('No se puede visualizar la aplicación porque requiere de inicio de sesión.');
          }
        }else{

          //window.location=host+'/site/index.html';
          window.location='http://smallgis.co';
        }
      }else{
        //window.location=host+'/site/index.html';
        window.location='http://smallgis.co';
      }
    }
    //Load the map from the app
    function loadApp(mapId){
      $.ajax({
        async: false,
        type: "GET",
        url: host+"/api/mapas/"+mapId,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
          var capasdb=data.capas;
          arrLayers=capasdb.split(',');
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
      capas=[];
      var cont=0;//Number of layers removed from the database
      for(var i=0;i<arrLayers.length;i++){
        var layerId=arrLayers[i];//Read layerId from the map collection (mongo database)
        $.ajax({
          async: false,
          type: "GET",
          url: host+"/api/capas/"+layerId,//GET the layer with the layerID from mongo database in a synchronously way
          contentType: "application/json; charset=utf-8",
          success: function (res) {
            if(res!=null){
              //loadLayer(layerId);//Load the layerId to the leaflet map
              capas.push({layerId:arrLayers[i],name:res.nombre,features:res.features});
            }

          },error: function(xhr) {
            cont=cont+1;
          }
        });
      }
      for(var k=0;k<capas.length;k++){
        var capaId=capas[k].layerId;
        var nombre=capas[k].name;
        var features=capas[k].features;
        loadLayer(features,nombre);//Load the layerId to the leaflet map
      }
      if(arrLayers.length==cont){
        alert("Todas las capas del mapa fueron borradas de la base de datos.");
      }
    }
    //Load layer from the mongo database
    function loadLayer(features,nombre){
      try{

        var contents=features;
        var fc = JSON.parse(JSON.stringify(eval("(" + contents + ")")));
        var color=geoOperation.get_random_color();
        angular.forEach(fc.features, function(value, key){
          if (fc.features[key].properties==null){
            fc.features[key].properties={};
          }
          angular.forEach(fc.features[key].properties, function(value1, key1){
            var num=geoOperation.parseNumber(value1);
            if(num!=null){
              fc.features[key].properties[key1]=num;
            }
          });
        });
        //console.log(fc);
        fc.name=nombre;
        var promise= Cesium.GeoJsonDataSource.load(fc);//Load geojson in the world map
        var scene = viewer.scene;

        promise.then(function(dataSource) {
          viewer.dataSources.add(dataSource);
          viewer.zoomTo(dataSource);

          //Get the array of entities
          var entities = dataSource.entities.values;

          for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            /*if(entity.polygon!=null){
            entity.polygon.extrudedHeight = 100;
          }*/

          /*var _geometry;
          if(entity.polygon!==undefined){
            _geometry = new Cesium.PolygonGeometry({
              polygonHierarchy : entity.polygon.hierarchy._value
            });
          }
          if(!_geometry)continue;
          var _geometryInstance = new Cesium.GeometryInstance({
            geometry : _geometry,
            id : "work_"+i,
            attributes : {
              color : new Cesium.ColorGeometryInstanceAttribute(0.0, 1.0, 1.0, 0.5)
            }
          });
          scene.primitives.add(new Cesium.GroundPrimitive({
            geometryInstance : _geometryInstance
          }));
          _geometry=null;*/
          //viewer.flyTo(entity);
        }

      }).otherwise(function(error){
        //Display any errrors encountered while loading.
        window.alert(error);
      });

    }catch(err){
      //console.log(err);
    }
  }
}
})();
