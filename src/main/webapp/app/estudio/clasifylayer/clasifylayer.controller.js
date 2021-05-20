(function() {
'use strict';
angular
    .module('smallgisApp')
    .controller('clasifylayerController', clasifylayerController);

clasifylayerController.$inject = ['$scope', 'leafletData','$element','close','$http','$rootScope','geoOperation','$timeout'];

function clasifylayerController($scope, leafletData,$element,close,$http,$rootScope,geoOperation,$timeout){
  //  This close function doesn't need to use jQuery or bootstrap, because
  //  the button has the 'data-dismiss' attribute.
  $scope.strokeValue=1.0;
  $scope.colorStroke="#000000";//Black color by default
  $scope.colorFill="#4682b4";
  $scope.colorHighLight="#ff6347";
  $scope.colorChoroDefault="#999999";
  $scope.optionVal=0;
  $scope.options = [];
  $scope.dataInfo=[];
  $rootScope.colorValue='1';
  $scope.data = {};
  $scope.data.colorChoroplethBuckets="3";
  $scope.data.iconMarker="circle-stroked";
  $scope.data.iconSize="small";
  $scope.data.lineStroke="stroke1";
  $scope.lineStrokeWidth=1;
  $scope.lineOpacity=1;
  $scope.choroplethJenks=true;
  $scope.choroplethRange=true;
  $scope.panelColorStroke=true;
  $scope.panelStyleEditor=false;
  $scope.panelStyleLineEditor=false;
  $scope.saveStyleContainer=false;
  $scope.saveStyleLineContainer=false;
  $scope.panelColorSimple=true;
  var linea_img = 'content/images/line.svg';
  var poligono_img = 'content/images/poligono.svg';
  var punto_img = 'content/images/punto.svg';
  var fcollection_img = 'content/images/fcollection.svg';

  $rootScope.tagName;
  $rootScope.typeG;
  var arrChoroplet=[];
  var arrTags=[];
  var rowIndex=0;//Selected index from the grid of tags (gridTagOptions)
  $scope.attrValues=[];
  $scope.numberOfClasses;
  var body = d3.select("body");
  var mapOptions = {
  width: 600,
  height: 600,
  projectionType: "mercator",
  projection: null,
  path: null,
  strokeWidth: 1,
  stroke: "white",
  fill: "steelblue",
  highlight: "tomato",
  colorType: "simple",
  choropleth: {buckets: 3, type: "numeric", scaleName: "YlGn", scale: d3.scale.quantize(), reverse: false, attribute: null, map: {}, default: "#999", attributeProblem: false},
  zoomMode: "free",
  responsive: false,
  tooltip: false
  };
  var styleEditorOptions={
    colorRamp: ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1', '#95a5a6', '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d']
  };
  var markerColor ="1abc9c";
  var lineColor ="1abc9c";
  var auxID="color-simple";
  var cont=1;
  var geojson;
  var highlightStyle;
  //$scope.layerNameClas=$rootScope.layerNameColor;
  $scope.layerNameClas="";


  if($rootScope.typeG=='Point'){

    $scope.choroplethJenks=false;
    $scope.choroplethRange=false;
    $scope.panelColorStroke=false;
    $scope.panelStyleEditor=true;
    $scope.panelColorSimple=false;
    auxID="color-simple";
    mapOptions.colorType="simple";
    $scope.gridTagOptions = {
           enableColumnResizing: true,
           data: 'dataInfo',
           enableSorting: true,
           columnDefs: [
            {
                  name:'Clase',
                  field : 'Clase'
            },
            {
                  name:'Etiqueta',
                  field : 'Etiqueta'
            },
            {
                  name:'MarkerIcon',
                  field : 'MarkerIcon'
            },
            {
                  name:'MarkerSize',
                  field : 'MarkerSize'
            },
            {
                  name:'MarkerColor',
                  field : 'MarkerColor'
            }
          ]
     };
  }else if($rootScope.typeG=='LineString'){
    $scope.choroplethJenks=false;
    $scope.choroplethRange=false;
    $scope.panelColorStroke=false;
    $scope.panelStyleLineEditor=true;
    $scope.panelColorSimple=false;
    auxID="color-simple";
    mapOptions.colorType="simple";
    $scope.gridTagOptions = {
           enableColumnResizing: true,
           data: 'dataInfo',
           enableSorting: true,
           columnDefs: [
            {
                  name:'Clase',
                  field : 'Clase'
            },
            {
                  name:'Etiqueta',
                  field : 'Etiqueta'
            },
            {
                  name:'Stroke',
                  field : 'Stroke'
            },
            {
                  name:'LineStroke',
                  field : 'LineStroke'
            },
            {
                  name:'LineStrokeWidth',
                  field : 'LineStrokeWidth'
            },
            {
                  name:'LineOpacity',
                  field : 'LineOpacity'
            }

          ]
     };
  }else{
    $scope.gridTagOptions = {
           enableColumnResizing: true,
           data: 'dataInfo',
           enableSorting: true,
           columnDefs: [
            {
                  name:'Clase',
                  field : 'Clase'
            },
            {
                  name:'Etiqueta',
                  field : 'Etiqueta'
            },
            {
                  name:'MarkerIcon',
                  field : 'MarkerIcon'
            },
            {
                  name:'MarkerSize',
                  field : 'MarkerSize'
            },
            {
                  name:'MarkerColor',
                  field : 'MarkerColor'
            }
          ]
     };
  }
  $timeout(function() {
   if($rootScope.typeG=='Point'){
     var parentDiv = document.getElementById('colors-scales');
     createColorPicker(parentDiv, function(e) {
           var color = geoOperation.rgbToHex(e.target.style.backgroundColor);
           markerColor = color.replace("#", "");
           //alert(markerColor);
           //this.setNewMarker();
     }.bind(this));
   }
   if($rootScope.typeG=='LineString'){
     var parentDiv = document.getElementById('colors-line-scales');
     createColorPicker(parentDiv, function(e) {
           var color = geoOperation.rgbToHex(e.target.style.backgroundColor);
           lineColor = color.replace("#", "");
           //alert(markerColor);
           //this.setNewMarker();
     }.bind(this));
   }
  },0);
  function createColorPicker(parentDiv, callback) {
       var colorPickerDiv = L.DomUtil.create('div', 'leaflet-styleeditor-colorpicker', parentDiv);
       styleEditorOptions.colorRamp.forEach(function(color) {
           var elem = L.DomUtil.create('div', 'leaflet-styleeditor-color', colorPickerDiv);
           elem.style.backgroundColor = color;

           L.DomEvent.addListener(elem, 'click', function(e) { e.stopPropagation(); callback(e); });
       }, this);

       L.DomUtil.create('br', '', parentDiv);
       L.DomUtil.create('br', '', parentDiv);

       return colorPickerDiv;
  }
  $scope.close = function(result) {

   var layerIDColor=$scope.layerIDColor;
   leafletData.getMap("mapabase").then(function(map) {
     map.eachLayer(function (layer) {
       if(layer._leaflet_id === layerIDColor) {
         if($rootScope.typeG!='Point'){
           angular.forEach(layer._layers, function(value, key){
                 var fillColor=$rootScope.originalColors[key];
                 var style={
                   color: $rootScope.originalColorStroke,
                   weight: $rootScope.originalStrokeValue,
                   opacity: $rootScope.originalOpacity,
                   fillOpacity:1.0,
                   fillColor: fillColor
                 };
                 layer._layers[key].setStyle(style);
           });
         }
         $rootScope.colorValue='1';
         $scope.optionVal=0;
         close(result, 500); // close, but give 500ms for bootstrap to animate
       }
     });
   });

  };
  $scope.setChoroDefault=function(){
    if(mapOptions.choropleth.attributeProblem){
      //mapOptions.colorType="simple";
      try{
        var color=$scope.colorStroke;  //Get color from input with ID=color-stroke
        var fillColor=$scope.colorChoroDefault;  //Get color from input with ID=color-fill
        mapOptions.choropleth.default=fillColor;
        var layerIDColor=$scope.layerIDColor;
        var layerNameColor=$scope.layerNameColor;
        var w = $scope.strokeValue;
        var defaultStyle = {
          color: color,
          weight: w,
          opacity: 0.6,
          fillOpacity:1.0,
          fillColor: fillColor
        };
        leafletData.getMap("mapabase").then(function(map) {
          map.eachLayer(function (layer) {
            if (layer._leaflet_id === layerIDColor) {
                layer.setStyle(defaultStyle);
            }
          });
        });
      }catch(err){

      }
    }
  }
  $scope.setStrokeWidth=function(){
      try{
        var color=$scope.colorStroke;  //Get color from input with ID=color-stroke
        var layerIDColor=$scope.layerIDColor;
        var layerNameColor=$scope.layerNameColor;
        var w = $scope.strokeValue;
        mapOptions.strokeWidth = w;
        var defaultStyle = {
          color: color,
          weight: w
        };
        leafletData.getMap("mapabase").then(function(map) {
          map.eachLayer(function (layer) {
            if (layer._leaflet_id === layerIDColor) {
                layer.setStyle(defaultStyle);
            }
          });
        });
      }catch(err){

      }
  }
  $scope.setColorStroke= function(){
    try{
      var color=$scope.colorStroke;  //Get color from input with ID=color-stroke
      var layerIDColor=$scope.layerIDColor;
      var layerNameColor=$scope.layerNameColor;
      var w = $scope.strokeValue;
      mapOptions.stroke=color;
      var defaultStyle = {
        color: color,
        weight: w
      };
      leafletData.getMap("mapabase").then(function(map) {
        map.eachLayer(function (layer) {
          if (layer._leaflet_id === layerIDColor) {
              layer.setStyle(defaultStyle);
          }
        });
      });
    }catch(err){

    }
  }
  $scope.setFillColor= function(){
    try{
      var color=$scope.colorStroke;  //Get color from input with ID=color-stroke
      var layerIDColor=$scope.layerIDColor;
      var layerNameColor=$scope.layerNameColor;
      var fillColor=$scope.colorFill;  //Get color from input with ID=color-fill
      var w = $scope.strokeValue;
      mapOptions.fill=fillColor;
      var defaultStyle = {
        color: color,
        weight: w,
        fillColor: fillColor
      };
      /*leafletData.getMap("mapa").then(function(map) {
        map.eachLayer(function (layer) {
          if (layer._leaflet_id === layerIDColor) {
              layer.setStyle(defaultStyle);
          }
        });
      });*/
    }catch(err){

    }
  }
  $scope.execute = function(result) {
     if($scope.optionVal==0){
         setClasifySimpleLayer(result);
     }else if($scope.optionVal==1){
         setClasifyJenks(result);
     }else if($scope.optionVal==2){
         setClasifyByRange(result);
     }else if($scope.optionVal==3){
       setClasifyByClasses(result);
     }
  };
  function populateScales(map){
  try{
    var selectedAttribute=$scope.data.colorChoropleth;
    var seletedChoroplethBucket=$scope.data.colorChoroplethBuckets;
    mapOptions.choropleth.buckets = parseInt(seletedChoroplethBucket);
    mapOptions.choropleth.attribute = selectedAttribute;

    var entries = d3.entries(colorbrewer[mapOptions.choropleth.type]).filter(function(d) {
       return d.value[mapOptions.choropleth.buckets];
    }).map(function(d) {
      return {key: d.key, value: (mapOptions.choropleth.reverse ? d.value[mapOptions.choropleth.buckets].slice(0).reverse() : d.value[mapOptions.choropleth.buckets])};
    });
    body.selectAll("div#color-choropleth-scales div").remove();
    var scales = d3.select("div#color-choropleth-scales").selectAll(".palette")
    .data(entries)
    .enter()
    .append("div")
    .attr("class","palette")
    .attr("title",function(d){return d.key;})
    .on("click",function(d) {

      var palette = d3.select(this);
      if (!palette.classed("selected")) {
        d3.select(".palette.selected").attr("class","palette");
        palette.attr("class","palette selected");
        mapOptions.choropleth.scaleName = d.key;
        //console.log("color selected.");
        //recolor();
      }

    });

    scales.classed("selected",function(d) { return (d.key == mapOptions.choropleth.scaleName); });

    var swatches = scales.selectAll(".swatch")
      .data(function(d){ return d.value; })
      .enter().append("div").attr("class","swatch")
      .style("background-color",function(d){ return d;});

     if (d3.select(".palette.selected").empty()) {
      d3.select(".palette").attr("class","palette selected");
     }
   }catch(err){

   }

  }
  function populateClassScale(map){
   try{
    var selectedAttribute=$scope.attribute.name;
    var seletedChoroplethBucket=$scope.attrValues.length;
    mapOptions.choropleth.buckets = parseInt(seletedChoroplethBucket);
    mapOptions.choropleth.attribute = selectedAttribute;

    var entries = d3.entries(colorbrewer[mapOptions.choropleth.type]).filter(function(d) {
       return d.value[mapOptions.choropleth.buckets];
    }).map(function(d) {
      return {key: d.key, value: (mapOptions.choropleth.reverse ? d.value[mapOptions.choropleth.buckets].slice(0).reverse() : d.value[mapOptions.choropleth.buckets])};
    });
    console.log(entries);
    arrChoroplet=entries[0].value;
    body.selectAll("div#color-choropleth-scales-2 div").remove();
    var scales = d3.select("div#color-choropleth-scales-2").selectAll(".palette")
    .data(entries)
    .enter()
    .append("div")
    .attr("class","palette")
    .attr("title",function(d){return d.key;})
    .on("click",function(d) {

      var palette = d3.select(this);
      if (!palette.classed("selected")) {
        d3.select(".palette.selected").attr("class","palette");
        palette.attr("class","palette selected");
        mapOptions.choropleth.scaleName = d.key;
        arrChoroplet=[];
        arrTags=[];
        for(var i=0;i<d.value.length;i++){
          var attrVal=String($scope.attrValues[i].attributevalue);
          /*arrChoroplet[attrVal]=d.value[i];
          arrTags[attrVal]=attrVal;*/
          arrChoroplet.push(d.value[i]);
          arrTags.push(attrVal);
        }
        console.log(arrChoroplet);
        console.log(arrTags);
        //console.log("color selected.");
        //recolor();
      }

    });

    scales.classed("selected",function(d) { return (d.key == mapOptions.choropleth.scaleName); });

    var swatches = scales.selectAll(".swatch")
      .data(function(d){ return d.value; })
      .enter().append("div").attr("class","swatch")
      .style("background-color",function(d){ return d;});

     if (d3.select(".palette.selected").empty()) {
      d3.select(".palette").attr("class","palette selected");
     }
   }catch(err){

   }
  }
  $scope.changeChoropleth = function() {
    leafletData.getMap("mapabase").then(function(map) {
      var value1 = $scope.checkboxModel.value1;
      //console.log(value1);
      var flag=false;
      if(value1==="yes"){
          flag=true;
      }else if(value1==="no"){
          flag=false;
      }
      mapOptions.choropleth.reverse = flag;
      populateScales(map);
      //recolor();
    });
  };
  $scope.selectAttributeChoroplet=function(){
    var layerNameColor=$scope.layerNameColor;
    //$scope.layerNameClas=layerNameColor+"("+$scope.data.colorChoropleth+")";
    leafletData.getMap("mapabase").then(function(map) {
       populateScales(map);
       //recolor();
    });
  }
  $scope.selectChoroplethBuckets=function(){
    leafletData.getMap("mapabase").then(function(map) {
       populateScales(map);
       //recolor();
    });
  }
  function resetHighlight(e) {
    geojson.resetStyle(e.target);
  }
  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle(highlightStyle);

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
  }
  $scope.eventClick1=function(){
    //alert($rootScope.tagName);

    if(auxID!="color-simple"){
      //console.log('1='+$rootScope.colorValue);
      if($rootScope.colorValue){
       $scope.optionVal=0;
       var layerNameColor=$scope.layerNameColor;
       //$scope.layerNameClas=layerNameColor;
       if($rootScope.typeG=='Point'){
         angular.element('#panel-style-editor').css('display','block');
         angular.element('#color-simple').css('display','none');
         angular.element('#color-choropleth').css('display','none');
         angular.element('#color-class').css('display','none');
         angular.element('#panel-grid-point').css('display','none');
         //angular.element('#save-style-container').css('display','none');
         $scope.saveStyleContainer=false;
         $('#colors-scales').empty();
         var parentDiv = document.getElementById('colors-scales');
         createColorPicker(parentDiv, function(e) {
               var color = geoOperation.rgbToHex(e.target.style.backgroundColor);
               markerColor = color.replace("#", "");
               //alert(markerColor);
         }.bind(this));
         auxID="color-simple";
         mapOptions.colorType="simple";
       }else if($rootScope.typeG=='LineString'){
            $scope.saveStyleLineContainer=false;
            angular.element('#panel-style-line-editor').css('display','block');
            angular.element('#panel-grid-point').css('display','none');
            angular.element('#color-class').css('display','none');
            $('#colors-line-scales').empty();
            var parentDiv = document.getElementById('colors-line-scales');
            createColorPicker(parentDiv, function(e) {
                  var color = geoOperation.rgbToHex(e.target.style.backgroundColor);
                  lineColor = color.replace("#", "");
            }.bind(this));
            auxID="color-simple";
            mapOptions.colorType="simple";
       }else{
         angular.element('#color-simple').css('display','block');
         angular.element('#color-choropleth').css('display','none');
         angular.element('#color-class').css('display','none');
         angular.element('#panel-grid-point').css('display','none');
         angular.element('#panel-style-editor').css('display','none');
         auxID="color-simple";
         mapOptions.colorType="simple";
       }
      }
   }
 };
  $scope.eventClick2=function(){
    if(auxID!="color-choropleth"){
      if($rootScope.colorValue){
        $scope.optionVal=1;

        angular.element('#color-simple').css('display','none');
        angular.element('#color-choropleth').css('display','block');
        angular.element('#color-class').css('display','none');
        angular.element('#panel-grid-point').css('display','none');
        angular.element('#panel-style-editor').css('display','none');
        auxID="color-choropleth";
        mapOptions.choropleth.attributeProblem = true;
        mapOptions.colorType="choropleth";
        var layerIDColor=$scope.layerIDColor;
        var layerNameColor=$scope.layerNameColor;
        var tableColsName=[];
        var newOptions = [];
        leafletData.getMap("mapabase").then(function(map) {
          map.eachLayer(function (layer) {
            if(layer._leaflet_id === layerIDColor) {
                 var arrLayers=layer._layers;
                 var cols=0;
                 var arrInfo;
                 //console.log(arrLayers);
                 //tableColsName=new Array(cols);
                 angular.forEach(arrLayers, function(value, key){
                    var cols=Object.keys(arrLayers[key].feature.properties).length;
                     if(cols!=0){
                       arrInfo=arrLayers[key].feature.properties;
                     }
                  });
                  angular.forEach(arrInfo, function(value, key){
                    var val=parseNumber(arrInfo[key]);
                    if(key!="stroke"){
                      if(key!="stroke-width"){
                        if(key!="stroke-opacity"){
                          if(key!="fill"){
                            if(key!="fill-opacity"){
                              if(val!=null){
                               tableColsName.push(key);
                              }
                            }
                          }
                        }
                      }
                    }
                  });
                  for(var i=0;i<tableColsName.length;i++){
                    if(tableColsName[i]=="$$hashKey"){
                       tableColsName.splice(i,1);
                    }
                  }
                  for(var i=0;i<tableColsName.length;i++){
                      newOptions.push(tableColsName[i]);
                  }

                  $scope.options = newOptions;
                  $scope.data.colorChoropleth=tableColsName[0];
                  //$scope.layerNameClas=layerNameColor+"("+tableColsName[0]+")";
                  populateScales(map);
              }
           });
         });
      }
    }
  };
  $scope.eventClick3=function(){
    if(auxID!="color-choropleth"){
      if($rootScope.colorValue){
        $scope.optionVal=2;

        angular.element('#color-simple').css('display','none');
        angular.element('#color-choropleth').css('display','block');
        angular.element('#color-class').css('display','none');
        angular.element('#panel-grid-point').css('display','none');
        angular.element('#panel-style-editor').css('display','none');
        auxID="color-choropleth";
        mapOptions.choropleth.attributeProblem = true;
        mapOptions.colorType="choropleth";
        var layerIDColor=$scope.layerIDColor;
        var layerNameColor=$scope.layerNameColor;
        var tableColsName=[];
        var newOptions = [];
        leafletData.getMap("mapabase").then(function(map) {
          map.eachLayer(function (layer) {
            if(layer._leaflet_id === layerIDColor) {
                 var arrLayers=layer._layers;
                 var cols=0;
                 var arrInfo;
                 //console.log(arrLayers);
                 //tableColsName=new Array(cols);
                 angular.forEach(arrLayers, function(value, key){
                    var cols=Object.keys(arrLayers[key].feature.properties).length;
                     if(cols!=0){
                       arrInfo=arrLayers[key].feature.properties;
                     }
                  });
                  angular.forEach(arrInfo, function(value, key){
                    var val=parseNumber(arrInfo[key]);
                    if(key!="stroke"){
                      if(key!="stroke-width"){
                        if(key!="stroke-opacity"){
                          if(key!="fill"){
                            if(key!="fill-opacity"){
                              if(val!=null){
                               tableColsName.push(key);
                              }
                            }
                          }
                        }
                      }
                    }
                  });
                  for(var i=0;i<tableColsName.length;i++){
                    if(tableColsName[i]=="$$hashKey"){
                       tableColsName.splice(i,1);
                    }
                  }
                  for(var i=0;i<tableColsName.length;i++){
                      newOptions.push(tableColsName[i]);
                  }

                  $scope.options = newOptions;
                  $scope.data.colorChoropleth=tableColsName[0];
                  //$scope.layerNameClas=layerNameColor+"("+tableColsName[0]+")";
                  populateScales(map);
              }
           });
         });
      }
    }
  };
  $scope.eventClick4=function(){
    if(auxID!="color-class"){
      //console.log('1='+$rootScope.colorValue);
      if($rootScope.colorValue){
       $scope.optionVal=3;
       if($rootScope.typeG=='Point'){
         $scope.saveStyleContainer=true;
         $('#color-cl-scales').hide();
         angular.element('#panel-style-editor').css('display','none');
         angular.element('#color-class').css('display','block');
         angular.element('#color-choropleth').css('display','none');
         angular.element('#color-simple').css('display','none');
         angular.element('#panel-color-stroke').css('display','none');
         angular.element('#panel-grid-point').css('display','block');
         //angular.element('#panel-style-editor').css('display','block');
         $('#colors-scales').empty();
         var parentDiv = document.getElementById('colors-scales');
         createColorPicker(parentDiv, function(e) {
               var color = geoOperation.rgbToHex(e.target.style.backgroundColor);
               markerColor = color.replace("#", "");
               //alert(markerColor);
               //this.setNewMarker();
         }.bind(this));
       }else if($rootScope.typeG=='LineString'){
         $scope.saveStyleLineContainer=true;
         $('#color-cl-scales').hide();
         angular.element('#panel-style-line-editor').css('display','none');
         angular.element('#color-class').css('display','block');
         angular.element('#panel-grid-point').css('display','block');
         //angular.element('#panel-style-editor').css('display','block');
         $('#colors-line-scales').empty();
         var parentDiv = document.getElementById('colors-line-scales');
         createColorPicker(parentDiv, function(e) {
               var color = geoOperation.rgbToHex(e.target.style.backgroundColor);
               lineColor = color.replace("#", "");
               //alert(markerColor);
               //this.setNewMarker();
         }.bind(this));
       }else{
         $('#color-cl-scales').hide();
         angular.element('#color-class').css('display','block');
         angular.element('#color-choropleth').css('display','none');
         angular.element('#color-simple').css('display','none');
       }
       auxID="color-class";
       var layerIDColor=$scope.layerIDColor;
       var layerNameColor=$scope.layerNameColor;

       $scope.attrNames=[];
       $scope.attrValues=[];
       var propsName;
       leafletData.getMap("mapabase").then(function(map) {
         map.eachLayer(function (layer) {
           if (layer._leaflet_id === layerIDColor) {

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
       //$scope.layerNameClas="";
       //mapOptions.colorType="simple";
      }
   }
  };
  $scope.show = function(row){

    angular.element('#panel-style-editor').css('display','block');
    angular.element('#save-style-container').css('display','block');
    var index = $scope.dataInfo.indexOf(row.entity);
    rowIndex=index;
    markerColor ="1abc9c";
    $scope.data.iconMarker="circle-stroked";
    $scope.data.iconSize="small";
  };
  $scope.showLine = function(row){

    angular.element('#panel-style-line-editor').css('display','block');
    angular.element('#save-style-line-container').css('display','block');
    var index = $scope.dataInfo.indexOf(row.entity);
    rowIndex=index;
    lineColor ="1abc9c";
    $scope.data.lineStroke="stroke1";
    $scope.lineStrokeWidth=1;
    $scope.lineOpacity=1;
  };
  $scope.gridTagOptions.onRegisterApi = function(gridApi){
    //set gridApi on scope
    $scope.gridApi = gridApi;
    gridApi.edit.on.beginCellEdit($scope, function(rowEntity, colDef) {
            var index = $rootScope.dataInfo.indexOf(rowEntity);
    });
  };
  $scope.saveStyle= function(){

    var markerSize=$scope.data.iconSize;
    var markerIcon=$scope.data.iconMarker;

    $scope.dataInfo[rowIndex]["MarkerIcon"]=markerIcon;
    $scope.dataInfo[rowIndex]["MarkerSize"]=markerSize;
    $scope.dataInfo[rowIndex]["MarkerColor"]="#"+markerColor;
  };
  $scope.saveStyleLine= function(){

    var lineStroke=$scope.data.lineStroke;
    var lineStrokeWidth=$scope.lineStrokeWidth;
    var lineOpacity=$scope.lineOpacity;
    $scope.dataInfo[rowIndex]["LineStroke"]=lineStroke;
    $scope.dataInfo[rowIndex]["LineStrokeWidth"]=lineStrokeWidth;
    $scope.dataInfo[rowIndex]["LineOpacity"]=lineOpacity;
    $scope.dataInfo[rowIndex]["Stroke"]="#"+lineColor;
  };
  $scope.selectAttribute = function(){
    try{
      var attributeName=$scope.attribute.name;
      var layerIDColor=$scope.layerIDColor;
      var layerNameColor=$scope.layerNameColor;
      //$scope.layerNameClas=layerNameColor+"("+attributeName+")";
      $scope.attrValues=[];
      if(layerIDColor!=""){
        layerIDColor=parseInt(layerIDColor);
        leafletData.getMap("mapabase").then(function(map) {
          map.eachLayer(function (layer) {
            if(layer._leaflet_id === layerIDColor) {
              if($rootScope.typeG=='Point'){
                var tableClass=[];
                $scope.attrValues=[];

                angular.forEach(layer._layers, function(value, key){
                  try{
                    var attributeVal=layer._layers[key].feature.properties[attributeName];
                    var b = valueInArray($scope.attrValues,attributeVal);
                    if(b==false){
                      var markerColor=layer._layers[key].feature.properties['marker-color'];
                      var markerSize=layer._layers[key].feature.properties['marker-size'];
                      var markerSymbol=layer._layers[key].feature.properties['marker-symbol'];
                        if(markerSymbol!=null){
                          if(markerSymbol!=""){
                            if(markerSymbol!=" "){
                               if(markerColor.charAt(0)!='#'){
                                  markerColor="#"+markerColor;
                               }
                               tableClass.push({Clase:attributeVal,Etiqueta:attributeVal,MarkerIcon:markerSymbol,MarkerSize:markerSize,MarkerColor:markerColor});
                            }else{
                              tableClass.push({Clase:attributeVal,Etiqueta:attributeVal,MarkerIcon:' ',MarkerSize:' ',MarkerColor:' '});
                            }
                          }else{
                            tableClass.push({Clase:attributeVal,Etiqueta:attributeVal,MarkerIcon:' ',MarkerSize:' ',MarkerColor:' '});
                          }
                        }else{
                            tableClass.push({Clase:attributeVal,Etiqueta:attributeVal,MarkerIcon:' ',MarkerSize:' ',MarkerColor:' '});
                        }
                      $scope.attrValues.push({attributevalue:attributeVal});
                    }
                  }catch(err){

                  }
                });
                var len=$scope.attrValues.length;
                $scope.numberOfClasses=len;
                $rootScope.columInfo=[];
                $rootScope.columInfo.push({name:'Clase',field:'Clase',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false});
                $rootScope.columInfo.push({name:'Etiqueta',field:'Etiqueta',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:true});
                $rootScope.columInfo.push({name:'MarkerIcon',field:'MarkerIcon',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false});
                $rootScope.columInfo.push({name:'MarkerSize',field:'MarkerSize',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false});
                $rootScope.columInfo.push({name:'MarkerColor',field:'MarkerColor',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false});
                $rootScope.columInfo.push({name:' ',cellTemplate:'<button class="btn primary" ng-click="grid.appScope.show(row)"><span class="glyphicon-util glyphicon-wrench"></span></button>',enableFullRowSelection: true,enableRowSelection: true,cellEditableCondition:false});
                $scope.gridTagOptions.columnDefs=$rootScope.columInfo;
                $scope.dataInfo = tableClass;
                $scope.gridTagOptions.data.concat(tableClass);
              }else if($rootScope.typeG=='LineString'){
                var tableClass=[];
                $scope.attrValues=[];

                angular.forEach(layer._layers, function(value, key){
                  try{
                    var attributeVal=layer._layers[key].feature.properties[attributeName];
                    var b = valueInArray($scope.attrValues,attributeVal);
                    if(b==false){
                      var lineColor=layer._layers[key].feature.properties['stroke'];
                      var lineStroke=layer._layers[key].feature.properties['line-stroke'];
                      var lineStrokeWidth=layer._layers[key].feature.properties['stroke-width'];
                      var lineOpacity=layer._layers[key].feature.properties['stroke-opacity'];
                        if(lineStrokeWidth!=null){
                          if(lineStrokeWidth!=""){
                            if(lineStrokeWidth!=" "){
                               if(lineColor.charAt(0)!='#'){
                                  lineColor="#"+lineColor;
                               }
                               tableClass.push({Clase:attributeVal,Etiqueta:attributeVal,Stroke:lineColor,LineStroke:lineStroke,LineStrokeWidth:lineStrokeWidth,LineOpacity:lineOpacity});
                            }else{
                              tableClass.push({Clase:attributeVal,Etiqueta:attributeVal,Stroke:' ',LineStroke:' ',LineStrokeWidth:' ',LineOpacity:' '});
                            }
                          }else{
                              tableClass.push({Clase:attributeVal,Etiqueta:attributeVal,Stroke:' ',LineStroke:' ',LineStrokeWidth:' ',LineOpacity:' '});
                          }
                        }else{
                              tableClass.push({Clase:attributeVal,Etiqueta:attributeVal,Stroke:' ',LineStroke:' ',LineStrokeWidth:' ',LineOpacity:' '});
                        }
                      $scope.attrValues.push({attributevalue:attributeVal});
                    }
                  }catch(err){

                  }
                });
                var len=$scope.attrValues.length;
                $scope.numberOfClasses=len;
                $rootScope.columInfo=[];
                $rootScope.columInfo.push({name:'Clase',field:'Clase',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false});
                $rootScope.columInfo.push({name:'Etiqueta',field:'Etiqueta',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:true});
                $rootScope.columInfo.push({name:'Stroke',field:'Stroke',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false});
                $rootScope.columInfo.push({name:'LineStroke',field:'LineStroke',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false});
                $rootScope.columInfo.push({name:'LineStrokeWidth',field:'LineStrokeWidth',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false});
                $rootScope.columInfo.push({name:'LineOpacity',field:'LineOpacity',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false});
                $rootScope.columInfo.push({name:' ',cellTemplate:'<button class="btn primary" ng-click="grid.appScope.showLine(row)"><span class="glyphicon glyphicon-wrench"></span></button>',enableFullRowSelection: true,enableRowSelection: true,cellEditableCondition:false});
                $scope.gridTagOptions.columnDefs=$rootScope.columInfo;
                $scope.dataInfo = tableClass;
                $scope.gridTagOptions.data.concat(tableClass);

              }else{
                angular.forEach(layer._layers, function(value, key){
                  try{
                    var attributeVal=layer._layers[key].feature.properties[attributeName];
                    var b = valueInArray($scope.attrValues,attributeVal);
                    if(b==false){
                      $scope.attrValues.push({attributevalue:attributeVal});
                      //console.log(attributeVal);
                    }
                  }catch(err){

                  }
                });
                var len=$scope.attrValues.length;
                $scope.numberOfClasses=len;
                arrChoroplet=[];
                arrTags=[];
                if(len!=0){
                   if(len>11||(len>=1&&len<=2)){
                     $('#color-cl-scales').hide();
                     for(var i=0;i<len;i++){
                       var attrVal=String($scope.attrValues[i].attributevalue);
                       //arrChoroplet[attrVal]=geoOperation.get_random_color();
                       //arrTags[attrVal]=attrVal;
                       arrChoroplet.push(geoOperation.get_random_color());
                       arrTags.push(attrVal);
                     }
                   }else{
                     $('#color-cl-scales').show();
                     mapOptions.choropleth.attributeProblem = true;
                     mapOptions.colorType="choropleth";
                     for(var i=0;i<len;i++){
                       var attrVal=String($scope.attrValues[i].attributevalue);
                       arrTags.push(attrVal);
                     }
                     populateClassScale(map);
                   }
                }
              }
            }
          });
        });
      }

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
  function recolor(from) {
    var mapped=[];
    var color;
    var colorStroke=$scope.colorStroke;  //Get color from input with ID=color-stroke
    var w = $scope.strokeValue;
    var layerIDColor=$scope.layerIDColor;
    var layerNameColor=$scope.layerNameColor;
    mapOptions.choropleth.attributeProblem = false;

    var colors = colorbrewer[mapOptions.choropleth.type][mapOptions.choropleth.scaleName][mapOptions.choropleth.buckets].slice(0);

    if (mapOptions.choropleth.reverse) colors.reverse();

    leafletData.getMap("mapabase").then(function(map) {
      map.eachLayer(function (layer) {
        if(layer._leaflet_id === layerIDColor) {
           var arrLayers=layer._layers;

           angular.forEach(arrLayers, function(value, key){
             try{
               var attribute=parseNumber(arrLayers[key].feature.properties[mapOptions.choropleth.attribute]);
               if(attribute!=null){
                 mapped.push(attribute);
                 //console.log(attribute);
               }
             }catch(err){

             }
            });
            //console.log("mapped="+mapped);
            if (!mapped.length) {
              mapOptions.choropleth.attributeProblem = true;
              mapOptions.choropleth.scale = d3.scale.quantize().domain([0,1]).range(colors);
              color=mapOptions.choropleth.default;
              var style= {
                color: colorStroke,
                weight: w,
                opacity: 0.6,
                fillOpacity:1.0,
                fillColor: color
              };
              layer.setStyle(style);
              alert("El atributo seleccionado para la escala de colores no es numérico o es vacío.");
              //mapOptions.colorType="simple";
            }else{
              //mapOptions.colorType="choropleth";
              mapOptions.choropleth.scale = d3.scale.quantize().domain(d3.extent(mapped)).range(colors);
              angular.forEach(layer._layers, function(value, key){
                try{
                  var num=parseNumber(layer._layers[key].feature.properties[mapOptions.choropleth.attribute]);
                  //console.log("original color="+arrLayers[key].options.fillColor);
                  if(num!=null){
                    color=mapOptions.choropleth.scale(num);
                    //console.log("color="+color);
                    var style1 = {
                      color: colorStroke,
                      weight: w,
                      opacity: 0.6,
                      fillOpacity:1.0,
                      fillColor: color
                    };
                    layer._layers[key].setStyle(style1);
                  }else{
                    color=mapOptions.choropleth.default;
                    var style2 = {
                      color: colorStroke,
                      weight: w,
                      opacity: 0.6,
                      fillOpacity:1.0,
                      fillColor: color
                    };
                    //console.log("color="+color);
                    layer._layers[key].setStyle(style2);
                  }
                }catch(err){
                    //console.log("exception="+err);
                }
               });

            }
        }
      });

    });
  }
  function setClasifySimpleLayer(result){
    try{
    var layerNameClas=$scope.layerNameClas;
    if(layerNameClas!=""){
      var name=layerNameClas;
      var tagName=$rootScope.tagName;//Tag name for JSON's object
      var color=$scope.colorStroke;  //Get color from input with ID=color-stroke
      var fill=$scope.colorFill;  //Get color from input with ID=color-fill
      var layerIDColor=$scope.layerIDColor;
      var layerNameColor=$scope.layerNameColor;
      var colorH=$scope.colorHighLight;
      var w = $scope.strokeValue;
      mapOptions.highlight=colorH;
      var type;
      highlightStyle = {
        color: color,
        weight: w,
        opacity: 0.6,
        fillOpacity: 0.65,
        fillColor: colorH
      };
      if($rootScope.typeG=='Point'){
         var markerIcon=$scope.data.iconMarker;//Get markerIcon from select#select-icon-marker
         var markerSize=$scope.data.iconSize;//Get markerSize from select#select-icon-size
         leafletData.getMap("mapabase").then(function(map) {
           map.eachLayer(function (layer) {
             if (layer._leaflet_id === layerIDColor) {
                 var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                 geojson=L.geoJson(json,{
                     style: function (feature) {
                       return {stroke: true, color: '#000000', weight:2, fillOpacity: 1.0};
                     },
                     onEachFeature: function(feature, layer){
                       if(layer instanceof L.Marker) {
                           type = 'Point';
                       }else if (layer instanceof L.Polygon) {
                          type = 'Polygon';
                       }else if (layer instanceof L.Polyline) {
                          type = 'LineString';
                       }else if (layer instanceof L.Circle) {
                          type = 'Circle';
                       }
                     }
                 });
                 updateProjection(json,mapOptions.width,mapOptions.height);
                 //name="Clas_"+$rootScope.counter+"_"+layerNameColor;
                 $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
                 map.invalidateSize();
                 map.fitBounds(geojson.getBounds());
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
                 $rootScope.counter++;
                 $rootScope.colorValue='1';
                 $scope.optionVal=0;
                 if(markerColor.charAt(0)!='#'){
                    markerColor="#"+markerColor;
                 }
                 leafletData.getMap("mapabase").then(function(map) {
                   map.eachLayer(function (layer) {
                     if(layer._leaflet_id === parseInt(lastId)) {
                       angular.forEach(layer._layers, function(value, key){
                           var objson='{"marker-color":"'+markerColor+'","marker-size":"'+markerSize+'","marker-symbol":"'+markerIcon+'","etiqueta":"'+tagName+'",';
                           angular.forEach(layer._layers[key].feature.properties, function(value1, key1){
                             var nValue=geoOperation.parseNumber(value1);
                              if(nValue==null){
                                if(key1!="marker-color"){
                                  if(key1!="marker-size"){
                                    if(key1!="marker-symbol"){
                                      if(key1!="etiqueta"){
                                       objson=objson+'"'+key1+'" : "'+value1+'",';
                                      }
                                     }
                                   }
                                 }
                              }else{
                                if(key1!="marker-color"){
                                  if(key1!="marker-size"){
                                    if(key1!="marker-symbol"){
                                      if(key1!="etiqueta"){
                                       objson=objson+'"'+key1+'" : '+nValue+',';
                                      }
                                     }
                                   }
                                 }
                              }
                           });
                           var lastChar=objson.slice(-1);
                           if(lastChar==','){
                              objson = objson.substring(0, objson.length - 1);
                           }
                           objson=objson+'}';
                           var obj = angular.fromJson(objson);
                           layer._layers[key].feature.properties=obj;
                           var mSize="s";
                           if(markerSize=="small"){
                              mSize="s";
                           }else if(markerSize=="medium"){
                              mSize="m";
                           }else if(markerSize=="large"){
                              mSize="l";
                           }else{
                              mSize="m";
                              markerSize="medium";
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

                           var pinColor=markerColor.replace("#","");
                           var iconURL=$rootScope.mapAPI+'pin-'+mSize+'-'+markerIcon+'+'+pinColor+'.png';
                           layer._layers[key].setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                                 iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                                 popupAnchor: [0, -iconSize[1] / 2]}));
                           geoOperation.bindPopup(layer._layers[key]);
                        });
                     }
                   });
                 });
                 $element.modal('hide');
                 close(result, 500);// close, but give 500ms for bootstrap to animate
             }
           });
         });
      }else if($rootScope.typeG=='LineString'){
        var lineStroke=$scope.data.lineStroke;//Get lineStroke from select#sel-line-stroke
        var lineStrokeWidth=$scope.lineStrokeWidth;//Get lineStrokeWidth from input#line-stroke-width
        var lineOpacity=$scope.lineOpacity;
        if(lineOpacity>1){
           lineOpacity=1;
        }
        leafletData.getMap("mapabase").then(function(map) {
          map.eachLayer(function (layer) {
            if (layer._leaflet_id === layerIDColor) {
                var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                geojson=L.geoJson(json,{
                    style: function (feature) {
                      return {stroke: true, color: '#000000', weight:2, fillOpacity: 1.0};
                    },
                    onEachFeature: function(feature, layer){
                      if(layer instanceof L.Marker) {
                          type = 'Point';
                      }else if (layer instanceof L.Polygon) {
                         type = 'Polygon';
                      }else if (layer instanceof L.Polyline) {
                         type = 'LineString';
                      }else if (layer instanceof L.Circle) {
                         type = 'Circle';
                      }
                    }
                });
                $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
                map.invalidateSize();
                map.fitBounds(geojson.getBounds());
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
                $rootScope.counter++;
                $rootScope.colorValue='1';
                $scope.optionVal=0;
                //Checks if first character is not '#'
                if(lineColor.charAt(0)!='#'){
                   lineColor="#"+lineColor;
                }
                leafletData.getMap("mapabase").then(function(map) {
                  map.eachLayer(function (layer) {
                    if(layer._leaflet_id === parseInt(lastId)) {
                      angular.forEach(layer._layers, function(value, key){
                          var objson='{"stroke":"'+lineColor+'","line-stroke":"'+lineStroke+'","stroke-width":"'+lineStrokeWidth+'","stroke-opacity":"'+lineOpacity+'","etiqueta":"'+tagName+'",';
                          angular.forEach(layer._layers[key].feature.properties, function(value1, key1){
                            var nValue=geoOperation.parseNumber(value1);
                             if(nValue==null){
                               if(key1!="stroke"){
                                 if(key1!="line-stroke"){
                                   if(key1!="stroke-width"){
                                      if(key1!="stroke-opacity"){
                                         if(key1!="etiqueta"){
                                            objson=objson+'"'+key1+'" : "'+value1+'",';
                                         }
                                      }
                                    }
                                  }
                                }
                             }else{
                               if(key1!="stroke"){
                                 if(key1!="line-stroke"){
                                   if(key1!="stroke-width"){
                                     if(key1!="stroke-opacity"){
                                       if(key1!="etiqueta"){
                                          objson=objson+'"'+key1+'" : '+nValue+',';
                                       }
                                     }
                                    }
                                  }
                                }
                             }
                          });
                          var lastChar=objson.slice(-1);
                          if(lastChar==','){
                             objson = objson.substring(0, objson.length - 1);
                          }
                          objson=objson+'}';
                          var obj = angular.fromJson(objson);
                          layer._layers[key].feature.properties=obj;

                          setStyleLine('opacity', lineOpacity, layer._layers[key]);
                          setStyleLine('color', lineColor, layer._layers[key]);
                          setStyleLine('weight', lineStrokeWidth, layer._layers[key]);
                          if(lineStroke=='stroke1'){
                           setStyleLine('dashArray', '1', layer._layers[key]);
                          }else if(lineStroke=='stroke2'){
                           setStyleLine('dashArray', '10,10', layer._layers[key]);
                          }else if(lineStroke=='stroke3'){
                           setStyleLine('dashArray', '15, 10, 1, 10', layer._layers[key]);
                          }
                          geoOperation.bindPopup(layer._layers[key]);
                       });
                    }
                  });
                });
                $element.modal('hide');
                close(result, 500);// close, but give 500ms for bootstrap to animate
              }
             });
        });

      }else{
        leafletData.getMap("mapabase").then(function(map) {
          map.eachLayer(function (layer) {
            if (layer._leaflet_id === layerIDColor) {
              var defaultStyle = {
                color: color,
                weight: w,
                opacity: 0.6,
                fillOpacity:1.0,
                fillColor: fill
              };
              var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
              geojson=L.geoJson(json,{
                  pointToLayer: geoOperation.pointToLayer,
                  onEachFeature: function(feature, layer){
                    if(layer instanceof L.Marker) {
                        type = 'Point';
                    }else if (layer instanceof L.Polygon) {
                       type = 'Polygon';
                    }else if (layer instanceof L.Polyline) {
                       type = 'LineString';
                    }else if (layer instanceof L.Circle) {
                       type = 'Circle';
                    }
                    layer.on({
                        /*mouseover: highlightFeature,*/
                        mouseout: resetHighlight
                    });

                  },
                  style: defaultStyle
              });
              updateProjection(json,mapOptions.width,mapOptions.height);
              //name="Clas_"+$rootScope.counter+"_"+layerNameColor;
              $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
              map.invalidateSize();
              map.fitBounds(geojson.getBounds());
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

              /*angular.forEach(layer._layers, function(value, key){
                    var fillColor=$rootScope.originalColors[key];
                    var style={
                      color: $rootScope.originalColorStroke,
                      weight: $rootScope.originalStrokeValue,
                      opacity: $rootScope.originalOpacity,
                      fillOpacity:1.0,
                      fillColor: fillColor
                    };
                    layer._layers[key].setStyle(style);
              });*/
              $rootScope.counter++;
              $rootScope.colorValue='1';
              $scope.optionVal=0;
              leafletData.getMap("mapabase").then(function(map) {
                map.eachLayer(function (layer) {
                  if(layer._leaflet_id === parseInt(lastId)) {
                    angular.forEach(layer._layers, function(value, key){
                        var objson='{"stroke":"'+color+'","stroke-width":'+w+',"stroke-opacity":0.6,"fill":"'+fill+'","fill-opacity":1.0,"etiqueta":"'+tagName+'",';
                        angular.forEach(layer._layers[key].feature.properties, function(value1, key1){
                           var nValue=geoOperation.parseNumber(value1);
                            if(nValue==null){
                              if(key1!="stroke"){
                                if(key1!="stroke-width"){
                                  if(key1!="stroke-opacity"){
                                    if(key1!="fill"){
                                      if(key1!="fill-opacity"){
                                        if(key1!="etiqueta"){
                                         objson=objson+'"'+key1+'" : "'+value1+'",';
                                        }
                                      }
                                     }
                                   }
                                 }
                               }
                            }else{
                              if(key1!="stroke"){
                                if(key1!="stroke-width"){
                                  if(key1!="stroke-opacity"){
                                    if(key1!="fill"){
                                      if(key1!="fill-opacity"){
                                        if(key1!="etiqueta"){
                                         objson=objson+'"'+key1+'" : '+nValue+',';
                                        }
                                      }
                                     }
                                   }
                                 }
                               }
                            }
                         });
                         var lastChar=objson.slice(-1);
                         if(lastChar==','){
                              objson = objson.substring(0, objson.length - 1);
                         }
                         objson=objson+'}';
                         var obj = angular.fromJson(objson);
                         layer._layers[key].feature.properties=obj;
                         geoOperation.bindPopup(layer._layers[key]);
                    });
                  }
                });
              });
              $element.modal('hide');
              close(result, 500);// close, but give 500ms for bootstrap to animate
            }
          });
        });
       }
    }else{
        alert("El titulo de la capa no puede ser vacio.");
        document.getElementById("txtLayerName").style.borderColor = "red";
    }

   }catch(err){
    console.log(err);
   }
  }
  function setClasifyJenks(result){
    var mapped=[];
    var type,geojson;
    var colorStroke=$scope.colorStroke;  //Get color from input with ID=color-stroke
    var w = $scope.strokeValue;
    var layerIDColor=$scope.layerIDColor;
    var layerNameColor=$scope.layerNameColor;
    var layerNameClas=$scope.layerNameClas;
    if(layerNameClas!=""){
        name=layerNameClas;
        mapOptions.choropleth.attributeProblem = false;
        var selectedAttribute=$scope.data.colorChoropleth;
        mapOptions.choropleth.attribute=selectedAttribute;
        //console.log(selectedAttribute+"="+mapOptions.choropleth.attribute);

        var colors = colorbrewer[mapOptions.choropleth.type][mapOptions.choropleth.scaleName][mapOptions.choropleth.buckets].slice(0);

        if (mapOptions.choropleth.reverse) colors.reverse();

        leafletData.getMap("mapabase").then(function(map) {
          map.eachLayer(function (layer) {
            if(layer._leaflet_id === layerIDColor) {
               var arrLayers=layer._layers;
               var features=[];
               var attributeVal=[];
               var tableClas=[];
               angular.forEach(arrLayers, function(value, key){
                  features.push(arrLayers[key].feature);
                 try{
                   var attribute=parseNumber(arrLayers[key].feature.properties[mapOptions.choropleth.attribute]);

                   if(attribute!=null){
                     mapped.push(attribute);
                   }
                   var b = valueInArray(attributeVal,attribute);
                   if(b==false){
                     attributeVal.push({attributevalue:attribute});
                   }
                 }catch(err){

                 }
                });
                var fc = turf.featureCollection(features);

                var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));

                updateProjection(json,mapOptions.width,mapOptions.height);

                  geojson=L.geoJson(json,{
                       pointToLayer: geoOperation.pointToLayer,
                       onEachFeature: function(feature, layer){
                         if(layer instanceof L.Marker) {
                             type = 'Point';
                         }else if (layer instanceof L.Polygon) {
                            type = 'Polygon';
                         }else if (layer instanceof L.Polyline) {
                            type = 'LineString';
                         }else if (layer instanceof L.Circle) {
                            type = 'Circle';
                         }
                       }
                   });
                   var len=attributeVal.length;
                   var selectedChoroplethBucket=parseInt($scope.data.colorChoroplethBuckets);
                   if(len<selectedChoroplethBucket){
                      selectedChoroplethBucket=len;
                   }
                   var breaks = turf.jenks(fc, selectedAttribute, selectedChoroplethBucket);
                   breaks=breaks.unique();
                   breaks=cleanArray(breaks);
                   breaks.clean(undefined);
                   if(breaks.length>selectedChoroplethBucket){
                     breaks.shift();
                   }

                   console.log(breaks);

                   for(var i=0;i<breaks.length;i++){
                     tableClas.push({Class:breaks[i],Tag:breaks[i],fill:colors[i]});
                   }
                   console.log(tableClas);
                   //name="Clas "+$rootScope.counter+" - "+layerNameColor;
                   $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
                   map.invalidateSize();
                   map.fitBounds(geojson.getBounds());
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
                   $rootScope.counter++;
                   $rootScope.colorValue='1';
                   $scope.optionVal=0;
                   leafletData.getMap("mapabase").then(function(map) {
                     map.eachLayer(function (layer) {
                       if(layer._leaflet_id === parseInt(lastId)) {
                         angular.forEach(layer._layers, function(value, key){
                            var n=parseNumber(layer._layers[key].feature.properties[selectedAttribute]);
                            if(n!=null){
                              var fill=getFillColorJenks(tableClas,n);
                              var tagName=getRangeJenks(breaks,n);
                              var objson='{"stroke":"'+colorStroke+'","stroke-width":'+w+',"stroke-opacity":0.6,"fill":"'+fill+'","fill-opacity":1.0,"etiqueta":"'+tagName+'",';
                              angular.forEach(layer._layers[key].feature.properties, function(value1, key1){
                                 var nValue=geoOperation.parseNumber(value1);
                                  if(nValue==null){
                                    if(key1!="stroke"){
                                      if(key1!="stroke-width"){
                                        if(key1!="stroke-opacity"){
                                          if(key1!="fill"){
                                            if(key1!="fill-opacity"){
                                              if(key1!="etiqueta"){
                                               objson=objson+'"'+key1+'" : "'+value1+'",';
                                              }
                                            }
                                           }
                                         }
                                       }
                                     }
                                  }else{
                                    if(key1!="stroke"){
                                      if(key1!="stroke-width"){
                                        if(key1!="stroke-opacity"){
                                          if(key1!="fill"){
                                            if(key1!="fill-opacity"){
                                              if(key1!="etiqueta"){
                                               objson=objson+'"'+key1+'" : '+nValue+',';
                                              }
                                            }
                                           }
                                         }
                                       }
                                     }
                                  }
                               });
                               var lastChar=objson.slice(-1);
                               if(lastChar==','){
                                  objson = objson.substring(0, objson.length - 1);
                               }
                               //objson = objson.substring(0, objson.length - 1);
                               objson=objson+'}';
                               var obj = angular.fromJson(objson);
                               layer._layers[key].feature.properties=obj;
                               console.log(obj);
                               var style={
                                 color: colorStroke,
                                 weight: w,
                                 opacity: 0.6,
                                 fillOpacity:1.0,
                                 fillColor: fill
                               };
                               layer._layers[key].setStyle(style);
                               geoOperation.bindPopup(layer._layers[key]);
                            }
                         });
                       }
                     });
                   });
                /*angular.forEach(layer._layers, function(value, key){
                      var fillColor=$rootScope.originalColors[key];
                      var style={
                        color: $rootScope.originalColorStroke,
                        weight: $rootScope.originalStrokeValue,
                        opacity: $rootScope.originalOpacity,
                        fillOpacity:1.0,
                        fillColor: fillColor
                      };
                      layer._layers[key].setStyle(style);
                });*/
                $element.modal('hide');
                close(result, 500);// close, but give 500ms for bootstrap to animate
            }
          });
        });
     }else{
       alert("El titulo de la capa no puede ser vacio.");
       document.getElementById("txtLayerName").style.borderColor = "red";
     }
  }
  function setClasifyByRange(result){
    var mapped=[];
    var type,geojson;
    var colorStroke=$scope.colorStroke;  //Get color from input with ID=color-stroke
    var w = $scope.strokeValue;
    var layerIDColor=$scope.layerIDColor;
    var layerNameColor=$scope.layerNameColor;
    var layerNameClas=$scope.layerNameClas;
    try{
      if(layerNameClas!=""){
          var name=layerNameClas;
          mapOptions.choropleth.attributeProblem = false;
          var selectedAttribute=$scope.data.colorChoropleth;
          mapOptions.choropleth.attribute=selectedAttribute;
          //console.log(selectedAttribute+"="+mapOptions.choropleth.attribute);

          var colors = colorbrewer[mapOptions.choropleth.type][mapOptions.choropleth.scaleName][mapOptions.choropleth.buckets].slice(0);

          if (mapOptions.choropleth.reverse) colors.reverse();

          leafletData.getMap("mapabase").then(function(map) {
            map.eachLayer(function (layer) {
              if(layer._leaflet_id === layerIDColor) {
                 var arrLayers=layer._layers;
                 var features=[];
                 var attributeVal=[];
                 var tableClas=[];
                 angular.forEach(arrLayers, function(value, key){
                    features.push(arrLayers[key].feature);
                   try{
                     var attribute=parseNumber(arrLayers[key].feature.properties[mapOptions.choropleth.attribute]);

                     if(attribute!=null){
                       mapped.push(attribute);
                     }
                     var b = valueInArray(attributeVal,attribute);
                     if(b==false){
                       attributeVal.push({attributevalue:attribute});
                     }
                   }catch(err){

                   }
                  });
                  var fc = turf.featureCollection(features);

                  var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));

                  updateProjection(json,mapOptions.width,mapOptions.height);

                    geojson=L.geoJson(json,{
                         pointToLayer: geoOperation.pointToLayer,
                         onEachFeature: function(feature, layer){

                           if(layer instanceof L.Marker) {
                               type = 'Point';
                           }else if (layer instanceof L.Polygon) {
                              type = 'Polygon';
                           }else if (layer instanceof L.Polyline) {
                              type = 'LineString';
                           }else if (layer instanceof L.Circle) {
                              type = 'Circle';
                           }
                         }
                     });
                     var breaks=[];
                     var len=attributeVal.length;
                     var selectedChoroplethBucket=parseInt($scope.data.colorChoroplethBuckets);
                     if(len<selectedChoroplethBucket){
                        selectedChoroplethBucket=len;
                     }
                     var min=Math.min.apply(null, mapped);
                     var max=Math.max.apply(null, mapped);
                     //min=parseFloat(min.toFixed(10));
                     //max=parseFloat(max.toFixed(10));
                     console.log("min="+min+", max="+max);

                     var d=((max-min)/selectedChoroplethBucket);
                     //d=parseFloat(d.toFixed(10));
                     var i=min;
                     while(i<max){
                       i=i+d;
                       //i=parseFloat(i.toFixed(10));
                       //var resultado = Math.round(i*100)/100;
                       var resultado=i;
                       if(resultado<max){
                         breaks.push(resultado);
                       }

                     }
                     if(breaks.length==selectedChoroplethBucket){
                        breaks.pop();
                        breaks.push(max);
                     }
                     if(breaks.length<selectedChoroplethBucket){
                       breaks.push(max);
                     }
                     console.log(breaks);

                     for(var i=0;i<breaks.length;i++){
                         tableClas.push({Class:breaks[i],Tag:breaks[i],fill:colors[i]});
                     }
                     console.log(tableClas);
                     //name="Clas "+$rootScope.counter+" - "+layerNameColor;
                     $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
                     map.invalidateSize();
                     map.fitBounds(geojson.getBounds());
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
                     $rootScope.counter++;
                     $rootScope.colorValue='1';
                     $scope.optionVal=0;
                     leafletData.getMap("mapabase").then(function(map) {
                       map.eachLayer(function (layer) {
                         if(layer._leaflet_id === parseInt(lastId)) {
                           angular.forEach(layer._layers, function(value, key){
                              var n=parseNumber(layer._layers[key].feature.properties[selectedAttribute]);
                              if(n!=null){
                                var fill=getFillColorJenks(tableClas,n);
                                var tagName=getRangeJenks(breaks,n);
                                var objson='{"stroke":"'+colorStroke+'","stroke-width":'+w+',"stroke-opacity":0.6,"fill":"'+fill+'","fill-opacity":1.0,"etiqueta":"'+tagName+'",';
                                angular.forEach(layer._layers[key].feature.properties, function(value1, key1){
                                   var nValue=geoOperation.parseNumber(value1);
                                    if(nValue==null){
                                      if(key1!="stroke"){
                                        if(key1!="stroke-width"){
                                          if(key1!="stroke-opacity"){
                                            if(key1!="fill"){
                                              if(key1!="fill-opacity"){
                                                if(key1!="etiqueta"){
                                                 objson=objson+'"'+key1+'" : "'+value1+'",';
                                                }
                                              }
                                             }
                                           }
                                         }
                                       }
                                    }else{
                                      if(key1!="stroke"){
                                        if(key1!="stroke-width"){
                                          if(key1!="stroke-opacity"){
                                            if(key1!="fill"){
                                              if(key1!="fill-opacity"){
                                                if(key1!="etiqueta"){
                                                 objson=objson+'"'+key1+'" : '+nValue+',';
                                                }
                                              }
                                             }
                                           }
                                         }
                                       }
                                    }
                                 });
                                 var lastChar=objson.slice(-1);
                                 if(lastChar==','){
                                    objson = objson.substring(0, objson.length - 1);
                                 }
                                 //objson = objson.substring(0, objson.length - 1);
                                 objson=objson+'}';
                                 var obj = angular.fromJson(objson);
                                 layer._layers[key].feature.properties=obj;
                                 console.log(obj);
                                 var style={
                                   color: colorStroke,
                                   weight: w,
                                   opacity: 0.6,
                                   fillOpacity:1.0,
                                   fillColor: fill
                                 };
                                 layer._layers[key].setStyle(style);
                                 geoOperation.bindPopup(layer._layers[key]);
                              }
                           });

                         }
                       });
                     });
                  /*angular.forEach(layer._layers, function(value, key){
                        var fillColor=$rootScope.originalColors[key];
                        var style={
                          color: $rootScope.originalColorStroke,
                          weight: $rootScope.originalStrokeValue,
                          opacity: $rootScope.originalOpacity,
                          fillOpacity:1.0,
                          fillColor: fillColor
                        };
                        layer._layers[key].setStyle(style);
                  });*/
                  $element.modal('hide');
                  close(result, 500);// close, but give 500ms for bootstrap to animate
              }
            });
          });
       }else{
         alert("El titulo de la capa no puede ser vacio.");
         document.getElementById("txtLayerName").style.borderColor = "red";
       }
   }catch(err){}
  }
  function setClasifyByClasses(result){
    var layerNameClas=$scope.layerNameClas;
    try{
      if(layerNameClas!=""){
        var type,geojson,objson;
        var name=layerNameClas;
        var layerIDColor=$scope.layerIDColor;
        var layerNameColor=$scope.layerNameColor;
        var colorStroke=$scope.colorStroke;  //Get color from input with ID=color-stroke
        var w = $scope.strokeValue;
        if($rootScope.typeG=='Point'){
          //console.log($scope.dataInfo);

          leafletData.getMap("mapabase").then(function(map) {
            map.eachLayer(function (layer) {
              if (layer._leaflet_id === layerIDColor) {
                var selectedAttribute=$scope.attribute.name;
                var tableClas=[];
                var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                geojson=L.geoJson(json,{
                    style: function (feature) {
                      return {stroke: true, color: '#000000', weight:2, fillOpacity: 1.0};
                    },
                    onEachFeature: function(feature, layer){
                      if(layer instanceof L.Marker) {
                          type = 'Point';
                      }else if (layer instanceof L.Polygon) {
                         type = 'Polygon';
                      }else if (layer instanceof L.Polyline) {
                         type = 'LineString';
                      }else if (layer instanceof L.Circle) {
                         type = 'Circle';
                      }
                    }
                });
                $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
                map.invalidateSize();
                map.fitBounds(geojson.getBounds());
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
                $rootScope.counter++;
                $rootScope.colorValue='1';
                $scope.optionVal=0;

                leafletData.getMap("mapabase").then(function(map) {
                  map.eachLayer(function (layer) {
                    if(layer._leaflet_id === parseInt(lastId)) {
                      angular.forEach(layer._layers, function(value, key){
                         //var n=parseNumber(layer._layers[key].feature.properties[selectedAttribute]);
                         var n=layer._layers[key].feature.properties[selectedAttribute];
                         var markerTag=getMarkerTag($scope.dataInfo,n);
                         var markerColor=getMarkerColor($scope.dataInfo,n);
                         var markerSize=getMarkerSize($scope.dataInfo,n);
                         var markerIcon=getMarkerIcon($scope.dataInfo,n);
                         if(markerIcon==""){
                           markerIcon="marker";
                           mSize="m";
                           markerSize="medium";
                           markerColor="#3498db";
                         }else if(markerIcon==" "){
                           markerIcon="marker";
                           mSize="m";
                           markerSize="medium";
                           markerColor="#3498db";
                         }else if(markerIcon==null){
                           markerIcon="marker";
                           mSize="m";
                           markerSize="medium";
                           markerColor="#3498db";
                         }

                         objson='{"marker-color":"'+markerColor+'","marker-size":"'+markerSize+'","marker-symbol":"'+markerIcon+'","etiqueta":"'+markerTag+'",';

                         angular.forEach(layer._layers[key].feature.properties, function(value1, key1){
                            var nValue=geoOperation.parseNumber(value1);
                             if(nValue==null){
                               if(key1!="marker-color"){
                                 if(key1!="marker-size"){
                                   if(key1!="marker-symbol"){
                                     if(key1!="etiqueta"){
                                      objson=objson+'"'+key1+'" : "'+value1+'",';
                                     }
                                    }
                                  }
                                }
                             }else{
                               if(key1!="marker-color"){
                                 if(key1!="marker-size"){
                                   if(key1!="marker-symbol"){
                                     if(key1!="etiqueta"){
                                      objson=objson+'"'+key1+'" : '+nValue+',';
                                     }
                                    }
                                  }
                                }
                             }
                          });
                          var lastChar=objson.slice(-1);
                          if(lastChar==','){
                             objson = objson.substring(0, objson.length - 1);
                          }
                          //objson = objson.substring(0, objson.length - 1);
                          objson=objson+'}';
                          var obj = angular.fromJson(objson);
                          layer._layers[key].feature.properties=obj;
                          console.log(obj);
                          var mSize="s";
                          if(markerSize=="small"){
                             mSize="s";
                          }else if(markerSize=="medium"){
                             mSize="m";
                          }else if(markerSize=="large"){
                             mSize="l";
                          }else{
                             mSize="m";
                             markerSize="medium";
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
                          var iconURL=$rootScope.mapAPI+'pin-'+mSize+'-'+markerIcon+'+'+markerColor+'.png';
                          layer._layers[key].setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                                iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                                popupAnchor: [0, -iconSize[1] / 2]}));
                          geoOperation.bindPopup(layer._layers[key]);
                      });
                    }
                  });
                });
                map.fitBounds(geojson.getBounds());
                $element.modal('hide');
                close(result, 500);// close, but give 500ms for bootstrap to animate
                //$rootScope.dataInfo = [];
              }
            });
          });
        }else if($rootScope.typeG=='LineString'){

          leafletData.getMap("mapabase").then(function(map) {
            map.eachLayer(function (layer) {
              if (layer._leaflet_id === layerIDColor) {
                var selectedAttribute=$scope.attribute.name;
                var tableClas=[];
                var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                geojson=L.geoJson(json,{
                    style: function (feature) {
                      return {stroke: true, color: '#000000', weight:2, fillOpacity: 1.0};
                    },
                    onEachFeature: function(feature, layer){
                      if(layer instanceof L.Marker) {
                          type = 'Point';
                      }else if (layer instanceof L.Polygon) {
                         type = 'Polygon';
                      }else if (layer instanceof L.Polyline) {
                         type = 'LineString';
                      }else if (layer instanceof L.Circle) {
                         type = 'Circle';
                      }
                    }
                });
                $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
                map.invalidateSize();
                map.fitBounds(geojson.getBounds());
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
                $rootScope.counter++;
                $rootScope.colorValue='1';
                $scope.optionVal=0;

                leafletData.getMap("mapabase").then(function(map) {
                  map.eachLayer(function (layer) {
                    if(layer._leaflet_id === parseInt(lastId)) {
                      angular.forEach(layer._layers, function(value, key){
                         //var n=parseNumber(layer._layers[key].feature.properties[selectedAttribute]);
                         var n=layer._layers[key].feature.properties[selectedAttribute];
                         var tagName=getLineTag($scope.dataInfo,n);
                         var lineColor=getLineColor($scope.dataInfo,n);
                         var lineStroke=getLineStroke($scope.dataInfo,n);
                         var lineStrokeWidth=getLineStrokeWidth($scope.dataInfo,n);
                         var lineOpacity=getLineOpacity($scope.dataInfo,n);
                         if(lineColor.charAt(0)!='#'){
                            lineColor="#"+lineColor;
                         }
                         if(lineColor==""){
                           lineStroke="stroke1";
                           lineStrokeWidth=1;
                           lineColor="#000000";
                           lineOpacity=1;
                         }else if(lineColor==" "){
                           lineStroke="stroke1";
                           lineStrokeWidth=1;
                           lineColor="#000000";
                           lineOpacity=1;
                         }else if(lineColor==null){
                           lineStroke="stroke1";
                           lineStrokeWidth=1;
                           lineColor="#000000";
                           lineOpacity=1;
                         }

                         //var objson='{"stroke":"'+lineColor+'","line-stroke":"'+lineStroke+'","stroke-width":"'+lineStrokeWidth+'","etiqueta":"'+tagName+'",';
                         var objson='{"stroke":"'+lineColor+'","line-stroke":"'+lineStroke+'","stroke-width":"'+lineStrokeWidth+'","stroke-opacity":"'+lineOpacity+'","etiqueta":"'+tagName+'",';
                         angular.forEach(layer._layers[key].feature.properties, function(value1, key1){
                            var nValue=geoOperation.parseNumber(value1);
                             if(nValue==null){
                               if(key1!="stroke"){
                                 if(key1!="line-stroke"){
                                   if(key1!="stroke-width"){
                                      if(key1!="stroke-opacity"){
                                       if(key1!="etiqueta"){
                                          objson=objson+'"'+key1+'" : "'+value1+'",';
                                       }
                                      }
                                    }
                                  }
                                }
                             }else{
                               if(key1!="stroke"){
                                 if(key1!="line-stroke"){
                                   if(key1!="stroke-width"){
                                      if(key1!="stroke-opacity"){
                                         if(key1!="etiqueta"){
                                           objson=objson+'"'+key1+'" : '+nValue+',';
                                         }
                                      }
                                    }
                                  }
                                }
                             }
                          });
                          var lastChar=objson.slice(-1);
                          if(lastChar==','){
                             objson = objson.substring(0, objson.length - 1);
                          }
                          //objson = objson.substring(0, objson.length - 1);
                          objson=objson+'}';
                          var obj = angular.fromJson(objson);
                          layer._layers[key].feature.properties=obj;
                          console.log(obj);
                          if(lineColor.charAt(0)!='#'){
                             lineColor="#"+lineColor;
                          }
                          setStyleLine('opacity', lineOpacity, layer._layers[key]);
                          setStyleLine('color', lineColor, layer._layers[key]);
                          setStyleLine('weight', lineStrokeWidth, layer._layers[key]);
                          //Set type of line
                          if(lineStroke=='stroke1'){
                           setStyleLine('dashArray', '1', layer._layers[key]);
                          }else if(lineStroke=='stroke2'){
                           setStyleLine('dashArray', '10,10', layer._layers[key]);
                          }else if(lineStroke=='stroke3'){
                           setStyleLine('dashArray', '15, 10, 1, 10', layer._layers[key]);
                          }
                          geoOperation.bindPopup(layer._layers[key]);
                      });
                    }
                  });
                });
                map.fitBounds(geojson.getBounds());
                $element.modal('hide');
                close(result, 500);// close, but give 500ms for bootstrap to animate
                //$rootScope.dataInfo = [];
              }
            });
          });

        }else{

          /*console.log(arrChoroplet);
          console.log(arrTags);*/
          leafletData.getMap("mapabase").then(function(map) {
            map.eachLayer(function (layer) {
              if (layer._leaflet_id === layerIDColor) {
                var selectedAttribute=$scope.attribute.name;
                var tableClas=[];
                var breaks=[];
                var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                geojson=L.geoJson(json,{
                    pointToLayer: geoOperation.pointToLayer,
                    onEachFeature: function(feature, layer){
                      if(layer instanceof L.Marker) {
                          type = 'Point';
                      }else if (layer instanceof L.Polygon) {
                         type = 'Polygon';
                      }else if (layer instanceof L.Polyline) {
                         type = 'LineString';
                      }else if (layer instanceof L.Circle) {
                         type = 'Circle';
                      }
                    }
                });
                for(var i=0;i<arrChoroplet.length;i++){
                  console.log(arrChoroplet[i]);
                  tableClas.push({Class:arrTags[i],Tag:arrTags[i],fill:arrChoroplet[i]});
                }
                /*angular.forEach(arrChoroplet, function(value, key){

                  breaks.push(key);
                });*/

                console.log(tableClas);
                $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
                map.invalidateSize();
                map.fitBounds(geojson.getBounds());
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
                $rootScope.counter++;
                $rootScope.colorValue='1';
                $scope.optionVal=0;

                leafletData.getMap("mapabase").then(function(map) {
                  map.eachLayer(function (layer) {
                    if(layer._leaflet_id === parseInt(lastId)) {
                      angular.forEach(layer._layers, function(value, key){
                         //var n=parseNumber(layer._layers[key].feature.properties[selectedAttribute]);
                         var n=layer._layers[key].feature.properties[selectedAttribute];
                         //if(n!=null){
                           var fill=getFillColor(tableClas,n);
                           var tagName=getRange(arrTags,n);
                           var objson='{"stroke":"'+colorStroke+'","stroke-width":'+w+',"stroke-opacity":0.6,"fill":"'+fill+'","fill-opacity":1.0,"etiqueta":"'+tagName+'",';
                           angular.forEach(layer._layers[key].feature.properties, function(value1, key1){
                              var nValue=geoOperation.parseNumber(value1);
                               if(nValue==null){
                                 if(key1!="stroke"){
                                   if(key1!="stroke-width"){
                                     if(key1!="stroke-opacity"){
                                       if(key1!="fill"){
                                         if(key1!="fill-opacity"){
                                           if(key1!="etiqueta"){
                                            objson=objson+'"'+key1+'" : "'+value1+'",';
                                           }
                                         }
                                        }
                                      }
                                    }
                                  }
                               }else{
                                 if(key1!="stroke"){
                                   if(key1!="stroke-width"){
                                     if(key1!="stroke-opacity"){
                                       if(key1!="fill"){
                                         if(key1!="fill-opacity"){
                                           if(key1!="etiqueta"){
                                            objson=objson+'"'+key1+'" : '+nValue+',';
                                           }
                                         }
                                        }
                                      }
                                    }
                                  }
                               }
                            });
                            var lastChar=objson.slice(-1);
                            if(lastChar==','){
                               objson = objson.substring(0, objson.length - 1);
                            }
                            //objson = objson.substring(0, objson.length - 1);
                            objson=objson+'}';
                            var obj = angular.fromJson(objson);
                            layer._layers[key].feature.properties=obj;
                            console.log(obj);
                            var style={
                              color: colorStroke,
                              weight: w,
                              opacity: 0.6,
                              fillOpacity:1.0,
                              fillColor: fill
                            };
                            layer._layers[key].setStyle(style);
                            geoOperation.bindPopup(layer._layers[key]);
                         //}
                      });

                    }
                  });
                });
                $element.modal('hide');
                close(result, 500);// close, but give 500ms for bootstrap to animate
              }
            });
          });
        }
      }else{
          alert("El titulo de la capa no puede ser vacio.");
          document.getElementById("txtLayerName").style.borderColor = "red";
      }
   }catch(err){}
  }
  function setStyleLine(option, value, l) {
        var newStyle = {};
        newStyle[option] = value;
        l.setStyle(newStyle);
  }
  function getRangeJenks(breaks,val){
    var str;
    for (var i = 0; i < breaks.length; i++) {
        if(val<=breaks[i]){
          if(isInteger(breaks[i])==false){
           str="<="+breaks[i].toFixed(4);
          }else{
           str="<="+breaks[i];
          }
           break;
        }
    }
    return str;
  }
  function getFillColorJenks(tableClas,val){
    var str;
    for(var i=0;i<tableClas.length;i++){
       if(val<=tableClas[i]['Class']){
         str=tableClas[i]['fill'];
         break;
       }
    }
    return str;
  }
  function getRange(breaks,val){
    var str;
    for (var i = 0; i < breaks.length; i++) {
        if(String(val)==String(breaks[i])){
            str="="+breaks[i];
            break;
        }
    }
    return str;
  }
  function getFillColor(tableClas,val){
    var str;
    for(var i=0;i<tableClas.length;i++){
       if(String(val)==String(tableClas[i]['Class'])){
         str=tableClas[i]['fill'];
         break;
       }
    }
    return str;
  }
  //Returns marker tag
  function getMarkerTag(tableClas,val){
    var str;
    for(var i=0;i<tableClas.length;i++){
       if(String(val)==String(tableClas[i]['Clase'])){
         str="="+tableClas[i]['Etiqueta'];
         break;
       }
    }
    return str;
  }
  //Returns marker color
  function getMarkerColor(tableClas,val){
    var str;
    for(var i=0;i<tableClas.length;i++){
       if(String(val)==String(tableClas[i]['Clase'])){
         str=tableClas[i]['MarkerColor'];
         break;
       }
    }
    return str;
  }
  //Returns marker icon
  function getMarkerIcon(tableClas,val){
    var str;
    for(var i=0;i<tableClas.length;i++){
       if(String(val)==String(tableClas[i]['Clase'])){
         str=tableClas[i]['MarkerIcon'];
         break;
       }
    }
    return str;
  }
  //Returns marker size
  function getMarkerSize(tableClas,val){
    var str;
    for(var i=0;i<tableClas.length;i++){
       if(String(val)==String(tableClas[i]['Clase'])){
         str=tableClas[i]['MarkerSize'];
         break;
       }
    }
    return str;
  }
  //Returns line tag
  function getLineTag(tableClas,val){
    var str;
    for(var i=0;i<tableClas.length;i++){
       if(String(val)==String(tableClas[i]['Clase'])){
         str="="+tableClas[i]['Etiqueta'];
         break;
       }
    }
    return str;
  }

  //Returns line color
  function getLineColor(tableClas,val){
    var str;
    for(var i=0;i<tableClas.length;i++){
       if(String(val)==String(tableClas[i]['Clase'])){
         str=tableClas[i]['Stroke'];
         break;
       }
    }
    return str;
  }
  //Returns line stroke
  function getLineStroke(tableClas,val){
    var str;
    for(var i=0;i<tableClas.length;i++){
       if(String(val)==String(tableClas[i]['Clase'])){
         str=tableClas[i]['LineStroke'];
         break;
       }
    }
    return str;
  }
  //Returns line stroke width
  function getLineStrokeWidth(tableClas,val){
    var str;
    for(var i=0;i<tableClas.length;i++){
       if(String(val)==String(tableClas[i]['Clase'])){
         str=tableClas[i]['LineStrokeWidth'];
         break;
       }
    }
    return str;
  }
  //Returns line opacity
  function getLineOpacity(tableClas,val){
    var str;
    for(var i=0;i<tableClas.length;i++){
       if(String(val)==String(tableClas[i]['Clase'])){
         str=tableClas[i]['LineOpacity'];
         break;
       }
    }
    return str;
  }
  function isInteger(numero){
    var b=false;
    if (numero % 1 == 0) {
        b=true;
    }
    else{
        b=false;
    }
    return b;
  }

  function cleanArray(actual){
    var newArray = new Array();
    for( var i = 0, j = actual.length; i < j; i++ ){
        if ( actual[ i ] ){
          newArray.push( actual[ i ] );
      }
    }
    return newArray;
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
  function fStyle(feature) {
    //console.log("feauture="+feature);
    var color;
    var colorStroke=$scope.colorStroke;  //Get color from input with ID=color-stroke
    var w = $scope.strokeValue;
    try{
      var num=parseNumber(feature.properties[mapOptions.choropleth.attribute]);
      //console.log("original color="+arrLayers[key].options.fillColor);
      if(num!=null){
        color=mapOptions.choropleth.scale(num);
        return {
          color: colorStroke,
          weight: w,
          opacity: 0.6,
          fillOpacity:1.0,
          fillColor: color
        };
      }else{
        color=mapOptions.choropleth.default;
        return {
          color: colorStroke,
          weight: w,
          opacity: 0.6,
          fillOpacity:1.0,
          fillColor: color
        };
      }
    }catch(err){
    }
  }
  function parseNumber(val) {
    if (typeof val == "number") {
      return val;
    }

    if (typeof val == "string") {
      val = val.replace(/(\s|,)/g,'');

      if (val.match(/^-?[0-9]*[.]?[0-9]+$/)) return parseFloat(val);

      return null;
    }

    return null;
  }
  function updateProjection(data,width,height) {
      //Projection at unit scale
      mapOptions.projection = d3.geo[mapOptions.projectionType]()
          .scale(1)
          .translate([0, 0]);

      //Path generator
      mapOptions.path = d3.geo.path()
          .projection(mapOptions.projection);

      //Use min/max lat of data as parallels for conicEqualArea
      //Rotate around lng of the data centroid
      if ("parallels" in mapOptions.projection) {

        var c = d3.geo.centroid(data);

        rotation = [(c[0] < 0) ? Math.abs(c[0]) : (360-c[0]) % 360,0];

        var bounds = d3.geo.bounds(data);
        mapOptions.projection.center(c)
          .parallels([bounds[0][1],bounds[1][1]])
          .rotate(rotation);
      }

      //Find the max scale based on data bounds at unit scale, with 5% padding
      var b = mapOptions.path.bounds(data),
          s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
          t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];


      mapOptions.projection.scale(s);

      if ("parallels" in mapOptions.projection) {

        mapOptions.projection.translate(t);

      } else {

        if ("center" in mapOptions.projection) {

          //Infer the true map center from the pixels, reset the projection to have simple center/translate for code readability
          mapOptions.projection.translate([0,0]);

          var inv = mapOptions.projection.invert([width/2 - t[0], height/2 - t[1]]);

          mapOptions.projection.center(inv);

        } else {

          //It's a fixed proj like albersUsa, just scale it
          mapOptions.projection = d3.geo[mapOptions.projectionType]()
            .scale(s);

        }

        //Can't do this with conic because of discrepancy between centroid and simple center
        //(middle x, middle y not same as weighted centroid unless it's a perfectly regular shape)
        mapOptions.projection.translate([width/2,height/2]);

        mapOptions.path = d3.geo.path()
          .projection(mapOptions.projection);

      }
   }

 }
 })();
