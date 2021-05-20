(function() {
    'use strict';
angular
.module('smallgisApp')
.factory('geoOperation',geoOperation);

  geoOperation.$inject = ['$http','$q','$rootScope'];

  function geoOperation($http,$q,$rootScope) {
    var host="https://smallgis.herokuapp.com";
    //var host="http://localhost:9000";

    var showStyle =false;
    var makiValues ='';
    var maki = '';
    var entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    $http.get('../../data/maki.json')
      .then(function(res){
         makiValues = res.data;
         for (var i = 0; i < makiValues.length; i++) {
              maki += '<option value="' + makiValues[i].icon + '">';
         }
    });
    return{
      getFCNamebyID: function(layerID,info) {
        for (var layer in info) {
            var leafletid = parseInt(info[layer].id);
            layerID=parseInt(layerID);
            if (leafletid == layerID) {
                return info[layer].nombre;
            }
        }
      },
      getFCNamebyID2: function(layerID,info) {
        for (var layer in info) {
            var leafletid = parseInt(info[layer].id);
            layerID=parseInt(layerID);
            if (leafletid == layerID) {
                return info[layer].name;
            }
        }
      },
      getNamebyID:function(layerId,capas){
        for(var i=0;i<capas.length;i++){
          var id=parseInt(capas[i].id);
          if(layerId==id){
            return capas[i].nombre;
          }
        }
      },
      getFCGeombyID: function(layerID,map) {
        var resultado;
          map.eachLayer(function (layer) {
              if (layer._leaflet_id == layerID) {
                  resultado = layer._layers;
              }
          });
        return resultado;
      },
      getFCGeombyID2: function(layerID,capas) {
        var resultado;
        for(var i=0;i<capas.length;i++){
          var id=parseInt(capas[i].id);
          if(layerID==id){
            resultado=capas[i].capa._layers;
          }
        }
        return resultado;
      },
      getFTSGeom: function(layerID,originalFts) {
        var resultado;
        for(var i=0;i<originalFts.length;i++){
          var id=parseInt(originalFts[i].id);
          if(layerID==id){
            resultado=originalFts[i].fts;
          }
        }
        return resultado;
      },
      getFCLayerbyID: function(layerID,map) {
        var resultado;
          map.eachLayer(function (layer) {
              if (layer._leaflet_id == layerID) {
                  resultado = layer;
              }
          });
        return resultado;
      },
      getType: function(gj) {
        var resultado;
        if (gj.type === 'FeatureCollection') {
          resultado= 'FeatureCollection';
        } else {
          resultado=gj.type + '<' + gj.geometry.type + '>';
        }
        return resultado;
      },
      getTypeGeometry: function(gj){
       try{
          if (gj.type === 'FeatureCollection') {
            var type=gj.features[0].geometry.type;
            var auxType=type;
            var b=false;
            for(var i=0;i<gj.features.length;i++){
              if(gj.features[i].geometry.type==='Point'){
                type=gj.features[i].geometry.type;
              }
              if(gj.features[i].geometry.type==='LineString'){
                type=gj.features[i].geometry.type;
              }
              if(gj.features[i].geometry.type==='Polygon'){
                type=gj.features[i].geometry.type;
              }
              if(auxType!=type){
                b=true;
                break;
              }
              auxType=type;
            }
            if(b){
             return 'FeatureCollection';
            }else{
              return type;
            }
          }else {
             return gj.geometry.type;
          }
        }catch(err){
           return 'FeatureCollection';
        }
      },
      getTypeGeometryTopoJSON: function(gj){
       try{
          if (gj.objects.collection.type === 'GeometryCollection') {
            var type=gj.objects.collection.geometries[0].type;
            var auxType=type;
            var b=false;
            for(var i=0;i<gj.objects.collection.geometries.length;i++){
              if(gj.objects.collection.geometries[i].type==='Point'){
                type=gj.objects.collection.geometries[i].type;
              }
              if(gj.objects.collection.geometries[i].type==='LineString'){
                type=gj.objects.collection.geometries[i].type;
              }
              if(gj.objects.collection.geometries[i].type==='Polygon'){
                type=gj.objects.collection.geometries[i].type;
              }
              if(auxType!=type){
                b=true;
                break;
              }
              auxType=type;
            }
            if(b){
             return 'GeometryCollection';
            }else{
              return type;
            }
          }else {
             //return gj.geometry.type;
          }
        }catch(err){
           return 'GeometryCollection';
        }
      },
      find_in_object: function(my_object, my_criteria){
        return my_object.filter(function(obj) {
          return Object.keys(my_criteria).every(function(c) {
            return obj[c] == my_criteria[c];
          });
        });
      },
      appIsStoredByUsernameAndTitle: function(username,apptitle){
        var flag=false;
        $.ajax({
              async: false,
              type: "GET",
              url: host+"/api/aplicacions/"+username+"/"+apptitle,
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function (result) {
                  //console.log(result);
                  var returnOb = angular.fromJson(result);
                  if(returnOb!=null){
                       flag=true;
                  }
              },error: function(xhr) {
                  console.clear();
                  //console.log(xhr);
                  flag=false;
              }
         });
         return flag;
      },
      getTrackByCompany: function(companyId){
        var b=false;
        $.ajax({
          async: false,
          type: "GET",
          url: host+"/api/tracks/"+companyId,
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (result) {
            var returnOb = angular.fromJson(result);
            if(returnOb!=null){
               b=true;
            }
          },error: function(xhr) {
            console.log(xhr);
            //console.clear();
          }
        });
        return b;
      },
      //Function to convert String to boolean
      getBool: function(val) {
          return !!JSON.parse(String(val).toLowerCase());
      },
      getAppId: function(username,apptitle){
        var val='';
        $.ajax({
              async: false,
              type: "GET",
              url: host+"/api/aplicacions/"+username+"/"+apptitle,
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function (result) {
                  //console.log(result);
                  var returnOb = angular.fromJson(result);
                  if(returnOb!=null){
                       val=returnOb.id;
                  }
                  //console.clear();
              },error: function(xhr) {
                  console.clear();
                  console.log(xhr);
              }
         });
         return val;
      },
      getUrlVars: function(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
      },
      getUrlVal: function(param, url){
        url = String(url.match(/\?+.+/));
        url = url.replace("?", "");
        url = url.split("&");

        var x = 0;
        while (x < url.length)
        {
          var p = url[x].split("=");
          if (p[0] == param){
            return decodeURIComponent(p[1]);
          }
          x++;
        }
      },
      getUrl: function(){
        return window.location.href;
      },
      getBBox: function(features){
        var bounds = {}, coords, point, latitude, longitude;

        // We want to use the “features” key of the FeatureCollection (see above)
        var data = features;

        // Loop through each “feature”
        for (var i = 0; i < data.length; i++) {

          // Pull out the coordinates of this feature
          coords = data[i].geometry.coordinates;

          longitude = coords[0];
          latitude = coords[1];

            // Update the bounds recursively by comparing the current
            // xMin/xMax and yMin/yMax with the coordinate
            // we're currently checking
          bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
          bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
          bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
          bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;


        }
        // Returns an object that contains the bounds of this GeoJSON
        // data. The keys of this object describe a box formed by the
        // northwest (xMin, yMin) and southeast (xMax, yMax) coordinates.
        var bbox = [bounds.xMin, bounds.yMin, bounds.xMax, bounds.yMax];
        return bbox;

      },
      getBoundingBox: function(features) {
        var bounds = {}, coords, point, latitude, longitude;

        // We want to use the “features” key of the FeatureCollection (see above)
        var data = features;

        // Loop through each “feature”
        for (var i = 0; i < data.length; i++) {

          // Pull out the coordinates of this feature
          coords = data[i].geometry.coordinates[0];

          // For each individual coordinate in this feature's coordinates…
          for (var j = 0; j < coords.length; j++) {

            longitude = coords[j][0];
            latitude = coords[j][1];

            // Update the bounds recursively by comparing the current
            // xMin/xMax and yMin/yMax with the coordinate
            // we're currently checking
            bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
            bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
            bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
            bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
          }

        }
        // Returns an object that contains the bounds of this GeoJSON
        // data. The keys of this object describe a box formed by the
        // northwest (xMin, yMin) and southeast (xMax, yMax) coordinates.
        var bbox = [bounds.xMin, bounds.yMin, bounds.xMax, bounds.yMax];
        return bbox;
      },
      mapIsStoredByUsernameAndTitle: function(username,maptitle){
        var flag=false;
        $.ajax({
              async: false,
              type: "GET",
              url: host+"/api/mapas/"+username+"/"+maptitle,
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function (result) {
                  //console.log(result);
                  var returnOb = angular.fromJson(result);
                  if(returnOb!=null){
                       flag=true;
                  }
              },error: function(xhr) {
                  console.clear();
                  //console.log(xhr);
                  flag=false;
              }
         });
         return flag;
      },
      getMapVal: function(username,maptitle){
        var val='';
        $.ajax({
              async: false,
              type: "GET",
              url: host+"/api/mapas/"+username+"/"+maptitle,
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function (result) {
                  //console.log(result);
                  var returnOb = angular.fromJson(result);
                  if(returnOb!=null){
                       val=returnOb.id;
                  }
                  //console.clear();
              },error: function(xhr) {
                  console.clear();
                  console.log(xhr);
              }
         });
         return val;
      },
      mapIsSaved: function(mapId){
        var flag=false;
        $.ajax({
              async: false,
              type: "GET",
              url: host+"/api/mapas/"+mapId,
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function (result) {
                  //console.log(result);
                  var returnOb = angular.fromJson(result);
                  if(returnOb!=null){
                      flag=true;
                  }
                  //console.clear();
              },error: function(xhr) {
                  //console.clear();
                  console.log(xhr);
                  flag=false;
              }
         });
         return flag;
      },
      //App is private or it doesn't exist
      appIsPrivate: function(appId){
        var b=0;// Indicates 0(not found app), 1 (app is private), 2 (app is public)
        $.ajax({
              async: false,
              type: "GET",
              url: host+"/api/aplicacions/"+appId,
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function (data) {
                if(data.espublico){
                   b=2;
                }else{
                   b=1;
                }
              },error: function(xhr) {
                  alert("No se encontro ninguna aplicación.");
                  //console.clear();
              }
        });
        return b;
      },
      layerIsStoredByUsernameAndName: function(username,layername){
        var flag=false;
        $.ajax({
              async: false,
              type: "GET",
              url: host+"/api/capas/"+username+"/"+layername,
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function (result) {
                  //console.log(result);
                  var returnOb = angular.fromJson(result);
                  if(returnOb!=null){
                       flag=true;
                  }
              },error: function(xhr) {
                  console.clear();
                  //console.log(xhr);
                  flag=false;
              }
         });
         return flag;
      },
      getLayerVal: function(username,layername){
        var val='';
        $.ajax({
              async: false,
              type: "GET",
              url: host+"/api/capas/"+username+"/"+layername,
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function (result) {
                  //console.log(result);
                  var returnOb = angular.fromJson(result);
                  if(returnOb!=null){
                       val=returnOb.id;
                  }
                  //console.clear();
              },error: function(xhr) {
                  console.clear();
                  console.log(xhr);
              }
         });
         return val;
      },
      escapeHtml: function(string) {
        return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
          return entityMap[s];
        });
      },
      replaceAll: function( text, busca, reemplaza ){
       while (text.toString().indexOf(busca) != -1)
         text = text.toString().replace(busca,reemplaza);
         return text;
      },
      rgbToHex: function(rgb) {
        rgb = rgb.substring(4).replace(")", "").split(",");
        return "#" + this.componentToHex(parseInt(rgb[0], 10)) + this.componentToHex(parseInt(rgb[1], 10)) + this.componentToHex(parseInt(rgb[2], 10));
      },
      componentToHex: function(c) {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      },
      get_random_color: function() {
                    var letters = '0123456789ABCDEF'.split('');
                    var color = '#';
                    for (var i = 0; i < 6; i++ ) {
                        color += letters[Math.round(Math.random() * 15)];
                    }
                    return color;
      },
      parseNumber: function(val) {
        if (typeof val == "number") {
          return val;
        }
        if (typeof val == "string") {
          val = val.replace(/(\s|,)/g,'');

          if (val.match(/^-?[0-9]*[.]?[0-9]+$/)) return parseFloat(val);

          return null;
        }
        return null;
      },
      remove_duplicates: function(arr) {
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            obj[arr[i]] = true;
        }
        arr = [];
        for (var key in obj) {
            arr.push(key);
        }
        return arr;
      },
      getUrlVars: function(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
      },
      getUrlVal: function(param, url){
        url = String(url.match(/\?+.+/));
        url = url.replace("?", "");
        url = url.split("&");

        var x = 0;
        while (x < url.length)
        {
          var p = url[x].split("=");
          if (p[0] == param){
            return decodeURIComponent(p[1]);
          }
          x++;
        }
      },
      getRequirementByCompany: function(reqId){
        var b=false;
        try{
          $.ajax({
            async: false,
            type: "GET",
            url: host+"/api/requirements/"+reqId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
              var returnOb = angular.fromJson(result);
              if(returnOb!=null){
                 b=true;
              }
            },error: function(xhr) {
              console.log(xhr);
              //console.clear();
            }
          });
        }catch(err){}
        return b;
      },
      validateRequirementName:function(reqId, name){
        var b=false;
        $.ajax({
          async: false,
          type: "GET",
          url: host+"/api/requirements/"+reqId,
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (result) {
            var returnOb = angular.fromJson(result);
            if(returnOb!=null){
              var jsonPts=jQuery.parseJSON(JSON.stringify(eval("(" + returnOb.features + ")")));
              for(var i=0;i<jsonPts.points.length;i++){
                if(jsonPts.points[i].point.nombre==name){
                   b=true;
                   break;
                }
              }
            }
          },error: function(xhr) {
            console.log(xhr);
            console.clear();
          }
        });
        return b;
      },
      validateRequirementName2: function(arrReq,reqname){
        var b=false;
        for(var i=0;i<arrReq.length;i++){
          if(arrReq[i].nombre==reqname){
             b=true;
             break;
          }
        }
        return b;
      },
      randomString: function() {
             var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
             var string_length = 8;
             var randomstring = '';
             for (var i=0; i<string_length; i++) {
              var rnum = Math.floor(Math.random() * chars.length);
              randomstring += chars.substring(rnum,rnum+1);
             }
             return randomstring;
      },
      bindPopup: function(l){
         var writable=true;
         var props = JSON.parse(JSON.stringify(l.toGeoJSON().properties)),
             table = '',
             info = '';

         var properties = {};

         // Steer clear of XSS
         for (var k in props) {
             var e = escape(k);
             properties[e] = escape(props[k]);
             properties[e] = properties[e].replace("%23", "#");
             properties[e] = properties[e].replace("%3D","=");
             properties[e] = properties[e].replace("%3C","<");
         }

         if (!properties) return;

         if (!Object.keys(properties).length) properties = { '': '' };

         if (l.feature && l.feature.geometry && writable) {
             if (l.feature.geometry.type === 'Point' || l.feature.geometry.type === 'MultiPoint') {
                 if (!('marker-color' in properties)) {
                     table += '<tr class="style-row"><th><input type="text" value="marker-color"' + (!writable ? ' readonly' : '') + ' /></th>' +
                         '<td><input type="color" value="#7E7E7E"' + (!writable ? ' readonly' : '') + ' /></td></tr>';
                 }
                 if (!('marker-size' in properties)) {
                     table += '<tr class="style-row"><th><input type="text" value="marker-size"' + (!writable ? ' readonly' : '') + ' /></th>' +
                         '<td><input type="text" list="marker-size" value="medium"' + (!writable ? ' readonly' : '') + ' /><datalist id="marker-size"><option value="small"><option value="medium"><option value="large"></datalist></td></tr>';
                 }
                 if (!('marker-symbol' in properties)) {
                     table += '<tr class="style-row"><th><input type="text" value="marker-symbol"' + (!writable ? ' readonly' : '') + ' /></th>' +
                         '<td><input type="text" list="marker-symbol" value=""' + (!writable ? ' readonly' : '') + ' /><datalist id="marker-symbol">' + maki + '</datalist></td></tr>';
                 }
             }
             if (l.feature.geometry.type === 'LineString' || l.feature.geometry.type === 'MultiLineString' || l.feature.geometry.type === 'Polygon' || l.feature.geometry.type === 'MultiPolygon') {
                 if (!('stroke' in properties)) {
                     table += '<tr class="style-row"><th><input type="text" value="stroke"' + (!writable ? ' readonly' : '') + ' /></th>' +
                         '<td><input type="color" value="#555555"' + (!writable ? ' readonly' : '') + ' /></td></tr>';
                 }
                 if (!('stroke-width' in properties)) {
                     table += '<tr class="style-row"><th><input type="text" value="stroke-width"' + (!writable ? ' readonly' : '') + ' /></th>' +
                         '<td><input type="number" min="0" step="0.1" value="2"' + (!writable ? ' readonly' : '') + ' /></td></tr>';
                 }
                 if (!('stroke-opacity' in properties)) {
                     table += '<tr class="style-row"><th><input type="text" value="stroke-opacity"' + (!writable ? ' readonly' : '') + ' /></th>' +
                         '<td><input type="number" min="0" max="1" step="0.1" value="1"' + (!writable ? ' readonly' : '') + ' /></td></tr>';
                 }
             }
             if (l.feature.geometry.type === 'Polygon' || l.feature.geometry.type === 'MultiPolygon') {
                 if (!('fill' in properties)) {
                     table += '<tr class="style-row"><th><input type="text" value="fill"' + (!writable ? ' readonly' : '') + ' /></th>' +
                         '<td><input type="color" value="#555555"' + (!writable ? ' readonly' : '') + ' /></td></tr>';
                 }
                 if (!('fill-opacity' in properties)) {
                     table += '<tr class="style-row"><th><input type="text" value="fill-opacity"' + (!writable ? ' readonly' : '') + ' /></th>' +
                         '<td><input type="number" min="0" max="1" step="0.1" value="0.5"' + (!writable ? ' readonly' : '') + ' /></td></tr>';
                 }
             }
         }

         for (var key in properties) {
             if ((key == 'marker-color' || key == 'stroke' || key == 'fill') && writable) {
                 table += '<tr class="style-row"><th><input type="text" value="' + key + '"' + (!writable ? ' readonly' : '') + ' /></th>' +
                     '<td><input type="color" value="' + properties[key] + '"' + (!writable ? ' readonly' : '') + ' /></td></tr>';
             }
             else if (key == 'marker-size' && writable) {
                 table += '<tr class="style-row"><th><input type="text" value="' + key + '"' + (!writable ? ' readonly' : '') + ' /></th>' +
                     '<td><input type="text" list="marker-size" value="' + properties[key] + '"' + (!writable ? ' readonly' : '') + ' /><datalist id="marker-size"><option value="small"><option value="medium"><option value="large"></datalist></td></tr>';
             }
             else if (key == 'marker-symbol' && writable) {
                 table += '<tr class="style-row"><th><input type="text" value="' + key + '"' + (!writable ? ' readonly' : '') + ' /></th>' +
                     '<td><input type="text" list="marker-symbol" value="' + properties[key] + '"' + (!writable ? ' readonly' : '') + ' /><datalist id="marker-symbol">' + maki + '</datalist></td></tr>';
             }
             else if (key == 'stroke-width' && writable) {
                 table += '<tr class="style-row"><th><input type="text" value="' + key + '"' + (!writable ? ' readonly' : '') + ' /></th>' +
                     '<td><input type="number" min="0" step="0.1" value="' + properties[key] + '"' + (!writable ? ' readonly' : '') + ' /></td></tr>';
             }
             else if ((key == 'stroke-opacity' || key == 'fill-opacity') && writable) {
                 table += '<tr class="style-row"><th><input type="text" value="' + key + '"' + (!writable ? ' readonly' : '') + ' /></th>' +
                     '<td><input type="number" min="0" max="1" step="0.1" value="' + properties[key] + '"' + (!writable ? ' readonly' : '') + ' /></td></tr>';
             }
             else {
                 table += '<tr><th><input type="text" value="' + key + '"' + (!writable ? ' readonly' : '') + ' /></th>' +
                     '<td><input type="text" value="' + properties[key] + '"' + (!writable ? ' readonly' : '') + ' /></td></tr>';
             }
         }

         if (l.feature && l.feature.geometry) {
             info += '<table class="metadata">';
             if (l.feature.geometry.type === 'LineString') {
                 var total = d3.pairs(l.feature.geometry.coordinates).reduce(function(total, pair) {
                     return total + L.latLng(pair[0][1], pair[0][0])
                         .distanceTo(L.latLng(pair[1][1], pair[1][0]));
                 }, 0);
                 info += '<tr><td>Metros</td><td>' + total.toFixed(2) + '</td></tr>' +
                         '<tr><td>Kilometros</td><td>' + (total / 1000).toFixed(2) + '</td></tr>' +
                         '<tr><td>Pies</td><td>' + (total / 0.3048).toFixed(2) + '</td></tr>' +
                         '<tr><td>Yardas</td><td>' + (total / 0.9144).toFixed(2) + '</td></tr>' +
                         '<tr><td>Millas</td><td>' + (total / 1609.34).toFixed(2) + '</td></tr>';
             } else if (l.feature.geometry.type === 'Point') {
                 info += '<tr><td>Latitud </td><td>' + l.feature.geometry.coordinates[1].toFixed(4) + '</td></tr>' +
                         '<tr><td>Longitud</td><td>' + l.feature.geometry.coordinates[0].toFixed(4) + '</td></tr>';
             } else if (l.feature.geometry.type === 'Polygon') {
               info += '<tr><td>Metros cuadrados</td><td>' + (LGeo.area(l)).toFixed(2) + '</td></tr>' +
                       '<tr><td>Kilometros cuadrados</td><td>' + (LGeo.area(l) / 1000000).toFixed(2) + '</td></tr>' +
                       '<tr><td>Pies cuadrados</td><td>' + (LGeo.area(l) / 0.092903).toFixed(2) + '</td></tr>' +
                       '<tr><td>Hectareas</td><td>' + ((LGeo.area(l) / 1000000)*100).toFixed(2) + '</td></tr>' +
                       '<tr><td>Acres</td><td>' + (LGeo.area(l) / 4046.86).toFixed(2) + '</td></tr>' +
                       '<tr><td>Millas cuadradas</td><td>' + (LGeo.area(l) / 2589990).toFixed(2) + '</td></tr>';
             }
             info += '</table>';
         }

         var tabs = '<div class="pad1 tabs-ui clearfix col12">' +
                         '<div class="tab col12">' +
                             '<input class="hide" type="radio" id="properties" name="tab-group" checked="true">' +
                             '<label class="keyline-top keyline-right tab-toggle pad0 pin-bottomleft z10 center col6" for="properties">Propiedades</label>' +
                             '<div class="space-bottom1 col12 content">' +
                                 '<table class="space-bottom0 marker-properties">' + table + '</table>' +
                                 (writable ? '<div class="add-row-button add fl col3"><span class="glyphicon glyphicon-plus" style="font-size: 12px;"> Agregar fila</div>' +
                                 '<div class="fl text-right col9"><input type="checkbox" id="show-style" name="show-style" value="true" checked><label for="show-style">Mostrar estilos</label></div>' : '') +
                             '</div>' +
                         '</div>' +
                         '<div class="space-bottom2 tab col12">' +
                             '<input class="hide" type="radio" id="info" name="tab-group">' +
                             '<label class="keyline-top tab-toggle pad0 pin-bottomright z10 center col6" for="info">Info</label>' +
                             '<div class="space-bottom1 col12 content">' +
                                 '<div class="marker-info">' + info + ' </div>' +
                             '</div>' +
                         '</div>' +
                     '</div>';

         var content = tabs +
             (writable ? '<div class="clearfix col12 pad1 keyline-top">' +
                 '<div class="pill col6">' +
                 '<button class="save col6 major">Guardar</button> ' +
                 '<button class="minor col6 cancel">Cancelar</button>' +
                 '</div>' +
                 '<button class="col6 text-right pad0 delete-invert"><span class="glyphicon glyphicon-remove"></span> Borrar entidad</button></div>' : '');

         l.bindPopup(L.popup({
             closeButton: false,
             maxWidth: 500,
             maxHeight: 400,
             autoPanPadding: [5, 45],
             className: 'geojsonio-feature'
         }, l).setContent(content));

         l.on('popupopen', function(e){
             if(showStyle === false) {
                 d3.select('#show-style').property('checked', false);
                   d3.selectAll('.style-row').style('display','none');
             }
             d3.select('#show-style').on('click', function() {
                 if (this.checked) {
                     showStyle = true;
                     d3.selectAll('.style-row').style('display','');
                 } else {
                     showStyle = false;
                     d3.selectAll('.style-row').style('display','none');
                 }
             });
         });
       }
   }
 }

})();//end service
