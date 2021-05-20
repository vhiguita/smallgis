(function() {
  'use strict';
  angular
  .module('smallgisApp')
  .controller('app2Controller', app2Controller);

  app2Controller.$inject = ['$scope','geoOperation','leafletData','$http','$rootScope','Auth','$stateParams','$compile','Principal'];
  function app2Controller($scope,geoOperation,leafletData,$http,$rootScope,Auth,$stateParams,$compile,Principal) {

    var host="https://smallgis.herokuapp.com";
    //var host="http://localhost:9000";
    var mapAPI="http://api.tiles.mapbox.com/v3/marker/";
    var legend = L.control({position: 'topright'});
    var isLengendAdded=false;
    var isFilterControlAdded=false;
    var isGridControlAdded=false;
    var div = L.DomUtil.create('div', 'info legend');
    var filterControl = L.control({position: 'topleft'});
    var gridControl=L.control({position: 'bottomright'});
    var labels;
    var colNames=[];
    var features=[];
    var arrLayers=[];//All the layers of each map stored in the database
    var aLayers=[];//All the layers in the map view
    var capas=[];
    //$scope.resetModel.value=false;
    angular.extend($scope, {
      center: {
        lat: 6.2913889,
        lng: -75.5361111,
        zoom: 15
      }
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
          labels = ['<div style="text-align:center"><strong>'+data.titulo+'</strong></div>'];
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
      //$scope.data.aCapas=[];
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
              //createLegend(layerId);//Create legend if the layer has been classified
              //loadAttributes(layerId);
              capas.push({layerId:arrLayers[i],name:res.nombre,features:res.features});
            }

          },error: function(xhr) {
            cont=cont+1;
          }
        });
      }
      for(var k=0;k<capas.length;k++){
        //console.log(capas[k].layerId);
        var capaId=capas[k].layerId;
        var features=capas[k].features;
        loadLayer(features);//Load the layerId to the leaflet map
        createLegend(features);//Create legend if the layer has been classified
        loadAttributes(features);
      }

      if(arrLayers.length==cont){
        alert("Todas las capas del mapa fueron borradas de la base de datos.");
      }else{
        leafletData.getMap("mapabase2").then(function(map) {
          if(colNames.length>0){
            colNames=geoOperation.remove_duplicates(colNames);//Remove duplicate values in array
            $scope.attrNames=colNames;//Assign all the attribute names
            $scope.attribute=-1;
            $scope.layerSelected=-1;
          }
          //Remove legend if it was added before to the map
          if(isLengendAdded){
            legend.removeFrom(map);
          }
          //Remove filter control if it was added before to the map
          if(isFilterControlAdded){
            filterControl.removeFrom(map);
          }
          //Remove grid control if it was added before to the map
          if(isGridControlAdded){
            gridControl.removeFrom(map);
          }

          //Add legend to the map
          legend.onAdd = function (map) {
            div.innerHTML = labels.join('<br>');
            return div;
          };
          legend.addTo(map);
          isLengendAdded=true;
          var h=$('.legend').height();
          if(h>600){
            $('.info').addClass('scrollCls');//Add scroll to info class
            $('.legend').height(600);
          }
          //Add filterControl to the map
          filterControl.onAdd = function(map) {
            this._div = L.DomUtil.create('div', 'filterControl');
            this._div.innerHTML = '<form><div><label style="color:#000000;">Atributo</label><select name="attribute_sel" data-ng-model="attribute" ng-options="attrName as attrName for attrName in attrNames" ng-change="selectAttribute()" style="display:block;width:100%;"><option value="">---Seleccionar atributo---</option></select></div>' +
            '<div><label style="color:#000000;">Valor</label>' +'<select name="value_sel" data-ng-model="attributevalue" ng-options="attribVal for attribVal in attrValues" style="display:block;width:100%;"><option value="">---Seleccionar valor---</option></select></div><div style="margin-top:5px;"><input id="btn" type="button" ng-click="executeFilter()" value="Ejecutar"> <input id="btn" type="button" ng-click="resetMap()" value="Borrar filtro"></div><form>';
            $compile(this._div)($scope);
            return this._div;
          }
          filterControl.addTo(map);
          isFilterControlAdded=true;
          //Add gridControl to the map
          gridControl.onAdd = function(map) {
            this._div = L.DomUtil.create('div', 'gridControl');
            this._div.innerHTML = '<div><label style="color:#000000;">Capa</label><select name="layer_sel" data-ng-model="layerSelected" ng-options="option.name for option in aCapas track by option.layerId" ng-change="selectLayer()" style="display:block;width:100%;"><option value="">---Seleccionar Capa---</option></select></div><br><div id="tbl"></div>';
            $compile(this._div)($scope);
            return this._div;
          }
          $scope.aCapas=capas;
          gridControl.addTo(map);
          isGridControlAdded=true;
        });
      }
    }
    $scope.executeFilter=function(){
      try{
        var attrName=$scope.attribute;
        var attrValue=$scope.attributevalue;
        if(attrValue!=null){
          clearMap();
          for(var i=0;i<arrLayers.length;i++){
            var layerId=arrLayers[i];//Read layerId from the map collection (mongo database)
            for(var j=0;j<capas.length;j++){
              var capaId=capas[j].layerId;
              if(capaId==layerId){
                var features=capas[j].features;

                var contents=features;
                var fc = JSON.parse(JSON.stringify(eval("(" + contents + ")")));
                //var fc = turf.featurecollection(geojson);
                var filter = turf.filter(fc, attrName, attrValue);

                var color=geoOperation.get_random_color();
                if(filter.features.length==0&&geoOperation.parseNumber(attrValue)!=null){
                  filter = turf.filter(fc, attrName, geoOperation.parseNumber(attrValue));
                }

                if(filter.features.length>0){
                  leafletData.getMap("mapabase2").then(function(map) {
                    var fcgj = L.geoJson(filter, {
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
                      map.fitBounds(fcgj.getBounds());
                      map.spin(false);
                      aLayers.push(fcgj);
                    });
                  }
                }
              }
            }
          }
        }catch(err){}
      }
      $scope.resetMap=function(){
        //$scope.attrValues=[];
        //$scope.attrNames=[];
        $scope.attribute="";
        $scope.attributevalue="";
        clearMap();
        //var mapId= $stateParams.mapId;
        //loadApp(mapId);//Load the map
        for(var i=0;i<capas.length;i++){
          var capaId=capas[i].layerId;
          var features=capas[i].features;
          loadLayer(features);//Load the layerId to the leaflet map
          createLegend(features);//Create legend if the layer has been classified
          //loadAttributes(features);
        }
      }
      $scope.selectAttribute=function(){
        var attributeName=$scope.attribute;
        var values=[];
        $scope.attrValues=values;
        for(var i=0;i<features.length;i++){
          var attrVal=features[i][attributeName];
          if(attrVal!=null){
            values.push(attrVal);
          }
        }
        values=geoOperation.remove_duplicates(values);//Remove duplicate values in array
        $scope.attrValues=values;
      }
      $scope.selectLayer=function(){
        if($scope.layerSelected!=null){
          var layerId=$scope.layerSelected.layerId;//Get selected layerId from database
          fillGrid(layerId);
        }
      }
      function clearMap(){
        //console.log(aLayers);
        leafletData.getMap("mapabase2").then(function(map) {
          for(var i=0;i<aLayers.length;i++){
            map.removeLayer(aLayers[i]);
          }
          aLayers=[];//Clear all the layers from the map added to aLayers
        });
      }
      //Load layer from the mongo database
      function loadLayer(features){
        try{
          var contents=features;
          var fc = JSON.parse(JSON.stringify(eval("(" + contents + ")")));
          //var fc = turf.featurecollection(res.geojson);
          var color=geoOperation.get_random_color();
          angular.forEach(fc.features, function(value, key){
            if (fc.features[key].properties==null){
              fc.features[key].properties={};
            }
          });
          leafletData.getMap("mapabase2").then(function(map) {
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
              aLayers.push(geojson);
              map.fitBounds(geojson.getBounds());
              map.spin(false);
            });

          }catch(err){
            //console.log(err);
          }
        }
        function loadAttributes(feat){
          try{

            //var json=res.geojson;
            var contents=feat;
            var json = JSON.parse(JSON.stringify(eval("(" + contents + ")")));

            angular.forEach(json.features, function(value, key){
              try{
                var featureProperties=json.features[key].properties;
                //features.push(featureProperties);
                var arrFeatures={};
                angular.forEach(featureProperties, function(value, key){
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
                                      colNames.push(key);
                                      arrFeatures[key]=value;
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
                features.push(arrFeatures);
              }catch(err){

              }
            })

          }catch(err){

          }
        }
        //Fill the grid table when a layer is selected in gridControl
        function fillGrid(layerId){
          //console.log("layer Id="+layerId);
          var columnNames=[];
          var th='<thead><tr>';
          var tdA,td='<tbody>';
          var table='<table id="attributes">';
          for(var k=0;k<capas.length;k++){
            var capaId=capas[k].layerId;
            if(layerId==capaId){
              var features=capas[k].features;
              try{
                //var json=res.geojson;
                var contents=features;
                var json = JSON.parse(JSON.stringify(eval("(" + contents + ")")));
                angular.forEach(json.features, function(value, key){
                  try{
                    var featureProperties=json.features[key].properties;
                    if(featureProperties!=null){
                      tdA='<tr>';
                      angular.forEach(featureProperties, function(value, key){
                        if(key!="stroke"){
                          if(key!="stroke-width"){
                            if(key!="stroke-opacity"){
                              if(key!="fill"){
                                if(key!="fill-opacity"){
                                  if(key!="marker-color"){
                                    if(key!="marker-size"){
                                      if(key!="marker-symbol"){
                                        if(key!="line-stroke"){
                                          columnNames.push(key);
                                          //if(td.indexOf(value)==-1){
                                          tdA=tdA+'<td>'+value+'</td>';
                                          //}
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
                      tdA=tdA+'</tr>';
                      td=td+tdA;
                    }
                  }catch(err){

                  }
                });
                columnNames=geoOperation.remove_duplicates(columnNames);
                for(var i=0;i<columnNames.length;i++){
                  th=th+'<th>'+columnNames[i]+'</th>';
                }
                th=th+'</tr></thead>';
                table=table+th+td+'</tbody></table>';

                /*if(layerId=='576c00f2eb52db2c19bdab77'){
                table='<table id="attributes"><thead><tr><th>etiqueta</th><th>AREA</th><th>POPULATION</th><th>etiqueta</th><th>AREA</th><th>POPULATION</th><th>etiqueta</th><th>AREA</th><th>POPULATION</th><th>etiqueta</th><th>AREA</th><th>POPULATION</th><th>etiqueta</th><th>AREA</th><th>POPULATION</th></tr></thead><tbody><tr><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td></tr><tr><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td></tr><tr><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td></tr><tr><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td></tr><tr><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td></tr><tr><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td></tr><tr><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td></tr><tr><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td></tr><tr><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td></tr><tr><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td><td>=1500</td><td>1500</td><td>10000</td></tr></tbody></table>';
              }*/

              $('#tbl').html(table);
              var width=$('#attributes').width();
              var height=$('#attributes').height();
              //alert(width);
              if(width>500){
                if(!$('#tbl').hasClass('tblCls')){
                  $('#tbl').addClass('tblCls');//Add scroll to info class
                }
                $('#tbl').width(485);
              }
              if(height>250){
                if(!$('#tbl').hasClass('tblCls')){
                  $('#tbl').addClass('tblCls');//Add scroll to info class
                }
                $('#tbl').height(235);
              }
              //console.log(table);

            }catch(err){

            }
          }
        }
      }
      function createLegend(features){
        var arrColors=[];
        var markerIcons=[];
        var arrTags=[];
        var arrLineType=[];
        try{

          var b=false;//Indicates that the layer has legend
          var contents=features;
          var fc = JSON.parse(JSON.stringify(eval("(" + contents + ")")));
          angular.forEach(fc.features, function(value, key){
            try{
              var tag=fc.features[key].properties["etiqueta"];
              if(tag!=null){
                b=true;
              }
            }catch(err){

            }
          });
          if(b){
            var typeG=geoOperation.getTypeGeometry(fc);

            leafletData.getMap("mapabase2").then(function(map) {
              if(typeG=="Point"){
                angular.forEach(fc.features, function(value, key){
                  var tag=fc.features[key].properties["etiqueta"];
                  var markerColor=fc.features[key].properties["marker-color"];
                  var markerSymbol=fc.features[key].properties["marker-symbol"];
                  if(tag!=null){
                    tag = tag.replace("%3D","=");
                    tag = tag.replace("%3C","<");
                    markerColor = markerColor.replace("%23", "#");
                    var idx= arrTags.indexOf(tag);
                    if(idx==-1){
                      arrTags.push(tag);
                      arrColors.push(markerColor);
                      markerIcons.push(markerSymbol);
                    }
                  }
                });
                arrColors.clean("undefined");
                arrColors.clean(undefined);
                arrTags.clean("undefined");
                arrTags.clean(undefined);
                markerIcons.clean("undefined");
                markerIcons.clean(undefined);
                var arrTagAux=[];
                for(var k=0;k<arrTags.length;k++){
                  if(arrTags[k].charAt(0)=='<'){
                    var n=arrTags[k].replace("<=","");
                    arrTagAux.push(parseNumber(n));
                  }
                }
                if(arrTagAux.length>0){
                  for(var i=0;i<(arrTagAux.length-1);i++){
                    for(var j=i+1;j<arrTagAux.length;j++){
                      if(arrTagAux[i]>arrTagAux[j]){
                        //Change values
                        var variableauxiliar=arrTagAux[i];
                        arrTagAux[i]=arrTagAux[j];
                        arrTagAux[j]=variableauxiliar;

                        var variableauxiliar1=arrTags[i];
                        arrTags[i]=arrTags[j];
                        arrTags[j]=variableauxiliar1;

                        var variableauxiliar2=arrColors[i];
                        arrColors[i]=arrColors[j];
                        arrColors[j]=variableauxiliar2;

                        var variableauxiliar3=markerIcons[i];
                        markerIcons[i]=markerIcons[j];
                        markerIcons[j]=variableauxiliar3;

                      }
                    }
                  }
                }
                var arrLegendLen=arrTags.length;

                for (var i = 0; i < arrLegendLen; i++) {
                  var color=arrColors[i].replace("#","");
                  var img=mapAPI+"pin-m-"+markerIcons[i]+"+"+color+".png";
                  div.innerHTML += labels.push('<img src="' + img + '" width="20" height="40"/>' +arrTags[i]+ '<br>');
                }

              }else if(typeG=="LineString"){
                angular.forEach(fc.features, function(value, key){
                  var lineStroke=fc.features[key].properties["line-stroke"];
                  var tag=fc.features[key].properties["etiqueta"];
                  var stroke=fc.features[key].properties["stroke"];
                  if(tag!=null){
                    tag = tag.replace("%3D","=");
                    tag = tag.replace("%3C","<");
                    stroke = stroke.replace("%23", "#");
                    arrTags.push(tag);
                    arrColors.push(stroke);
                    arrLineType.push(lineStroke);
                  }
                });
                arrTags=arrTags.unique();
                arrColors=arrColors.unique();
                arrColors.clean("undefined");
                arrColors.clean(undefined);
                arrTags.clean("undefined");
                arrTags.clean(undefined);
                arrLineType.clean("undefined");
                arrLineType.clean(undefined);
                var arrTagAux=[];
                for(var k=0;k<arrTags.length;k++){
                  if(arrTags[k].charAt(0)=='<'){
                    var n=arrTags[k].replace("<=","");
                    arrTagAux.push(parseNumber(n));
                  }
                }
                if(arrTagAux.length>0){
                  for(var i=0;i<(arrTagAux.length-1);i++){
                    for(var j=i+1;j<arrTagAux.length;j++){
                      if(arrTagAux[i]>arrTagAux[j]){
                        //Change values
                        var variableauxiliar=arrTagAux[i];
                        arrTagAux[i]=arrTagAux[j];
                        arrTagAux[j]=variableauxiliar;

                        var variableauxiliar1=arrTags[i];
                        arrTags[i]=arrTags[j];
                        arrTags[j]=variableauxiliar1;

                        var variableauxiliar2=arrColors[i];
                        arrColors[i]=arrColors[j];
                        arrColors[j]=variableauxiliar2;

                        var variableauxiliar3=arrLineType[i];
                        arrLineType[i]=arrLineType[j];
                        arrLineType[j]=variableauxiliar3;

                      }
                    }
                  }
                }
                var arrLegendLen=arrTags.length;

                for (var i = 0; i < arrLegendLen; i++) {

                  if(arrLineType[i]=="stroke1"){
                    div.innerHTML += labels.push('<s style="border-bottom: 2px solid ' + arrColors[i] + '"></s> ' +arrTags[i]+ '<br>');
                  }else if(arrLineType[i]=="stroke2"){
                    div.innerHTML += labels.push('<s style="border-bottom: 2px dashed ' + arrColors[i] + '"></s> ' +arrTags[i]+ '<br>');
                  }else if(arrLineType[i]=="stroke3"){
                    div.innerHTML += labels.push('<s style="border-bottom: 2px dotted ' + arrColors[i] + '"></s> ' +arrTags[i]+ '<br>');
                  }else{
                    div.innerHTML += labels.push('<s style="border-bottom: 2px solid ' + arrColors[i] + '"></s> ' +arrTags[i]+ '<br>');
                  }
                }

              }else{
                angular.forEach(fc.features, function(value, key){
                  var tag=fc.features[key].properties["etiqueta"];
                  var fill=fc.features[key].properties["fill"];
                  if(tag!=null){
                    tag = tag.replace("%3D","=");
                    tag = tag.replace("%3C","<");
                    fill = fill.replace("%23", "#");
                    arrTags.push(tag);
                    arrColors.push(fill);
                  }
                });
                arrTags=arrTags.unique();
                arrColors=arrColors.unique();
                arrColors.clean("undefined");
                arrColors.clean(undefined);
                arrTags.clean("undefined");
                arrTags.clean(undefined);
                var arrTagAux=[];
                //Create a legend when the tag includes <=
                for(var k=0;k<arrTags.length;k++){
                  if(arrTags[k].charAt(0)=='<'){
                    var n=arrTags[k].replace("<=","");
                    arrTagAux.push(geoOperation.parseNumber(n));
                  }
                }
                if(arrTagAux.length>0){
                  for(var i=0;i<(arrTagAux.length-1);i++){
                    for(var j=i+1;j<arrTagAux.length;j++){
                      if(arrTagAux[i]>arrTagAux[j]){
                        //Change values
                        var variableauxiliar=arrTagAux[i];
                        arrTagAux[i]=arrTagAux[j];
                        arrTagAux[j]=variableauxiliar;

                        var variableauxiliar1=arrTags[i];
                        arrTags[i]=arrTags[j];
                        arrTags[j]=variableauxiliar1;

                        var variableauxiliar2=arrColors[i];
                        arrColors[i]=arrColors[j];
                        arrColors[j]=variableauxiliar2;

                      }
                    }
                  }
                }

                var arrLegendLen=arrTags.length;

                for (var i = 0; i < arrLegendLen; i++) {
                  div.innerHTML += labels.push('<i style="background:' + arrColors[i] + '"></i> ' +arrTags[i]+ '<br>');

                }
              }
            });
          }
        }catch(err){

        }
      }
      Array.prototype.clean = function(deleteValue) {
        for (var i = 0; i < this.length; i++) {
          if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
          }
        }
        return this;
      };
      Array.prototype.unique=function(a){
        return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
        });
      }
  })();
