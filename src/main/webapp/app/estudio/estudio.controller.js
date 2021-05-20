(function() {
  'use strict';

  angular
  .module('smallgisApp')
  .controller('estudioController', estudioController);

  estudioController.$inject = ['$state','$scope', '$sce',  'leafletData', '$mdDialog', '$timeout', '$mdSidenav','$http', 'geoOperation', 'ModalService','$rootScope', 'Auth','User','Requirement', 'Track','Auxtrack', 'Cost', 'Cost1','JhiLanguageService', '$translate','Capa','Mapa','Aplicacion','Principal','$cookies','$localStorage', '$sessionStorage','$mdDialog'];

  function estudioController($state, $scope, $sce, leafletData, $mdDialog, $timeout, $mdSidenav, $http, geoOperation, ModalService, $rootScope,  Auth, User, Requirement, Track, Auxtrack, Cost, Cost1, JhiLanguageService, $translate, Capa, Mapa, Aplicacion, Principal, $cookies, $localStorage, $sessionStorage, $mdIconProvider,$DialogController, $stateProvider) {
    var zCont=1;
    var vm = this;

    //vm.changePassword = changePassword;
    vm.save = save;
    vm.changeCost = changeCost;
    vm.settingsAccount = {};
    vm.settingsCost = {};
    vm.doNotMatch = null;
    vm.error = null;
    vm.success = null;
    vm.error1 = null;
    vm.success1 = null;
    //$scope.chkbusiness=false;
    $scope.ismeasurectrladded=false;
    $rootScope.isLayerEditing=false;
    $rootScope.isdrawctrladded=false;
    $rootScope.drawLine=false;
    $rootScope.drawPoint=false;
    $rootScope.drawPoint2=false;
    $rootScope.flag=0;
    $rootScope.downloadId=0;
    $rootScope.drawCtrl;
    $rootScope.drawLineCtrl;
    $rootScope.drawCtrlEdit;
    $rootScope.drawPointCtrl;
    $rootScope.drawPointCtrl2;
    $rootScope.drawnPointItems;
    $rootScope.drawnPointItems2;
    $rootScope.editReqId;

    var filecsv;
    var tableColsName;
    var tableRows;
    var gjl;
    var drawnLineItems;

    var labels;
    var elevationControl;
    var printProvider,printControl;
    var measureControl;
    var drawControl;
    var legendControl;
    var routeControl;
    $rootScope.routes=[];

    var arrReqPts=[];
    var auxReq1=[];
    var bandera=false;
    var geocoder = new google.maps.Geocoder();
    var markerAddress;//Pickup marker
    var markerAddressDest;//Delivery marker
    var coords_1 = [];
    var fts = [];//Feature to simplify the layer
    var arrHeatPoints=[];//Array of heat points
    var arrHeatLayers=[];//Array of heat layer points
    var arrClusterPoints=[];//Array of cluster points
    var heatCtrlIsAdded=false;//Indicates if heat ctrl is on/off
    var clusterCtrlIsAdded=false;//Indicates if cluster is on/off
    var tableLayoutIsOpen=false;//Indicates if the tableLayoutIsOpen (open=true,close=false)
    var isUpdating=false;
    var isUpdatingMap=false;
    var isUpdatingApp=false;
    var isAppPublic=false;
    var heatmapInstances = {};
    var intval;
    var assignInterval;
    var routeId;
    $scope.isRouteTraced=false;
    $scope.seltypeapp="basic";
    $rootScope.username="";
    $rootScope.company="";
    $rootScope.mail="";
    $rootScope.h=0;
    $rootScope.clu=0;
    $scope.layerId=0;
    $scope.campoName="";
    $scope.layerName="";
    $scope.isCheckedSimplify=false;
    $scope.devicesVisible=false;
    var tolerance=0.1;
    $scope.selectedLayerName="";
    $rootScope.originalColorStroke;
    $rootScope.originalStrokeValue;
    $rootScope.originalOpacity;
    $rootScope.originalColors=[];
    $rootScope.layerId;
    $rootScope.mapId;
    $rootScope.m;
    $rootScope.appId;
    $rootScope.currentMapId;//Current map id to print (directive printmap)
    $rootScope.counter=1;
    $rootScope.position = 1;
    $rootScope.currentPos = 1;
    $rootScope.islegendctrladded=false;
    $rootScope.isroutectrladded=false;
    $rootScope.routeCtrl;
    $rootScope.simplifyId=0;
    $rootScope.editingLayerId;
    $rootScope.currentLayerId=0;
    $rootScope.legendControl=L.control({position: 'topright'});
    $rootScope.mapAPI='http://api.tiles.mapbox.com/v3/marker/';
    var iconS = [20, 50];
    var icon1 = L.icon({
          iconUrl: 'http://api.tiles.mapbox.com/v3/marker/pin-m-star+00FF00.png',
          iconSize: iconS,
          iconAnchor: [iconS[0] / 2, iconS[1] / 2],
          popupAnchor: [0, -iconS[1] / 2]
    });
    var icon2 = L.icon({
         iconUrl: 'http://api.tiles.mapbox.com/v3/marker/pin-m-star+FF0000.png',
         iconSize: iconS,
         iconAnchor: [iconS[0] / 2, iconS[1] / 2],
         popupAnchor: [0, -iconS[1] / 2]
    });

    $rootScope.host="https://smallgis.herokuapp.com";
    //$rootScope.host="http://localhost:9000";
    var objArr;
    var layerSelectedID;
    var layerIDs="";
    var map_img = 'content/images/mapa.svg';
    var linea_img = 'content/images/line.svg';
    var poligono_img = 'content/images/poligono.svg';
    var punto_img = 'content/images/punto.svg';
    var fcollection_img = 'content/images/fcollection.svg';
    var smartphone_img='content/images/smartphone.svg';
    var realtime;
    var trackLayer;
    var zoom=true;
    var isOriginAdded=false;

    var elem1 = document.getElementById('business');
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
   $rootScope.drawCurrentPosition= L.easyButton( '<img src="content/images/ubicarme.svg" height=20 width=20>', function(){
     showCurrentPosition();
   });
   $rootScope.geoCodingCrtl=L.easyButton( '<img src="content/images/search.svg" height=20 width=20>', function(){
      geoCodeAddress();
   });
   //Hide draw point requirement control
   $rootScope.exitPointBtn= L.easyButton( '<img src="content/images/exit.svg" height=20 width=20>', function(){
     closePointCtrl();
   });
    //Hide draw line terrain control
    $rootScope.exitLineBtn= L.easyButton( '<img src="content/images/exit.svg" height=20 width=20>', function(){
      closeLineCtrl();
    });
    //Hide draw tools control
    $rootScope.exitDrawBtn= L.easyButton( '<img src="content/images/exit.svg" height=20 width=20>', function(){
      closeDrawCtrl();
    });
    //Hide edit tools control
    $rootScope.exitEditBtn= L.easyButton('<img src="content/images/exit.svg" height=20 width=20>', function(){
      closeEditCtrl();
    });
    $scope.ddlvalue=0;
    $scope.dataTable;
    $scope.dataColum;
    $scope.dataInfo =[];
    $scope.columnInfo=[];
    $scope.selectTableColumn=[];
    $scope.nombreCapa="";

    //Tabla1 de atributos
    $scope.gridOptions = {
      columnDefs: [
        { name:'info',field: 'info'}
      ],
      data: 'dataInfo',
      enableColumnResizing: true,
      enableGridMenu: true,
      enableSelectAll: true,
      exporterCsvFilename: 'tabla.csv',
      exporterPdfDefaultStyle: {fontSize: 9},
      exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
      exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
      exporterPdfHeader: { text: "SmallGIS Tabla de Atributos", style: 'headerStyle' },
      exporterPdfFooter: function ( currentPage, pageCount ) {
        return { text: currentPage.toString() + ' de ' + pageCount.toString(), style: 'footerStyle' };
      },
      exporterPdfCustomFormatter: function ( docDefinition ) {
        docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
        docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
        return docDefinition;
      },
      exporterPdfOrientation: 'portrait',
      exporterPdfPageSize: 'LETTER',
      exporterPdfMaxGridWidth: 500,
      exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location"))
    };
    $scope.gridUsersOptions = {
           enableColumnResizing: true,
           data: 'dataUsers',
           enableSorting: true,
           columnDefs: [{name:'Nombre',field:'Nombre',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false},
                        {name:'Usuario',field:'Usuario',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false},
                        {name:'Email',field:'Email',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false},
                        {name:'Empresa',field:'Empresa',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false},
                        {name:'isActive', field:'isActive', displayName: 'Activo', type: 'boolean',cellTemplate: '<input type="checkbox" ng-model="row.entity.isActive" ng-click="grid.appScope.enableUser(row.entity.Usuario,row.entity.isActive)">'}]
    };
    $scope.showSection=false;//Show/hide manage users m-tab
    $scope.showTrackSection=false;//Show/hide track analysis section

    $scope.dataUsers=[];//dataUsers array by company to fill the users grid

    var div = L.DomUtil.create('div', 'info legend');

    $( "#dialog" ).dialog({
      autoOpen: false,
      resizable: false,
      height:180,
      modal: true,
      buttons: {
        "Si": function() {
          showDrawCtrlB(1);
          $( this ).dialog( "close" );
        },
        "No": function() {
          showDrawCtrlB(0);
          $( this ).dialog( "close" );
        }
      }
    });
    $( "#dialog-csv" ).dialog({
      autoOpen: false,
      resizable: false,
      height:240,
      modal: true,
      buttons: {
        "Aceptar": function() {
          uploadCSV();
          $( this ).dialog( "close" );
        },
        "Cancelar": function(){
          $( this ).dialog( "close" );
          leafletData.getMap("mapabase").then(function(map) {
            map.spin(false);
          });
        }
      }
    });
    $( "#dialog-logout" ).dialog({
      autoOpen: false,
      resizable: false,
      height:180,
      modal: true,
      buttons: {
        "Si": function() {
          exitApp();
          $( this ).dialog( "close" );
        },
        "No": function() {
          $( this ).dialog( "close" );
        }
      }
    });
    $( "#dialog-rmcol" ).dialog({
      autoOpen: false,
      resizable: false,
      height:190,
      modal: true,
      buttons: {
        "Borrar": function() {
          var val= $("#columnValue").val();
          removeColumn(val);
          $( this ).dialog( "close" );
        },
        "Cancelar": function() {
          $( this ).dialog( "close" );
        }
      }
    });
    $("#dialog-updatelayer" ).dialog({
      autoOpen: false,
      resizable: false,
      height:250,
      modal: true,
      buttons: {
        "Si": function() {
          var layerName=$("#layerName").val();
          var layerId=$("#layerId").val();
          var layerDes=$("#layerDes").val();
          updateLayer(layerId,layerName,layerDes);
          $( this ).dialog( "close" );
        },
        "No": function() {
          $( this ).dialog( "close" );
        }
      }
    });
    $( "#dialog-rmlayers" ).dialog({
      autoOpen: false,
      resizable: false,
      height:190,
      modal: true,
      buttons: {
        "Borrar": function() {
          removeLayersFromCloud();
          $( this ).dialog( "close" );
        },
        "Cancelar": function() {
          $( this ).dialog( "close" );
        }
      }
    });
    $( "#dialog-addlayers" ).dialog({
      autoOpen: false,
      resizable: false,
      height:180,
      modal: true,
      buttons: {
        "Agregar": function() {
          addLayersFromCloud();
          $( this ).dialog( "close" );
        },
        "Cancelar": function() {
          $( this ).dialog( "close" );
        }
      }
    });
    $( "#dialog-addreqlayers" ).dialog({
      autoOpen: false,
      resizable: false,
      height:180,
      modal: true,
      buttons: {
        "Agregar": function() {
          //Add requeriment layers from cloud
          addReqLayersFromCloud();
          $( this ).dialog( "close" );
        },
        "Cancelar": function() {
          $( this ).dialog( "close" );
        }
      }
    });
    $( "#dialog-savelayer" ).dialog({
      autoOpen: false,
      resizable: false,
      height:250,
      modal: true,
      buttons: {
        "Guardar": function() {
          var layerName=$("#layername").val();
          var layerId=$("#layerid").val();
          var layerDes=$("#layer_des").val();
          //alert(layerName+" "+layerId);
          saveLayerToCloud(layerId,layerName,layerDes);
          $( this ).dialog( "close" );
        },
        "Cancelar": function() {
          $( this ).dialog( "close" );
        }
      }
    });
    $("#dialog-savemap" ).dialog({
      autoOpen: false,
      resizable: false,
      height:320,
      modal: true,
      buttons: {
        "Aceptar": function() {
          var mapTitle=$("#map_title").val();
          var mapDes=$("#map_des").val();
          saveMapToCloud(mapTitle,mapDes);
          //$( this ).dialog( "close" );
        }
      }
    });
    $("#dialog-saveapp" ).dialog({
      autoOpen: false,
      resizable: false,
      height:330,
      modal: true,
      buttons: {
        "Aceptar": function() {
          var appTitle=$("#app_title").val();
          var appDes=$("#app_des").val();
          var mapId=$("#mapid").val();
          saveAppToCloud(mapId,appTitle,appDes);
          //$( this ).dialog( "close" );
        }
      }
    });
    $( "#dialog-removemap" ).dialog({
      autoOpen: false,
      resizable: false,
      height:190,
      modal: true,
      buttons: {
        "Borrar": function() {
          removeMapFromCloud();
          $( this ).dialog( "close" );
        },
        "Cancelar": function() {
          $( this ).dialog( "close" );
        }
      }
    });
    $( "#dialog-removeapp" ).dialog({
      autoOpen: false,
      resizable: false,
      height:190,
      modal: true,
      buttons: {
        "Borrar": function() {
          removeAppFromCloud();
          $( this ).dialog( "close" );
        },
        "Cancelar": function() {
          $( this ).dialog( "close" );
        }
      }
    });
    $("#dialog-addmap" ).dialog({
      autoOpen: false,
      resizable: false,
      height:180,
      modal: true,
      buttons: {
        "Agregar": function() {
          addMapFromCloud();
          $( this ).dialog( "close" );
        },
        "Cancelar": function() {
          $( this ).dialog( "close" );
        }
      }
    });
    $("#dialog-createapp" ).dialog({
      autoOpen: false,
      resizable: false,
      height:180,
      modal: true,
      buttons: {
        "Agregar": function() {
          createApp();
          $( this ).dialog( "close" );
        },
        "Cancelar": function() {
          $( this ).dialog( "close" );
        }
      }
    });
    $("#dialog-shareapp" ).dialog({
      autoOpen: false,
      resizable: false,
      height:150,
      modal: true,
      buttons: {
      }
    });
    angular.extend($scope, {

      center: {
        autoDiscover: true
      },
      controls: {
        custom : [],
        scale: true
      },//end controls
      defaults: {
        scrollWheelZoom: false
      },

      layers: {
        baselayers: {
          BaseClara: {
            name: 'Base clara',
            url: 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}',
            type: 'xyz',
            layerOptions: {
              ext: 'png',
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            },
            layerParams: {
              showOnSelector: false
            }
          },  BaseNegra: {
            name: 'Base Oscura',
            url: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            type: 'xyz',
            layerOptions: {
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            },
            layerParams: {
              showOnSelector: false
            }
          },

          BaseGris: {
            name: 'Base Gris',
            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            type: 'xyz',
            layerOptions: {
              attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
            },
            layerParams: {
              showOnSelector: false
            }
          },
          Satelite: {
            name: 'Satelite',

            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            type: 'xyz',
            layerOptions: {
              attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            },
            layerParams: {
              showOnSelector: false
            }
          },
          Topografico: {
            name: 'Topografico',

            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            type: 'xyz',
            layerOptions: {
              attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            },
            layerParams: {
              showOnSelector: false
            }
          },
          Relieve: {
            name: 'Relieve',

            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
            type: 'xyz',
            layerOptions: {
              attribution: 'Tiles &copy; Esri &mdash; Source: Esri'
            },
            layerParams: {
              showOnSelector: false
            }
          },
          Vias: {
            name: 'Vías',

            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
            type: 'xyz',
            layerOptions: {
              apikey: 'pk.eyJ1IjoianVhbm1hMTAwIiwiYSI6ImNpaG5za3VqNTBwM3R2YmtsdGpwbWg3c3EifQ.Vx2cR_oz3FtQ4DtIwImdWg',
              mapid: 'mapbox.streets'
            },
            layerParams: {
              showOnSelector: false
            }
          }
        }
      },
      overlays: {}
    });
    var cfg = {
      // radius should be small ONLY if scaleRadius is true (or small radius is intended)
      "radius": 100,
      "maxOpacity": .8,
      // scales the radius based on map zoom
      "scaleRadius":false,
      // if set to false the heatmap uses the global maximum for colorization
      // if activated: uses the data maximum within the current map boundaries
      //   (there will always be a red spot with useLocalExtremas true)
      "useLocalExtrema": true,
      // which field name in your data represents the latitude - default "lat"
      latField: 'lat',
      // which field name in your data represents the longitude - default "lng"
      lngField: 'lng',
      // which field name in your data represents the data value - default "value"
      valueField: 'count'
    };
    getAccount();
    //var heatmapLayer = new HeatmapOverlay(cfg);
    leafletData.getLayers().then(function(baselayers) {
      //console.log(baselayers.overlays.search);
      angular.extend($scope.controls, {
        search: {
          layer: baselayers.overlays.search
        }
      });
    });

    leafletData.getMap("mapabase").then(function(map) {
      //map.removeControl(map.zoomControl);

      var measureControl = new L.Control.Measure({
        position: 'topleft',
        localization: 'es',
        primaryAreaUnit: 'sqmeters',
        secondaryAreaUnit: 'hectares',
        primaryLengthUnit: 'kilometers',
        secondaryLengthUnit: 'meters',
        activeColor: '#FF9900',
        completedColor: '#FF9900'
      });

      measureControl.addTo(map);
      $rootScope.m=map;

    });
    $timeout(function() {
      leafletData.getMap("mapabase").then(function(map) {
        map.invalidateSize();
      });
    },5000);

    /*Configuration angular-awesome-slider directiva*/
    $scope.valueini = "0";
    $scope.optionSlider = {
      from: 0,
      to: 100,
      step: 1,
      dimension: " %",
      css: {
        background: {"background-color": "silver"},
        before: {"background-color": "orange"},
        default: {"background-color": "gray"},
        after: {"background-color": "orange"},
        pointer: {"background-color": "orange"}
      }
    };
    $scope.valueini1 = "0";
    $scope.optionSlider1 = {
      from: 1,
      to: 80,
      step: 1,
      dimension: " Dist",
      css: {
        background: {"background-color": "silver"},
        before: {"background-color": "orange"},
        default: {"background-color": "gray"},
        after: {"background-color": "orange"},
        pointer: {"background-color": "orange"}
      }
    };
    $scope.valueini1 = "0";
    $scope.optionSlider1 = {
      from: 1,
      to: 80,
      step: 1,
      dimension: " km",
      css: {
        background: {"background-color": "silver"},
        before: {"background-color": "orange"},
        default: {"background-color": "gray"},
        after: {"background-color": "orange"},
        pointer: {"background-color": "orange"}
      }
    };
    $scope.valueini2 = "0";
    $scope.optionSlider2 = {
      from: 1,
      to: 80,
      step: 1,
      dimension: " km",
      css: {
        background: {"background-color": "silver"},
        before: {"background-color": "orange"},
        default: {"background-color": "gray"},
        after: {"background-color": "orange"},
        pointer: {"background-color": "orange"}
      }
    };
    $scope.valueinisimplify = "0";
    $scope.optionSliderSimplify = {
      from: 0,
      to: 100,
      step: 1,
      dimension: "%",
      css: {
        background: {"background-color": "silver"},
        before: {"background-color": "orange"},
        default: {"background-color": "gray"},
        after: {"background-color": "orange"},
        pointer: {"background-color": "orange"}
      }
    };

    /*Opciones colorpicker*/
    $scope.colorOptions = {
      size: 22,
      roundCorners: true
    }
    $scope.optionsGradient = {
      start: '#BA693E',
      size:22,
      count: 10,
      step: 1,
      roundCorners:true
    }
    $scope.colorfondo = "#fff";
    $scope.colorborde = "#fff";
    /*Opciones Menú circular -*/
    $scope.options = {
      isOpen: false,
      toggleOnClick: true,
      background: 'black',
      color: 'white',
      size: 'normal',
      button: {
        content: 'Menu',
        cssClass: 'fa fa-bars',
        background: 'black',
        color: 'white',
        size: 'normal'
      },
      items: [{
        content: 'prueba',
        cssClass: 'fa fa-map',
        onclick: $scope.switchAxis
      }, {
        cssClass: 'fa fa-upload',
        onclick: $scope.switchAxis
      }, {
        cssClass: 'fa fa-pencil-square-o',
        onclick: $scope.switchType
      }, {
        cssClass: 'fa fa-link',
        onclick: $scope.switchType
      }, {
        cssClass: 'fa fa-globe',
        onclick: $scope.switchType
      }, {
        cssClass: 'fa fa-location-arrow',
        onclick: $scope.switchType
      }, {
        cssClass: 'fa fa-th-large',
        onclick: $scope.switchType
      }, {
        cssClass: 'fa fa-list-ol',
        onclick: $scope.switchColor
      }, {
        cssClass: 'fa fa-search',
        onclick: $scope.switchColor
      }, {
        cssClass: 'fa fa-area-chart',
        onclick: $scope.switchColor
      }, {
        cssClass: 'fa fa-road',
        onclick: $scope.switchColor
      }]
    };

    $scope.islocked=false;
    $scope.isOpen=false;
    var auxId;
    $scope.toggleNav = function() {
      if($mdSidenav('left1').isOpen()){
        $scope.isOpen=false;
      }else{
        $scope.isOpen=true;
      }
      if($mdSidenav('left1').isLockedOpen()){
        $scope.islocked=false;
      }else{
        $scope.islocked=true;
      }
      $mdSidenav('left1').toggle();
    };

    $scope.islocked2=false;
    $scope.isOpen2=false;
    $scope.toggleNav2 = function(id) {
      $rootScope.layerId=parseInt(id);
      if($mdSidenav('left2').isOpen()){
        $scope.isOpen2=false;
      }else{
        $scope.isOpen2=true;
      }
      if($mdSidenav('left2').isLockedOpen()){
        $scope.islocked2=false;
        if(auxId!=null){
          var y=document.getElementById(auxId);
          if (y.classList) {
            y.classList.remove("listitemselect");
          }
        }
      }else{
        $scope.islocked2=true;
        if(auxId!=id){
          if(auxId!=null){
            var y=document.getElementById(auxId);
            if (y.classList) {
              y.classList.remove("listitemselect");
            }
          }
          auxId=id;
        }
        var x=document.getElementById(id);

        x.classList.add("listitemselect");
      }
      $mdSidenav('left2').toggle();

    };

    $scope.islocked3=false;
    $scope.isOpen3=false;
    $scope.toggleNav3 = function() {
      if($mdSidenav('left3').isOpen()){
        $scope.isOpen3=false;
      }else{
        $scope.isOpen3=true;
      }
      if($mdSidenav('left3').isLockedOpen()){
        $scope.islocked3=false;
      }else{
        $scope.islocked3=true;
      }
      $mdSidenav('left3').toggle();
    };

    $scope.islocked4=false;
    $scope.isOpen4=false;
    $scope.toggleNav4 = function() {
      if($mdSidenav('left4').isOpen()){
        $scope.isOpen4=false;
      }else{
        $scope.isOpen4=true;
      }
      if($mdSidenav('left4').isLockedOpen()){
        $scope.islocked4=false;
      }else{
        $scope.islocked4=true;
      }
      $mdSidenav('left4').toggle();
    };

    $scope.toggleNav5 = function() {
      $mdSidenav('left5').toggle();}

      $scope.toggleNav6 = function() {
        $mdSidenav('left6').toggle();}

        $scope.toggleNav7 = function() {
          if($mdSidenav('left7').isOpen()){

          }else{
            $rootScope.$broadcast('statistics');//Invoke function $scope.$on('statistics') in statistics.controller.js
          }

          $mdSidenav('left7').toggle();

        }

        $scope.islocked8=false;
        $scope.isOpen8=false;
        $scope.toggleNav8 = function() {
          if($mdSidenav('left8').isOpen()){
            $scope.isOpen8=false;
          }else{

            $scope.isOpen8=true;
          }
          if($mdSidenav('left8').isLockedOpen()){
            $scope.islocked8=false;
          }else{
            $scope.islocked8=true;
          }
          $mdSidenav('left8').toggle();
        };

        $scope.islocked9=false;
        $scope.isOpen9=false;
        $scope.toggleNav9 = function() {
          if($mdSidenav('left9').isOpen()){
            $scope.isOpen9=false;
          }else{
            $scope.isOpen9=true;
          }
          if($mdSidenav('left9').isLockedOpen()){
            $scope.islocked9=false;
          }else{
            $scope.islocked9=true;
          }
          $mdSidenav('left9').toggle();
        };
        $scope.islocked10=false;
        $scope.isOpen10=false;
        $scope.toggleNav10 = function(layerId) {
          if(layerId!=null){
            $rootScope.downloadId=parseInt(layerId);
          }
          if($mdSidenav('left10').isOpen()){
            $scope.isOpen10=false;
          }else{
            $scope.isOpen10=true;
          }
          if($mdSidenav('left10').isLockedOpen()){
            $scope.islocked10=false;
          }else{
            $scope.islocked10=true;
          }
          $mdSidenav('left10').toggle();
        };
        $scope.toggleNav11 = function(layerId) {

          if($mdSidenav('left11').isOpen()){
            if(layerId==null){
              if($('#simplify-'+$rootScope.simplifyId).hasClass('onCls')){
                $('#simplify-'+$rootScope.simplifyId).removeClass('onCls');//Add onCls to clu-layerId element
                fts=[];
                $scope.isCheckedSimplify=false;
                $rootScope.simplifyId=0;
                $scope.valueinisimplify = "0";
              }
              $mdSidenav('left11').toggle();
              if($mdSidenav('left11').isLockedOpen()){
                $scope.islocked11=false;
              }else{
                $scope.islocked11=true;
              }
              $scope.isOpen11=false;
            }else{
              if(parseInt(layerId)==$rootScope.simplifyId){
                if($('#simplify-'+layerId).hasClass('onCls')){
                  $('#simplify-'+layerId).removeClass('onCls');//Add onCls to clu-layerId element
                  fts=[];
                  $scope.isCheckedSimplify=false;
                  $rootScope.simplifyId=0;
                  $scope.valueinisimplify = "0";
                }
                $mdSidenav('left11').toggle();
                if($mdSidenav('left11').isLockedOpen()){
                  $scope.islocked11=false;
                }else{
                  $scope.islocked11=true;
                }
                $scope.isOpen11=false;
              }
            }
          }else{
            if(layerId!=null){
              $rootScope.simplifyId=parseInt(layerId);
              var ftsG=geoOperation.getFTSGeom($rootScope.simplifyId,$rootScope.originalFts);
              if(ftsG==null){
                var fc1 = geoOperation.getFCGeombyID2($rootScope.simplifyId,$rootScope.capas);
                for (var feat in fc1) {
                  fts.push(fc1[feat].feature);
                }
                $rootScope.originalFts.push({id:$rootScope.simplifyId,fts:fts});
              }else{
                fts=ftsG;
              }
            }
            $scope.isOpen11=true;
            if(!$('#simplify-'+layerId).hasClass('onCls')){
              $('#simplify-'+layerId).addClass('onCls');//Add onCls to clu-layerId element
            }
            $mdSidenav('left11').toggle();
            if($mdSidenav('left11').isLockedOpen()){
              $scope.islocked11=false;
            }else{
              $scope.islocked11=true;
            }

          }
        };
        $scope.islocked12=false;
        $scope.isOpen12=false;
        $scope.toggleNav12 = function() {
          if($mdSidenav('left12').isOpen()){
            $scope.isOpen12=false;
          }else{
            $scope.isOpen12=true;
          }
          if($mdSidenav('left12').isLockedOpen()){
            $scope.islocked12=false;
          }else{
            $scope.islocked12=true;
          }
          $mdSidenav('left12').toggle();
        };

        $scope.islocked13=false;
        $scope.isOpen13=false;
        $scope.toggleNav13 = function() {
          if($mdSidenav('left13').isOpen()){
            $scope.isOpen13=false;
          }else{

            $scope.isOpen13=true;
          }
          if($mdSidenav('left13').isLockedOpen()){
            $scope.islocked13=false;
          }else{
            $scope.islocked13=true;
          }
          $mdSidenav('left13').toggle();
        };
        /*$scope.printPreview = function(){
        leafletData.getMap("mapabase").then(function(map) {
        $("#mapabase").css('width', '100%');
        $("#mapabase").css('height', '100%');
        $('#mapabase').show();
        map.invalidateSize();
        window.print();
      });
    };*/
    $scope.takePicture= function(){
      leafletData.getMap("mapabase").then(function(map) {
        leafletImage(map, function(err, canvas) {
          // now you have canvas
          // example thing to do with that canvas:
          var img = document.createElement('img');
          var dimensions = map.getSize();
          img.width = dimensions.x;
          img.height = dimensions.y;
          img.crossOrigin='anonymous';
          img.src = canvas.toDataURL();
          console.log(img);
          var a = document.createElement('a');
          a.href = img.src;
          a.download = "output.jpg";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
      });
    };

    $scope.downloadGeojson= function(){
      leafletData.getMap("mapabase").then(function(map) {
        map.eachLayer(function (layer) {
          if (layer._leaflet_id === $rootScope.downloadId) {
            var geoJson=layer.toGeoJSON();//Convert the layer to geojson
            var text=JSON.stringify(geoJson);//Convert the geojson to text
            var a = document.getElementById("a-"+$rootScope.downloadId);
            var file = new Blob([text], {type: 'text/plain'});
            a.href = URL.createObjectURL(file);
            var layerName=geoOperation.getFCNamebyID($rootScope.downloadId,$rootScope.capas);
            var name=layerName+".geojson";
            a.download = name;
            a.click();
            $scope.toggleNav10();
          }
        });
      });
    }
    function showCurrentPosition() {
      var latitude = 0;
      var longitude = 0;
      leafletData.getMap("mapabase").then(function(map) {
       if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            if(markerAddress!=null){
              map.removeLayer(markerAddress);
              var lat,lng,obj;
              if(isOriginAdded==false){
                lat=arrReqPts[0].x;
                lng=arrReqPts[0].y;
                obj={"nombre": arrReqPts[0].nombre,"persona":arrReqPts[0].persona,"empresa":arrReqPts[0].empresa,"direccion":arrReqPts[0].direccion,"telefono":arrReqPts[0].telefono,"ciudad":arrReqPts[0].ciudad,"pais":arrReqPts[0].pais,"descripcion":arrReqPts[0].descripcion};
              }else{
                lat=auxReq1[0].x;
                lng=auxReq1[0].y;
                obj={"nombre": auxReq1[0].nombre,"persona":auxReq1[0].persona,"empresa":auxReq1[0].empresa,"direccion":auxReq1[0].direccion,"telefono":auxReq1[0].telefono,"ciudad":auxReq1[0].ciudad,"pais":auxReq1[0].pais,"descripcion":auxReq1[0].descripcion};
              }

              var geojsonFeature = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "type": "Point",
                  "coordinates": [lng, lat]
                }
              };
              var geojson=L.geoJson(geojsonFeature, {
                style: function (feature) {
                },
                onEachFeature: function(feature, layer){
                  feature.properties=obj;
                  var iconSize = [30, 70];
                  var iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-marker+00FF00.png';
                  layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                    iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                    popupAnchor: [0, -iconSize[1] / 2]}));
                    //geoOperation.bindPopup(layer);
                    var content = '<table class="dropchop-table"><tr>';
                    if (layer.feature.properties) {
                      for (var prop in layer.feature.properties) {
                        content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
                      }
                    }
                    content += '</table>';
                    layer.bindPopup(L.popup({
                      maxWidth: 450,
                      maxHeight: 200,
                      autoPanPadding: [45, 45],
                      className: 'dropchop-popup'
                    }, layer).setContent(content));
                  }
                });
                geojson.eachLayer(
                  function(l){
                    $rootScope.drawnPointItems.addLayer(l);
                  });
                  markerAddress=null;
                  if(isOriginAdded==false){
                    updateReqLayer(arrReqPts);
                  }
                }
                if(markerAddressDest!=null){
                  map.removeLayer(markerAddressDest);

                  var lat= arrReqPts[0].x1;
                  var lng=  arrReqPts[0].y1;
                  var obj={"nombre": arrReqPts[0].nombre+"(d)","persona":arrReqPts[0].personadestino,"empresa":arrReqPts[0].empresadestino,"direccion":arrReqPts[0].direcciondestino,"telefono":arrReqPts[0].telefonodestino,"ciudad":arrReqPts[0].ciudaddestino,"pais":arrReqPts[0].paisdestino,"descripcion":arrReqPts[0].descripciondestino};
                  var geojsonFeature = {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                      "type": "Point",
                      "coordinates": [lng, lat]
                    }
                  };
                  var geojson=L.geoJson(geojsonFeature, {
                    style: function (feature) {
                    },
                    onEachFeature: function(feature, layer){
                      feature.properties=obj;
                      var iconSize = [30, 70];
                      var iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-triangle+00FF00.png';
                      layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                        iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                        popupAnchor: [0, -iconSize[1] / 2]}));
                        //geoOperation.bindPopup(layer);
                        var content = '<table class="dropchop-table"><tr>';
                        if (layer.feature.properties) {
                          for (var prop in layer.feature.properties) {
                            content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
                          }
                        }
                        content += '</table>';
                        layer.bindPopup(L.popup({
                          maxWidth: 450,
                          maxHeight: 200,
                          autoPanPadding: [45, 45],
                          className: 'dropchop-popup'
                        }, layer).setContent(content));
                      }
                    });
                    geojson.eachLayer(
                      function(l){
                        $rootScope.drawnPointItems.addLayer(l);
                      });
                      markerAddressDest=null;
                      updateReqLayer(arrReqPts);
                }
                if(isOriginAdded==false){
                      $("#dialog-requirement").html("<div><label for='lbl_person_name' style='font-weight:bold;'>Nombre del requerimiento</label>"
                      +"<input type='text' id='reqName' name='reqName' value ='' style='width:100%;'>"
                      +"<label for='lbl_person_name' style='font-weight:bold;'>Nombre de la persona</label>"
                      +"<input type='text' id='reqPerson' name='reqPerson' value ='' style='width:100%;'>"
                      +"<label for='lbl_company' style='font-weight:bold;'>Empresa</label>"
                      +"<input type='text' id='reqCompany' value ='' style='width:100%;'>"
                      +"<label for='lbl_address' style='font-weight:bold;'>Direccion</label>"
                      +"<input type='text' id='reqAddress' name='reqAddress' value ='' style='width:100%;'>"
                      +"<label for='lbl_phone' style='font-weight:bold;'>Telefono</label>"
                      +"<input type='text' id='reqPhone' name='reqPhone' value ='' style='width:100%;'>"
                      +"<label for='lbl_city' style='font-weight:bold;'>Ciudad</label>"
                      +"<input type='text' id='reqCity' name='reqCity' value ='' style='width:100%;'>"
                      +"<label for='lbl_country' style='font-weight:bold;'>Pais</label>"
                      +"<input type='text' id='reqCountry' name='reqCountry' value ='' style='width:100%;'>"
                      +"<label for='lbl_country' style='font-weight:bold;'>Descripcion</label>"
                      +"<input type='text' id='reqDescripcion' name='reqDescripcion' value ='' style='width:100%;'>"
                      +"<input type='checkbox' id='destination' name='destination'>Tiene punto de entrega?</div>"
                    );
                    $("#dialog-requirement").dialog({
                      resizable: false,
                      modal: true,
                      title: "Crear un nuevo requerimiento",
                      height: 545,
                      width: 400,
                      buttons: {
                        "Aceptar": function () {
                          var nombre=$("#reqName").val();
                          var reqPerson=$("#reqPerson").val();
                          var reqCompany=$("#reqCompany").val();
                          var reqAddress=$("#reqAddress").val();
                          var reqPhone=$("#reqPhone").val();
                          var reqCity=$("#reqCity").val();
                          var reqCountry=$("#reqCountry").val();
                          var reqDes=$("#reqDescripcion").val();
                          var destChk=$("#destination").is(':checked');
                          if(nombre===''||reqPerson===''||reqCompany===''||reqAddress===''||reqPhone===''||reqCity===''||reqCountry===''||reqDes===''){
                            alert("Debe de completar todos los campos.");
                          }else{
                            if(geoOperation.validateRequirementName($rootScope.capasreq[0].nombre,nombre)==false){
                              coords_1 = [];
                              var obj={"nombre":nombre,"persona":reqPerson,"empresa":reqCompany,"direccion":reqAddress,"telefono":reqPhone,"ciudad":reqCity,"pais":reqCountry,"descripcion":reqDes};
                              var geojsonFeature = {
                                "type": "Feature",
                                "properties": {},
                                "geometry": {
                                  "type": "Point",
                                  "coordinates": [longitude, latitude]
                                }
                              };
                              var geojson=L.geoJson(geojsonFeature, {
                                style: function (feature) {
                                },
                                onEachFeature: function(feature, layer){
                                  feature.properties=obj;
                                  var iconSize = [30, 70];
                                  var iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-marker+00FF00.png';
                                  layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                                    iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                                    popupAnchor: [0, -iconSize[1] / 2]}));
                                    coords_1.push(feature.geometry.coordinates);
                                    //geoOperation.bindPopup(layer);
                                    var content = '<table class="dropchop-table"><tr>';
                                    if (layer.feature.properties) {
                                      for (var prop in layer.feature.properties) {
                                        content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
                                      }
                                    }
                                    content += '</table>';
                                    layer.bindPopup(L.popup({
                                      maxWidth: 450,
                                      maxHeight: 200,
                                      autoPanPadding: [45, 45],
                                      className: 'dropchop-popup'
                                    }, layer).setContent(content));
                                  }
                                });
                                geojson.eachLayer(
                                  function(l){
                                    $rootScope.drawnPointItems.addLayer(l);
                                  });
                                  map.setView([latitude,longitude], 15);
                                  map.invalidateSize();
                                  var dt = new Date();
                                  var h=dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
                                  var x=coords_1[0][1];
                                  var y=coords_1[0][0];
                                  var z=0;

                                  if(destChk){
                                    isOriginAdded=true;
                                    auxReq1.push({client_id:'',hora_creacion:h,hora_asignacion:'',hora_cierre:'',x:x,y:y,z:z,nombre:nombre,persona:reqPerson,empresa:reqCompany,direccion:reqAddress,telefono:reqPhone,ciudad:reqCity,pais:reqCountry,descripcion:reqDes});
                                    $(this).dialog('close');
                                  }else{
                                    arrReqPts.push({client_id:'',hora_creacion:h,hora_asignacion:'',hora_cierre:'',x:x,y:y,z:z,nombre:nombre,persona:reqPerson,empresa:reqCompany,direccion:reqAddress,telefono:reqPhone,ciudad:reqCity,pais:reqCountry,descripcion:reqDes,recogido:'',personadestino:'',empresadestino:'',direcciondestino:'',telefonodestino:'',ciudaddestino:'',paisdestino:'',descripciondestino:'',x1:0,y1:0,z1:0,entregado:'',createdby:'',status:'nuevo'});
                                    updateReqLayer(arrReqPts);
                                    $(this).dialog('close');
                                  }
                                }else{
                                  alert("Ya existe un requerimiento con el mismo nombre "+nombre);
                                }
                              }
                            }
                          }
                        });
                        $('#dialog-requirement').dialog('open');
                  }else{
                        $("#dialog-requirement-dest").html("<div><label for='lbl_person_name' style='font-weight:bold;'>Nombre de la persona</label>"
                        +"<input type='text' id='reqPersonDest' name='reqPersonDest' value ='' style='width:100%;'>"
                        +"<label for='lbl_company' style='font-weight:bold;'>Empresa</label>"
                        +"<input type='text' id='reqCompanyDest' value ='' style='width:100%;'>"
                        +"<label for='lbl_address' style='font-weight:bold;'>Direccion</label>"
                        +"<input type='text' id='reqAddressDest' name='reqAddressDest' value ='' style='width:100%;'>"
                        +"<label for='lbl_phone' style='font-weight:bold;'>Telefono</label>"
                        +"<input type='text' id='reqPhoneDest' name='reqPhoneDest' value ='' style='width:100%;'>"
                        +"<label for='lbl_city' style='font-weight:bold;'>Ciudad</label>"
                        +"<input type='text' id='reqCityDest' name='reqCityDest' value ='' style='width:100%;'>"
                        +"<label for='lbl_country' style='font-weight:bold;'>Pais</label>"
                        +"<input type='text' id='reqCountryDest' name='reqCountryDest' value ='' style='width:100%;'>"
                        +"<label for='lbl_country' style='font-weight:bold;'>Descripcion</label>"
                        +"<input type='text' id='reqDescripcionDest' name='reqDescripcionDest' value ='' style='width:100%;'></div>"
                      );
                      $("#dialog-requirement-dest").dialog({
                        resizable: false,
                        modal: true,
                        title: "Punto de entrega",
                        height: 480,
                        width: 400,
                        buttons: {
                          "Aceptar": function () {
                            var reqPersonDest=$("#reqPersonDest").val();
                            var reqCompanyDest=$("#reqCompanyDest").val();
                            var reqAddressDest=$("#reqAddressDest").val();
                            var reqPhoneDest=$("#reqPhoneDest").val();
                            var reqCityDest=$("#reqCityDest").val();
                            var reqCountryDest=$("#reqCountryDest").val();
                            var reqDesDest=$("#reqDescripcionDest").val();
                            if( reqPersonDest===''||reqCompanyDest===''||reqAddressDest===''||reqPhoneDest===''||reqCityDest===''||reqCountryDest===''||reqDesDest===''){
                              alert("Debe de completar todos los campos.");
                            }else{
                              var obj={"nombre":auxReq1[0].nombre+"(d)","persona":reqPersonDest,"empresa":reqCompanyDest,"direccion":reqAddressDest,"telefono":reqPhoneDest,"ciudad":reqCityDest,"pais":reqCountryDest,"descripcion":reqDesDest};
                              var geojsonFeature = {
                                "type": "Feature",
                                "properties": {},
                                "geometry": {
                                  "type": "Point",
                                  "coordinates": [longitude, latitude]
                                }
                              };
                              var geojson=L.geoJson(geojsonFeature, {
                                style: function (feature) {

                                },
                                onEachFeature: function(feature, layer){
                                  feature.properties=obj;
                                  var iconSize = [30, 70];
                                  var iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-triangle+00FF00.png';
                                  layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                                    iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                                    popupAnchor: [0, -iconSize[1] / 2]}));
                                    coords_1.push(feature.geometry.coordinates);
                                    //geoOperation.bindPopup(layer);
                                    var content = '<table class="dropchop-table"><tr>';
                                    if (layer.feature.properties) {
                                      for (var prop in layer.feature.properties) {
                                        content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
                                      }
                                    }
                                    content += '</table>';
                                    layer.bindPopup(L.popup({
                                      maxWidth: 450,
                                      maxHeight: 200,
                                      autoPanPadding: [45, 45],
                                      className: 'dropchop-popup'
                                    }, layer).setContent(content));
                                  }
                                });
                                geojson.eachLayer(
                                  function(l){
                                    $rootScope.drawnPointItems.addLayer(l);
                                  });
                                  map.setView([latitude,longitude], 15);
                                  map.invalidateSize();
                                  var x_2=coords_1[1][1];
                                  var y_2=coords_1[1][0];
                                  var z_2=0;
                                  arrReqPts.push({client_id:auxReq1[0].client_id,hora_creacion:auxReq1[0].hora_creacion,hora_asignacion:'',hora_cierre:'',x:auxReq1[0].x,y:auxReq1[0].y,z:auxReq1[0].z,nombre:auxReq1[0].nombre,persona:auxReq1[0].persona,empresa:auxReq1[0].empresa,direccion:auxReq1[0].direccion,telefono:auxReq1[0].telefono,ciudad:auxReq1[0].ciudad,pais:auxReq1[0].pais,descripcion:auxReq1[0].descripcion,recogido:'',personadestino:reqPersonDest,empresadestino:reqCompanyDest,direcciondestino:reqAddressDest,telefonodestino:reqPhoneDest,ciudaddestino:reqCityDest,paisdestino:reqCountryDest,descripciondestino:reqDesDest,x1:x_2,y1:y_2,z1:z_2,entregado:'',createdby:'',status:'nuevo'});
                                  isOriginAdded=false;
                                  auxReq1=[];
                                  updateReqLayer(arrReqPts);
                                  $(this).dialog('close');
                                }
                              }
                            }
                          });
                          $('#dialog-requirement-dest').dialog('open');
                    }
              });
          }
      });
    }
    $scope.downloadTopjson= function(){
      leafletData.getMap("mapabase").then(function(map) {
        map.eachLayer(function (layer) {
          if (layer._leaflet_id === $rootScope.downloadId) {
            var geoJson=layer.toGeoJSON();//Convert the layer to geojson
            var text=JSON.stringify(geoJson);//Convert the geojson to text
            var a = document.getElementById("a-"+$rootScope.downloadId);
            $scope.toggleNav10();
          }
        });
      });
    }
    $scope.donwloadShape= function(){
      //layerId=parseInt(layerId);
      leafletData.getMap("mapabase").then(function(map) {
        map.eachLayer(function (layer) {
          if (layer._leaflet_id === $rootScope.downloadId) {
            var geoJson=layer.toGeoJSON();//Convert the layer to geojson
            var text=JSON.stringify(geoJson);//Convert the geojson to text

            var formData = new FormData();
            formData.append('json', text);

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://ogre.adc4gis.com/convertJson");
            xhr.responseType = "arraybuffer"; // ask for a binary result
            xhr.onreadystatechange = function(evt) {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                 // console.log(xhr.response);
                  var zip = new JSZip(xhr.response);
                 // console.log("success, got", Object.keys(zip.files));
                  var content = zip.generate({type:"blob"});
                  var layerName=geoOperation.getFCNamebyID($rootScope.downloadId,$rootScope.capas);
                  var name=layerName+".zip";
                  saveAs(content, name);
                  $scope.toggleNav10();
                } else {
                  alert("No se puede generar el archivo shapefile porque la capa es muy grande.");
                  $scope.toggleNav10();
                  //console.log("http call error");
                }
              }
            };
            xhr.send(formData);
          }
        });
      });
    }

  $scope.downloadLayer= function (layerId) {
    //console.clear();
    layerId=parseInt(layerId);
    leafletData.getMap("mapabase").then(function(map) {
      map.eachLayer(function (layer) {
        if (layer._leaflet_id === layerId) {
          var geoJson=layer.toGeoJSON();//Convert the layer to geojson
          var text=JSON.stringify(geoJson);//Convert the geojson to text
          var a = document.getElementById("a-"+layerId);
          var file = new Blob([text], {type: 'text/plain'});
          a.href = URL.createObjectURL(file);
          var layerName=geoOperation.getFCNamebyID(layerId,$rootScope.capas);
          var name=layerName+".geojson";
          a.download = name;
          a.click();
        }
      });
    });
  };
  $scope.downloadMap= function (layerId,layername){
       leafletData.getMap("mapabase").then(function(map) {
        map.eachLayer(function (layer) {
          if (layer._leaflet_id === parseInt(layerId)){
              var geoJson=layer.toGeoJSON();//Convert the layer to geojson
              var text=JSON.stringify(geoJson);//Convert the geojson to text
              var json=JSON.parse(text);
              updateProjection(json,mapOptions.width,mapOptions.height);
              var name=layername+".geojson";
              var nameHmtl=layername+".html";
              var a2 = document.createElement("a");
              document.body.appendChild(a2);
              //var mapOptions=$rootScope.arrMapOptions[layerId];
              var codeContents=generateCode(text,mapOptions,map);
              //console.log(codeContents);
              var file2 = new Blob([codeContents], {type: 'text/html'});
              a2.href = URL.createObjectURL(file2);
              a2.download = nameHmtl;
              a2.click();
              document.body.removeChild(a2);
          }
        });
      });
  };
  $scope.showDevices=function(devicesVisible){
    $scope.devicesVisible=devicesVisible;
    if($scope.devicesVisible){
      if(realtime!=null){
        var layers=realtime._layers;
        angular.forEach(layers, function(value, key){
          realtime.removeLayer(layers[key]);
        });
        realtime=null;
      }
      showTrackDevices();
      zoom=true;
      intval=setInterval(updateReqStatus,15000);//Invoke trackPosition method each 15 seconds
    }else{
     clearInterval(intval);
     leafletData.getMap("mapabase").then(function(map) {
         var layers=realtime._layers;
         angular.forEach(layers, function(value, key){
           realtime.removeLayer(layers[key]);
         });
         map.removeLayer(realtime);
         realtime=null;
         $rootScope.tracks=[];
     });
    }
  }
  function geoCodeAddress(){
    $("#dialog-address").html("<div>"+"<label for='lbl_address' style='font-weight:bold;'>Dirección</label>"
      +"<input type='text' id='reqLocation' name='reqLocation' value ='' style='width:100%;'></div>"
    );
    var input = document.getElementById('reqLocation');
    var autocomplete = new google.maps.places.Autocomplete(input);//Autocomplete address

    $("#dialog-address").dialog({
      resizable: false,
      modal: true,
      title: "Ingresar dirección",
      height: 100,
      width: 400,
      buttons: {
        "Aceptar": function () {
          var reqLocation=$("#reqLocation").val();

          if(reqLocation!=""){
             locateAddress(reqLocation);
             $(this).dialog('close');
          }else{
            alert("El campo de dirección no puede ser vacio.");
          }
        }
      }
    });
  }
  function locateAddress(address){
    leafletData.getMap().then(function(map) {
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK)
        {
          if(results.length>0){
            if(markerAddress!=null){
              map.removeLayer(markerAddress);

              var lat,lng,obj;
              if(isOriginAdded==false){
                lat=arrReqPts[0].x;
                lng=arrReqPts[0].y;
                obj={"nombre": arrReqPts[0].nombre,"persona":arrReqPts[0].persona,"empresa":arrReqPts[0].empresa,"direccion":arrReqPts[0].direccion,"telefono":arrReqPts[0].telefono,"ciudad":arrReqPts[0].ciudad,"pais":arrReqPts[0].pais,"descripcion":arrReqPts[0].descripcion};
              }else{
                lat=auxReq1[0].x;
                lng=auxReq1[0].y;
                obj={"nombre": auxReq1[0].nombre,"persona":auxReq1[0].persona,"empresa":auxReq1[0].empresa,"direccion":auxReq1[0].direccion,"telefono":auxReq1[0].telefono,"ciudad":auxReq1[0].ciudad,"pais":auxReq1[0].pais,"descripcion":auxReq1[0].descripcion};
              }

              var geojsonFeature = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "type": "Point",
                  "coordinates": [lng, lat]
                }
              };
              var geojson=L.geoJson(geojsonFeature, {
                style: function (feature) {
                },
                onEachFeature: function(feature, layer){
                  feature.properties=obj;
                  var iconSize = [30, 70];
                  var iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-marker+00FF00.png';
                  layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                    iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                    popupAnchor: [0, -iconSize[1] / 2]}));
                    //geoOperation.bindPopup(layer);
                    var content = '<table class="dropchop-table"><tr>';
                    if (layer.feature.properties) {
                      for (var prop in layer.feature.properties) {
                        content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
                      }
                    }
                    content += '</table>';
                    layer.bindPopup(L.popup({
                      maxWidth: 450,
                      maxHeight: 200,
                      autoPanPadding: [45, 45],
                      className: 'dropchop-popup'
                    }, layer).setContent(content));
                  }
                });
                geojson.eachLayer(
                  function(l){
                    $rootScope.drawnPointItems.addLayer(l);
                  });
                  markerAddress=null;
                  if(isOriginAdded==false){
                    updateReqLayer(arrReqPts);
                  }
                }
                if(markerAddressDest!=null){
                  map.removeLayer(markerAddressDest);

                  var lat= arrReqPts[0].x1;
                  var lng=  arrReqPts[0].y1;
                  var obj={"nombre": arrReqPts[0].nombre+"(d)","persona":arrReqPts[0].personadestino,"empresa":arrReqPts[0].empresadestino,"direccion":arrReqPts[0].direcciondestino,"telefono":arrReqPts[0].telefonodestino,"ciudad":arrReqPts[0].ciudaddestino,"pais":arrReqPts[0].paisdestino,"descripcion":arrReqPts[0].descripciondestino};
                  var geojsonFeature = {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                      "type": "Point",
                      "coordinates": [lng, lat]
                    }
                  };
                  var geojson=L.geoJson(geojsonFeature, {
                    style: function (feature) {
                    },
                    onEachFeature: function(feature, layer){
                      feature.properties=obj;
                      var iconSize = [30, 70];
                      var iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-triangle+00FF00.png';
                      layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                        iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                        popupAnchor: [0, -iconSize[1] / 2]}));
                        //geoOperation.bindPopup(layer);
                        var content = '<table class="dropchop-table"><tr>';
                        if (layer.feature.properties) {
                          for (var prop in layer.feature.properties) {
                            content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
                          }
                        }
                        content += '</table>';
                        layer.bindPopup(L.popup({
                          maxWidth: 450,
                          maxHeight: 200,
                          autoPanPadding: [45, 45],
                          className: 'dropchop-popup'
                        }, layer).setContent(content));
                      }
                    });
                    geojson.eachLayer(
                      function(l){
                        $rootScope.drawnPointItems.addLayer(l);
                      });
                      markerAddressDest=null;
                      updateReqLayer(arrReqPts);
                    }
                    if(isOriginAdded==false){
                      $("#dialog-requirement").html("<div><label for='lbl_person_name' style='font-weight:bold;'>Nombre del requerimiento</label>"
                      +"<input type='text' id='reqName' name='reqName' value ='' style='width:100%;'>"
                      +"<label for='lbl_person_name' style='font-weight:bold;'>Nombre de la persona</label>"
                      +"<input type='text' id='reqPerson' name='reqPerson' value ='' style='width:100%;'>"
                      +"<label for='lbl_company' style='font-weight:bold;'>Empresa</label>"
                      +"<input type='text' id='reqCompany' value ='' style='width:100%;'>"
                      +"<label for='lbl_address' style='font-weight:bold;'>Direccion</label>"
                      +"<input type='text' id='reqAddress' name='reqAddress' value ='' style='width:100%;'>"
                      +"<label for='lbl_phone' style='font-weight:bold;'>Telefono</label>"
                      +"<input type='text' id='reqPhone' name='reqPhone' value ='' style='width:100%;'>"
                      +"<label for='lbl_city' style='font-weight:bold;'>Ciudad</label>"
                      +"<input type='text' id='reqCity' name='reqCity' value ='' style='width:100%;'>"
                      +"<label for='lbl_country' style='font-weight:bold;'>Pais</label>"
                      +"<input type='text' id='reqCountry' name='reqCountry' value ='' style='width:100%;'>"
                      +"<label for='lbl_country' style='font-weight:bold;'>Descripcion</label>"
                      +"<input type='text' id='reqDescripcion' name='reqDescripcion' value ='' style='width:100%;'>"
                      +"<input type='checkbox' id='destination' name='destination'>Tiene punto de entrega?</div>"
                    );
                    $("#dialog-requirement").dialog({
                      resizable: false,
                      modal: true,
                      title: "Crear un nuevo requerimiento",
                      height: 545,
                      width: 400,
                      buttons: {
                        "Aceptar": function () {
                          var nombre=$("#reqName").val();
                          var reqPerson=$("#reqPerson").val();
                          var reqCompany=$("#reqCompany").val();
                          var reqAddress=$("#reqAddress").val();
                          var reqPhone=$("#reqPhone").val();
                          var reqCity=$("#reqCity").val();
                          var reqCountry=$("#reqCountry").val();
                          var reqDes=$("#reqDescripcion").val();
                          var destChk=$("#destination").is(':checked');

                          if(nombre===''||reqPerson===''||reqCompany===''||reqAddress===''||reqPhone===''||reqCity===''||reqCountry===''||reqDes===''){
                            alert("Debe de completar todos los campos.");
                          }else{
                            if(geoOperation.validateRequirementName($rootScope.capasreq[0].nombre,nombre)==false){
                              var obj="<table class='dropchop-table'><tr><td><strong>nombre</strong></td><td>"+nombre+"</td></tr><tr><td><strong>persona</strong></td><td>"+reqPerson+"</td></tr><tr><td><strong>empresa</strong></td><td>"+reqCompany+"</td></tr><tr><td><strong>direccion</strong></td><td>"+reqAddress+"</td></tr><tr><td><strong>telefono</strong></td><td>"+reqPhone+"</td></tr><tr><td><strong>ciudad</strong></td><td> "+reqCity+"</td></tr><tr><td><strong>pais</strong></td><td>"+reqCountry+"</td><tr><td><strong>descripcion</strong></td><td>"+reqDes+"</td></tr></table>";
                              coords_1 = [];
                              var latLng= new L.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                              var iconSize = [30, 70];
                              var arr=[];
                              arr[1]=results[0].geometry.location.lat();
                              arr[0]=results[0].geometry.location.lng();
                              coords_1.push(arr);

                              var x=coords_1[0][1];
                              var y=coords_1[0][0];

                              var z=0;
                              var icon = L.icon({
                                iconUrl: 'http://api.tiles.mapbox.com/v3/marker/pin-m-marker+00FF00.png',
                                iconSize: iconSize,
                                iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                                popupAnchor: [0, -iconSize[1] / 2]
                              });
                              var popup = L.popup({
                                maxWidth: 450,
                                maxHeight: 200,
                                autoPanPadding: [45, 45],
                                className: 'dropchop-popup'
                              }).setContent(obj);
                              markerAddress = L.marker(latLng, {icon: icon, draggable:'true'}).bindPopup(popup);
                              markerAddress.on('dragend', function(event){
                                var chagedPos = event.target.getLatLng();
                                if(destChk){
                                  auxReq1[0].x=event.target.getLatLng().lat;
                                  auxReq1[0].y=event.target.getLatLng().lng;
                                }else {
                                  arrReqPts[0].x=event.target.getLatLng().lat;
                                  arrReqPts[0].y=event.target.getLatLng().lng;
                                }
                              });
                              markerAddress.addTo(map);
                              map.setView([results[0].geometry.location.lat(), results[0].geometry.location.lng()], 15);
                              map.invalidateSize();
                              var dt = new Date();
                              var h=dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
                              if(destChk){
                                isOriginAdded=true;
                                auxReq1.push({client_id:'',hora_creacion:h,hora_asignacion:'',hora_cierre:'',x:x,y:y,z:z,nombre:nombre,persona:reqPerson,empresa:reqCompany,direccion:reqAddress,telefono:reqPhone,ciudad:reqCity,pais:reqCountry,descripcion:reqDes});
                                $(this).dialog('close');
                              }else{
                                arrReqPts.push({client_id:'',hora_creacion:h,hora_asignacion:'',hora_cierre:'',x:x,y:y,z:z,nombre:nombre,persona:reqPerson,empresa:reqCompany,direccion:reqAddress,telefono:reqPhone,ciudad:reqCity,pais:reqCountry,descripcion:reqDes,recogido:'',personadestino:'',empresadestino:'',direcciondestino:'',telefonodestino:'',ciudaddestino:'',paisdestino:'',descripciondestino:'',x1:0,y1:0,z1:0,entregado:'',createdby:'',status:'nuevo'});
                                $(this).dialog('close');
                              }
                            }else{
                              alert("Ya existe un requerimiento con el mismo nombre "+nombre);
                            }
                          }
                        }
                      }
                    });
                    $('#dialog-requirement').dialog('open');
                  }else{

                    $("#dialog-requirement-dest").html("<div><label for='lbl_person_name' style='font-weight:bold;'>Nombre de la persona</label>"
                    +"<input type='text' id='reqPersonDest' name='reqPersonDest' value ='' style='width:100%;'>"
                    +"<label for='lbl_company' style='font-weight:bold;'>Empresa</label>"
                    +"<input type='text' id='reqCompanyDest' value ='' style='width:100%;'>"
                    +"<label for='lbl_address' style='font-weight:bold;'>Direccion</label>"
                    +"<input type='text' id='reqAddressDest' name='reqAddressDest' value ='' style='width:100%;'>"
                    +"<label for='lbl_phone' style='font-weight:bold;'>Telefono</label>"
                    +"<input type='text' id='reqPhoneDest' name='reqPhoneDest' value ='' style='width:100%;'>"
                    +"<label for='lbl_city' style='font-weight:bold;'>Ciudad</label>"
                    +"<input type='text' id='reqCityDest' name='reqCityDest' value ='' style='width:100%;'>"
                    +"<label for='lbl_country' style='font-weight:bold;'>Pais</label>"
                    +"<input type='text' id='reqCountryDest' name='reqCountryDest' value ='' style='width:100%;'>"
                    +"<label for='lbl_country' style='font-weight:bold;'>Descripcion</label>"
                    +"<input type='text' id='reqDescripcionDest' name='reqDescripcionDest' value ='' style='width:100%;'></div>"
                  );
                  $("#dialog-requirement-dest").dialog({
                    resizable: false,
                    modal: true,
                    title: "Punto de entrega",
                    height: 480,
                    width: 400,
                    buttons: {
                      "Aceptar": function () {
                        var reqPersonDest=$("#reqPersonDest").val();
                        var reqCompanyDest=$("#reqCompanyDest").val();
                        var reqAddressDest=$("#reqAddressDest").val();
                        var reqPhoneDest=$("#reqPhoneDest").val();
                        var reqCityDest=$("#reqCityDest").val();
                        var reqCountryDest=$("#reqCountryDest").val();
                        var reqDesDest=$("#reqDescripcionDest").val();
                        if( reqPersonDest===''||reqCompanyDest===''||reqAddressDest===''||reqPhoneDest===''||reqCityDest===''||reqCountryDest===''||reqDesDest===''){
                          alert("Debe de completar todos los campos.");
                        }else{
                          var reqNombre=auxReq1[0].nombre+"(d)"
                          var obj="<table class='dropchop-table'><tr><td><strong>nombre</strong></td><td>"+reqNombre+"</td></tr><tr><td><strong>persona</strong></td><td>"+reqPersonDest+"</td></tr><tr><td><strong>empresa</strong></td><td>"+reqCompanyDest+"</td></tr><tr><td><strong>direccion</strong></td><td>"+reqAddressDest+"</td></tr><tr><td><strong>telefono</strong></td><td>"+reqPhoneDest+"</td></tr><tr><td><strong>ciudad</strong></td><td> "+reqCityDest+"</td></tr><tr><td><strong>pais</strong></td><td>"+reqCountryDest+"</td><tr><td><strong>descripcion</strong></td><td>"+reqDesDest+"</td></tr></table>";
                          var latLng= new L.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                          var iconSize = [30, 70];
                          var arr=[];
                          arr[1]=results[0].geometry.location.lat();
                          arr[0]=results[0].geometry.location.lng();
                          coords_1.push(arr);

                          var x_2=coords_1[1][1];
                          var y_2=coords_1[1][0];

                          var z_2=0;
                          var icon = L.icon({
                            iconUrl: 'http://api.tiles.mapbox.com/v3/marker/pin-m-triangle+00FF00.png',
                            iconSize: iconSize,
                            iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                            popupAnchor: [0, -iconSize[1] / 2]
                          });
                          var popup = L.popup({
                            maxWidth: 450,
                            maxHeight: 200,
                            autoPanPadding: [45, 45],
                            className: 'dropchop-popup'
                          }).setContent(obj);
                          markerAddressDest = L.marker(latLng, {icon: icon, draggable:'true'}).bindPopup(popup);
                          markerAddressDest.on('dragend', function(event){
                            var chagedPos = event.target.getLatLng();
                            arrReqPts[0].x1=event.target.getLatLng().lat;
                            arrReqPts[0].y1=event.target.getLatLng().lng;
                          });
                          markerAddressDest.addTo(map);
                          map.setView([results[0].geometry.location.lat(), results[0].geometry.location.lng()], 15);
                          map.invalidateSize();
                          arrReqPts.push({client_id:auxReq1[0].client_id,hora_creacion:auxReq1[0].hora_creacion,hora_asignacion:'',hora_cierre:'',x:auxReq1[0].x,y:auxReq1[0].y,z:auxReq1[0].z,nombre:auxReq1[0].nombre,persona:auxReq1[0].persona,empresa:auxReq1[0].empresa,direccion:auxReq1[0].direccion,telefono:auxReq1[0].telefono,ciudad:auxReq1[0].ciudad,pais:auxReq1[0].pais,descripcion:auxReq1[0].descripcion,recogido:'',personadestino:res.reqPersonDest,empresadestino:res.reqCompanyDest,direcciondestino:res.reqAddressDest,telefonodestino:res.reqPhoneDest,ciudaddestino:res.reqCityDest,paisdestino:res.reqCountryDest,descripciondestino:res.reqDescripcionDest,x1:x_2,y1:y_2,z1:z_2,entregado:'',createdby:$rootScope.username,status:'nuevo'});
                          isOriginAdded=false;
                          auxReq1=[];
                          $(this).dialog('close');
                        }
                      }
                    }
                  });
                  $('#dialog-requirement-dest').dialog('open');
                }
              }
            }
        });
    });
  }
  $scope.EditReqLayer=function(id){
    if($rootScope.drawLine==false&&$rootScope.isdrawctrladded==false&&$rootScope.isLayerEditing==false&&$rootScope.drawPoint==false){
      leafletData.getMap("mapabase").then(function(map) {
        var options = {
          position: 'topleft',
          draw: {
            polyline:false,
            polygon:false,
            rectangle: false,
            circle: false,
            marker: true
          },
          edit:false
        };
        $rootScope.drawPointCtrl = new L.Control.Draw(options);
        $rootScope.drawPointCtrl.addTo(map);
        $rootScope.drawCurrentPosition.addTo(map);
        $rootScope.geoCodingCrtl.addTo(map);
        $rootScope.exitPointBtn.addTo(map);
        $rootScope.drawPoint=true;
        id=parseInt(id);
        $rootScope.editReqId=id;
        for(var i=0;i<$rootScope.capasreq.length;i++){
          var capasId=parseInt($rootScope.capasreq[i].id);
          if(capasId==id){
            $rootScope.capasreq[i].edit=true;
          }
        }
      });
    }
    if($rootScope.isdrawctrladded){
        alert("Debe de terminar de crear la capa.");
    }else if($rootScope.isLayerEditing){
        alert("Debe de terminar la edición de la capa.");
    }else if($rootScope.drawLine){
        alert("Debe de finalizar de crear el perfil de terreno.");
    }
  }
  //Function to update the req layer in the database
  function updateReqLayer(arr){
    var reqid=$rootScope.capasreq[0].nombre;
    $.ajax({
      async: false,
      type: "GET",
      url: $rootScope.host+"/api/requirements/"+reqid,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (result) {
        var returnOb = angular.fromJson(result);
        if(returnOb!=null){
          var val=returnOb.id;
          var companyId=returnOb.companyid;
          var reqDate=returnOb.fecha;
          var reqpoints="{'points':[";
          if(returnOb.features!=null&&returnOb.features!=""){
            var jsonPts=jQuery.parseJSON(JSON.stringify(eval("(" + returnOb.features + ")")));
            for(var i=0;i<jsonPts.points.length;i++){
              var clientId=jsonPts.points[i].point.client_id;
              var name=jsonPts.points[i].point.nombre;
              var person=jsonPts.points[i].point.persona;
              var company=jsonPts.points[i].point.empresa;
              var address=jsonPts.points[i].point.direccion;
              var phone=jsonPts.points[i].point.telefono;
              var city=jsonPts.points[i].point.ciudad;
              var country=jsonPts.points[i].point.pais;
              var des=jsonPts.points[i].point.descripcion;

              var persondest=jsonPts.points[i].point.personadestino;
              var companydest=jsonPts.points[i].point.empresadestino;
              var addressdest=jsonPts.points[i].point.direcciondestino;
              var phonedest=jsonPts.points[i].point.telefonodestino;
              var citydest=jsonPts.points[i].point.ciudaddestino;
              var countrydest=jsonPts.points[i].point.paisdestino;
              var desdest=jsonPts.points[i].point.descripciondestino;

              var createdTime=jsonPts.points[i].point.hora_creacion;
              var assignedTime=jsonPts.points[i].point.hora_asignacion;
              var closedTime=jsonPts.points[i].point.hora_cierre;
              var x1=jsonPts.points[i].point.x;
              var y1=jsonPts.points[i].point.y;
              var z1=jsonPts.points[i].point.z;

              var pickedup=jsonPts.points[i].point.recogido;
              var delivered=jsonPts.points[i].point.entregado;

              var x2=jsonPts.points[i].point.x1;
              var y2=jsonPts.points[i].point.y1;
              var z2=jsonPts.points[i].point.z1;
              var status=jsonPts.points[i].point.status;
              var createdby=jsonPts.points[i].point.createdby;
              reqpoints=reqpoints+"{'point':{'client_id':'"+clientId+"','hora_creacion':'"+createdTime+"','hora_asignacion':'"+assignedTime+"','hora_cierre':'"+closedTime+"','x':"+x1+",'y':"+y1+",'z':"+z1+",'nombre':'"+name+"','persona':'"+person+"','empresa':'"+company+"','direccion':'"+address+"','telefono':'"+phone+"','ciudad':'"+city+"','pais':'"+country+"','descripcion':'"+des+"','recogido':'"+pickedup+"','personadestino':'"+persondest+"','empresadestino':'"+companydest+"','direcciondestino':'"+addressdest+"','telefonodestino':'"+phonedest+"','ciudaddestino':'"+citydest+"','paisdestino':'"+countrydest+"','descripciondestino':'"+desdest+"','x1':"+x2+",'y1':"+y2+",'z1':"+z2+",'entregado':'"+delivered+"','createdby':'"+createdby+"','status':'"+status+"'}},";
            }
          }
          for(var i=0;i<arr.length;i++){
            var clientId=arr[i].client_id;
            var name=arr[i].nombre;
            var person=arr[i].persona;
            var company=arr[i].empresa;
            var address=arr[i].direccion;
            var phone=arr[i].telefono;
            var city=arr[i].ciudad;
            var country=arr[i].pais;
            var des=arr[i].descripcion;

            var persondest=arr[i].personadestino;
            var companydest=arr[i].empresadestino;
            var addressdest=arr[i].direcciondestino;
            var phonedest=arr[i].telefonodestino;
            var citydest=arr[i].ciudaddestino;
            var countrydest=arr[i].paisdestino;
            var desdest=arr[i].descripciondestino;

            var createdTime=arr[i].hora_creacion;
            var assignedTime=arr[i].hora_asignacion;
            var closedTime=arr[i].hora_cierre;
            var x1=arr[i].x;
            var y1=arr[i].y;
            var z1=arr[i].z;
            var x2=arr[i].x1;
            var y2=arr[i].y1;
            var z2=arr[i].z1;
            var status=arr[i].status;
            var createdby=arr[i].createdby;
            reqpoints=reqpoints+"{'point':{'client_id':'"+clientId+"','hora_creacion':'"+createdTime+"','hora_asignacion':'"+assignedTime+"','hora_cierre':'"+closedTime+"','x':"+x1+",'y':"+y1+",'z':"+z1+",'nombre':'"+name+"','persona':'"+person+"','empresa':'"+company+"','direccion':'"+address+"','telefono':'"+phone+"','ciudad':'"+city+"','pais':'"+country+"','descripcion':'"+des+"','recogido':'','personadestino':'"+persondest+"','empresadestino':'"+companydest+"','direcciondestino':'"+addressdest+"','telefonodestino':'"+phonedest+"','ciudaddestino':'"+citydest+"','paisdestino':'"+countrydest+"','descripciondestino':'"+desdest+"','x1':"+x2+",'y1':"+y2+",'z1':"+z2+",'entregado':'','createdby':'"+createdby+"','status':'"+status+"'}},";
          }
          reqpoints = reqpoints.substring(0, reqpoints.length - 1);
          reqpoints=reqpoints+"]}";
          var req={id:val,reqid:reqid,companyid:companyId,fecha:reqDate,features:reqpoints};
          //Update requirement cloud point in the database
          Requirement.update(req,onReqUpdateSuccess, onReqUpdateError);
        }
      }
    });
  }
  function showTrackDevices() {
     leafletData.getMap("mapabase").then(function(map) {
       trackLayer = L.layerGroup();
       try{
          realtime = L.realtime(
          /*
          I'm providing a function to simulate a GeoJSON service,
          instead of an URL

          {
          url: 'jsonServlet/ships.json',
          crossOrigin: true,
          type: 'json'
          }*/
        function(success, error){
          var points = getTrackDevices();
          //console.log(points);
          success(points);
        }, {
          interval: 2 * 1000,
          getFeatureId: function(featureData){
             return featureData.properties.client;
          },
          updateFeature: function (feature, oldLayer, newLayer) {
            oldLayer.setIcon(new L.Icon(newLayer.options.icon.options));
            return L.Realtime.prototype.options.updateFeature(feature, oldLayer, newLayer);
          },
          pointToLayer: function (feature, latlng) {
            var marker;
            if(feature.properties.status!='ocupado'){
               marker = L.marker(latlng, {icon: icon1});
            }else{
               marker = L.marker(latlng, {icon: icon2});
            }
            marker.bindPopup("<b>Dispositivo:</b> "+feature.properties.client).openPopup();
            marker.addTo(trackLayer);
            return marker;
          }
        }).addTo(map);

       if(zoom){
          map.fitBounds(realtime.getBounds());
          zoom=false;
       }
       //$rootScope.clcontrol.addOverlay(realtime.addTo(map),"realtime");
       //var lastId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
       //console.log(lastId);
       realtime.on('update', function() {
          //map.fitBounds(realtime.getBounds());
        });
      }catch (e) {

      }
     });
  }
  $scope.onChangeTracking=function(enabled,clientId){
    if(enabled){
    /*  var layers=realtime._layers;
      angular.forEach(layers, function(value, key){
        realtime.removeLayer(layers[key]);
      });

      //realtime=null;
      showTrackDevices();*/
    }else{
      leafletData.getMap("mapabase").then(function(map) {
         var layers=realtime._layers;
         angular.forEach(layers, function(value, key){
           if(layers[key].feature.properties.client==clientId){
             realtime.removeLayer(layers[key]);
           }
        });
     });
    }
  }
  function getTrackDevices(){
    if($scope.devicesVisible){
     var arrTracks=getCompanyTracks($rootScope.company);//Method to get the last tracked user position from the company
     var trackedPositions = new Array(arrTracks.length);
     for(var i=0;i<arrTracks.length;i++){
       var x=arrTracks[i].x;
       var y=arrTracks[i].y;
       //console.log("x="+x+",y="+y);
       var st=arrTracks[i].status;
       var client=arrTracks[i].clientId;
       var pt=turf.point([y, x], {client:client,status:st});
       trackedPositions[i]=pt;
     }
     var featureCollection = turf.featureCollection(trackedPositions);
     return featureCollection;
   }
  }
  function getTrackedPoints(obj){
     var array = new Array();
     var jsonPts=jQuery.parseJSON(JSON.stringify(eval("(" + obj + ")")));
     for(var i=0;i<jsonPts.points.length;i++){
          array.push({client_id:jsonPts.points[i].point.client_id,time:jsonPts.points[i].point.time,x:jsonPts.points[i].point.x,y:jsonPts.points[i].point.y,z:jsonPts.points[i].point.z,status:jsonPts.points[i].point.status});
     }
     return array;
  }
  //draw requirement layer for the current date
  $scope.showDrawPointsCtrl= function(){
    var dt = new Date();
    var m = dt.getUTCMonth() + 1; //months from 1-12
    var d = dt.getUTCDate();
    var year = dt.getUTCFullYear();

    if(m<10){
      m="0"+m;
    }
    if(d<10){
      d="0"+d;
    }
    var dateReqTime=year+'-'+m+'-'+d;
    var reqName=$rootScope.company+"_"+dateReqTime;
    //Validates if it exists a scheme for the current date according to the reqName
    if(geoOperation.getRequirementByCompany(reqName)==false){
      if($rootScope.drawLine==false&&$rootScope.isdrawctrladded==false&&$rootScope.isLayerEditing==false&&$rootScope.drawPoint==false){
        leafletData.getMap("mapabase").then(function(map) {

          $rootScope.drawnPointItems=new L.FeatureGroup();
          var options = {
            position: 'topleft',
            draw: {
              polyline:false,
              polygon:false,
              rectangle: false,
              circle: false,
              marker: true
            },
            edit:false
            /*edit: {
               featureGroup: $rootScope.drawnPointItems
            }*/
          };
          $rootScope.drawPointCtrl = new L.Control.Draw(options);
          $rootScope.drawPointCtrl.addTo(map);
          $rootScope.drawCurrentPosition.addTo(map);
          $rootScope.geoCodingCrtl.addTo(map);
          $rootScope.exitPointBtn.addTo(map);
          $rootScope.clcontrol.addOverlay($rootScope.drawnPointItems.addTo(map),reqName);
          var lastId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
          $rootScope.editReqId=lastId;
          $rootScope.capasreq.push({id:lastId,nombre:reqName,dateTime:dateReqTime,tipo:'requerimiento',capa:$rootScope.clcontrol._layers[lastId].layer,edit:true,enabled:true});
          $rootScope.drawPoint=true;
          var requirements='';
          var req={id:null,reqid:reqName,companyid:$rootScope.company,fecha:dateReqTime,features:requirements};
          //Save a new requirement cloud point in the database
          Requirement.save(req,onReqSaveSuccess, onReqSaveError);

        });
      }
      if($rootScope.isdrawctrladded){
        alert("Debe de terminar de crear la capa.");
      }else if($rootScope.isLayerEditing){
        alert("Debe de terminar la edición de la capa.");
      }else if($rootScope.drawLine){
        alert("Debe de finalizar de crear el perfil de terreno.");
      }
   }else{
     alert("Ya se genero una capa de requerimientos para el dia actual, lo cual puede cargar desde la nube.");
   }
  }
  function generateCode(text,options,map) {

      var codeLines = [];

      codeLines = codeLines.concat([
            '<!DOCTYPE html>',
            '<meta charset="utf-8">',
            '<style>',
            '',
            'body {',
            '  font: 12px sans-serif;',
            '}',
            '',
            'path {',
            function() { if (options.strokeWidth > 0) return '  stroke-width: '+options.strokeWidth+'px;'; return null; },
            function() { if (options.strokeWidth > 0) return '  stroke: '+options.stroke+';'; return '  stroke: none;' },
            function() { if (options.colorType == "simple") return '  fill: '+options.fill+';'; return '  fill: '+options.choropleth.default+';'; },
            '  cursor: pointer;',
            '}',
            ''
        ]);

        if (options.colorType == "simple" && options.highlight != options.fill) {
            codeLines = codeLines.concat([
                'path:hover, path.highlighted {',
                '  fill: '+options.highlight+';',
                '}',
                ''
            ]);
        } else if (options.colorType == "choropleth") {
            var domain = options.choropleth.scale.domain();
            var range = options.choropleth.scale.range();

            range.forEach(function(d,i) {
                codeLines = codeLines.concat([
                    'path.q'+i+'-'+range.length+' {',
                    '  fill: '+d+';',
                    '}',
                    ''
                ]);
            });

        }

        if (options.tooltip) {
            codeLines = codeLines.concat([
                'div.tooltip {',
                '  position: absolute;',
                '  background-color: white;',
                '  border: 1px solid black;',
                '  color: black;',
                '  font-weight: bold;',
                '  padding: 4px 8px;',
                '  display: none;',
                '}',
                ''
            ]);
        }

        codeLines = codeLines.concat([
            '</style>',
            '<body>',
            '<script src="http://d3js.org/d3.v3.min.js"></script>',
            '<script>',
            '',
            '//Map dimensions (in pixels)',
            'var width = '+options.width+',',
            '    height = '+options.height+';',
            '',
            '//Map projection',
            'var projection = d3.geo.'+options.projectionType+'()',
            '    .scale('+options.projection.scale()+')',
            function() {
                if ("center" in options.projection)
                    return '    .center(['+options.projection.center().join(",")+']) //projection center';
                return null;
            },
            function() {
                if ("parallels" in options.projection)
                    return '    .parallels(['+options.projection.parallels().join(",")+']) //parallels for conic projection';
                return null;
            },
            function() {
                if ("parallels" in options.projection && "rotate" in options.projection)
                    return '    .rotate(['+options.projection.rotate().filter(function(d){ return d; }).join(",")+']) //rotation for conic projection';
                return null;
            },
            function() {
                if ("parallels" in options.projection)
                    return '    .translate(['+options.projection.translate().join(",")+']) //translate to center the map in view';

                return '    .translate([width/2,height/2]) //translate to center the map in view';

                //return null;
            },
            '',
            '//Generate paths based on projection',
            'var path = d3.geo.path()',
            '    .projection(projection);',
            '',
            '//Create an SVG',
            'var svg = d3.select("body").append("svg")',
            '    .attr("width", width)',
            '    .attr("height", height);',
            '',
            '//Group for the map features',
            'var features = svg.append("g")',
            '    .attr("class","features");'
        ]);

        if (options.colorType == "choropleth") {
            codeLines = codeLines.concat([
                '',
                '//Create choropleth scale',
                'var color = d3.scale.quantize()',
                '    .domain(['+domain+'])',
                '    .range(d3.range('+range.length+').map(function(i) { return "q" + i + "-'+range.length+'"; }));'
            ]);
        }

        if (options.zoomMode == "free") {
            codeLines = codeLines.concat([
                '',
                '//Create zoom/pan listener',
                '//Change [1,Infinity] to adjust the min/max zoom scale',
                'var zoom = d3.behavior.zoom()',
                '    .scaleExtent([1, Infinity])',
                '    .on("zoom",zoomed);',
                '',
                'svg.call(zoom);'
            ]);
        }

        if (options.tooltip) {
            codeLines = codeLines.concat([
                '',
                '//Create a tooltip, hidden at the start',
                'var tooltip = d3.select("body").append("div").attr("class","tooltip");'
            ]);
        }

        codeLines = codeLines.concat([
            '',
            function() { if (options.zoomMode == "feature") return '//Keeps track of currently zoomed feature'; return null; },
            function() { if (options.zoomMode == "feature") return 'var centered;'; return null; },
            function() { if (options.zoomMode == "feature") return ''; return null; },
            'var geodata='+text+';',
            '',
            '  //Create a path for each map feature in the data',
            '  features.selectAll("path")',
            '   .data(geodata.features)',
            '    .enter()',
            '    .append("path")',
            '    .attr("d",path)',
            function() {
                if (options.colorType != "choropleth") return null;

                var a;

                if (!options.choropleth.attribute.match(/^[$_A-Za-z][$_A-Za-z0-9]+$/)) {
                    a = 'd.properties["'+options.choropleth.attribute.replace('"','\"')+'"]';
                } else {
                    a = 'd.properties.'+options.choropleth.attribute;
                }

                return '    .attr("class", function(d) { return (typeof color('+a+') == "string" ? color('+a+') : ""); })';
            },
            function() { if (options.tooltip) return '    .on("mouseover",showTooltip)'; return null; },
            function() { if (options.tooltip) return '    .on("mousemove",moveTooltip)'; return null; },
            function() { if (options.tooltip) return '    .on("mouseout",hideTooltip)'; return null; },
            '    .on("click",clicked);',
            '',
        ]);

        if (options.zoomMode == "feature") {

            codeLines = codeLines.concat([
                    '',
                    '// Zoom to feature on click',
                    'function clicked(d,i) {',
                    '',
                    '  //Add any other onClick events here',
                    '',
                    '  var x, y, k;',
                    '',
                    '  if (d && centered !== d) {',
                    '    // Compute the new map center and scale to zoom to',
                    '    var centroid = path.centroid(d);',
                    '    var b = path.bounds(d);',
                    '    x = centroid[0];',
                    '    y = centroid[1];',
                    '    k = .8 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);',
                    '    centered = d',
                    '  } else {',
                    '    x = width / 2;',
                    '    y = height / 2;',
                    '    k = 1;',
                    '    centered = null;',
                    '  }',
                    '',
                    '  // Highlight the new feature',
                    '  features.selectAll("path")',
                    '      .classed("highlighted",function(d) {',
                    '          return d === centered;',
                    function() { return '      })'+(options.strokeWidth ? '' : ';' ); },
                    function() { if (options.strokeWidth) return '      .style("stroke-width", '+options.strokeWidth+' / k + "px"); // Keep the border width constant'; return null; },
                    '',
                    '  //Zoom and re-center the map',
                    '  //Uncomment .transition() and .duration() to make zoom gradual',
                    '  features',
                    '      //.transition()',
                    '      //.duration(500)',
                    '      .attr("transform","translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");',
                    '}',
                    ''
                ]);
        } else {
            codeLines = codeLines.concat([
                    '',
                    '// Add optional onClick events for features here',
                    '// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)',
                    'function clicked(d,i) {',
                    '',
                    '}',
                    ''
                ]);

            if (options.zoomMode == "free") {
                codeLines = codeLines.concat([
                    '',
                    '//Update map on zoom/pan',
                    'function zoomed() {',
                    '  features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")',
                    '      .selectAll("path").style("stroke-width", '+options.strokeWidth+' / zoom.scale() + "px" );',
                    '}',
                    ''
                ]);
            }
        }

        if (options.tooltip) {
            codeLines = codeLines.concat([
                '',
                '//Position of the tooltip relative to the cursor',
                'var tooltipOffset = {x: 5, y: -25};',
                '',
                '//Create a tooltip, hidden at the start',
                'function showTooltip(d) {',
                '  moveTooltip();',
                '',
                '  tooltip.style("display","block")',
                function() {
                    if (!options.tooltip.match(/^[$_A-Za-z][$_A-Za-z0-9]+$/)) {
                        return '      .text(d.properties["'+options.tooltip.replace('"','\"')+'"]);'
                    }
                    return '      .text(d.properties.'+options.tooltip+');';
                },
                '}',
                '',
                '//Move the tooltip to track the mouse',
                'function moveTooltip() {',
                '  tooltip.style("top",(d3.event.pageY+tooltipOffset.y)+"px")',
                '      .style("left",(d3.event.pageX+tooltipOffset.x)+"px");',
                '}',
                '',
                '//Create a tooltip, hidden at the start',
                'function hideTooltip() {',
                '  tooltip.style("display","none");',
                '}'
            ]);
        }

        codeLines.push('</script>');

        var result = codeLines
            .map(function(l) {
                return (typeof l === "function") ? l() : l;
            })
            .filter(function(l) {
                return l !== null;
            }).join("\n");

        return result;

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
  $scope.simplifyLayer=function(value){
    tolerance=parseInt(value);
    tolerance=tolerance/100;
    try{
      leafletData.getMap("mapabase").then(function(map) {
        map.eachLayer(function (layer) {
          if (layer._leaflet_id === $rootScope.simplifyId) {
            var fc = turf.featureCollection(fts);
            layer.clearLayers();
            layer.addData(fc);//Add new simplified featureCollection
            var simplify = turf.simplify(fc,tolerance, $scope.isCheckedSimplify);
            layer.clearLayers();
            layer.addData(simplify);//Add new simplified featureCollection
          }
        });
      });
    }catch(err){

    }
  };
  $scope.onChangeCheckedSimplify=function(val){
    $scope.isCheckedSimplify=val;
    try{
      leafletData.getMap("mapabase").then(function(map) {
        map.eachLayer(function (layer) {
          if (layer._leaflet_id === $rootScope.simplifyId) {
            var fc = turf.featureCollection(fts);
            var simplify = turf.simplify(fc,tolerance, $scope.isCheckedSimplify);
            layer.clearLayers();
            layer.addData(simplify);//Add new simplified featureCollection
          }
        });
      });
    }catch(err){

    }
  };
  $scope.showRouteCtrl = function() {
    var latitude = 0;
    var longitude = 0;
    if($rootScope.isroutectrladded==false){
      leafletData.getMap("mapabase").then(function(map) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            $rootScope.routeCtrl = L.Routing.control({
              waypoints: [
                L.latLng(latitude, longitude),
                L.latLng(latitude, longitude)
              ],
              language: 'es',//Localization parameter for the control in this case 'es'
              geocoder: L.Control.Geocoder.nominatim(),
              routeWhileDragging: true,
              reverseWaypoints: true,
              showAlternatives: true,
              altLineOptions: {
                styles: [
                  {color: 'black', opacity: 0.15, weight: 9},
                  {color: 'white', opacity: 0.8, weight: 6},
                  {color: 'blue', opacity: 0.5, weight: 2}
                ]
              }
            });
            map.invalidateSize();
            $rootScope.routeCtrl.addTo(map);
            $rootScope.isroutectrladded=true;
          });
        }

      });
    }else{
      leafletData.getMap("mapabase").then(function(map) {
        $rootScope.routeCtrl.removeFrom(map);
        $rootScope.isroutectrladded=false;
      });
    }
  };
  $scope.drawPosition=function(){
    ModalService.showModal({
      templateUrl: "drawposition.html",
      controller: "drawpositionController"
    }).then(function(modal) {

      modal.element.modal();
      modal.close.then(function(result) {

      });
    });
  };
  $scope.advancedQueryDialog = function(){
    ModalService.showModal({
      templateUrl: 'advancedquery.html',
      controller: "advancedqueryController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
      });
    });
  };

  //control mapas base
  $scope.dynamicPopover = {
    templateUrl: 'app/estudio/TOC/toc.html'
  };

  $scope.placement = {
    options: [
      'top',
      'top-left',
      'top-right',
      'bottom',
      'bottom-left',
      'bottom-right',
      'left',
      'left-top',
      'left-bottom',
      'right',
      'right-top',
      'right-bottom'
    ],
    selected: 'bottom-left'
  };

  $scope.htmlPopover = $sce.trustAsHtml('<b style="color: red">I can</b> have <div class="label label-success">HTML</div> content');


  //control global de unidades de distancia
  $scope.undistancia = [
    "Metros",
    "Kilometros",
    "Millas",
    "Grados",
    "Radianes"
  ];

  $scope.tipos = ('Punto Linea Poligono').split(' ').map(function(tipo) {
    return {descripcion: tipo};
  });
  //controla el abrir o cerrar la tabla de atributos
  $scope.layout = {
    tablalayout: false,
    mapalayout: true
  };
  $scope.toggle = function(which,layerId) {
    //alert(which+' '+layerId);
    $scope.layout[which] = !$scope.layout[which];

    if(which=='tablalayout'){
      if(layerId!=null){
        layerId=parseInt(layerId);
        if(layerId!=$rootScope.currentLayerId){
          if($('#tb-'+$rootScope.currentLayerId).hasClass('onTable')){
            $('#tb-'+$rootScope.currentLayerId).removeClass('onTable');
          }
          //tableLayoutIsOpen=false;
        }
        if(tableLayoutIsOpen){
          if($('#tb-'+layerId).hasClass('onTable')){
            $('#tb-'+layerId).removeClass('onTable');
          }
          tableLayoutIsOpen=false;
          $scope.dataInfo.length=0;
          var obj='{}';
          tableColsName=[];
          fillTable(tableColsName,obj);
          $scope.nombreCapa="";
        }else{
          if(!$('#tb-'+layerId).hasClass('onTable')){
            $('#tb-'+layerId).addClass('onTable');
          }
          $rootScope.currentLayerId=layerId;
          loadTable(layerId);
          tableLayoutIsOpen=true;
          //Get the layer name by layerId
          var name=geoOperation.getNamebyID(layerId,$scope.capas);
          $scope.nombreCapa=name;
        }

      }else{
        if($('#tb-'+$rootScope.currentLayerId).hasClass('onTable')){
          $('#tb-'+$rootScope.currentLayerId).removeClass('onTable');
        }
        tableLayoutIsOpen=false;
        $scope.dataInfo.length=0;
        var obj='{}';
        tableColsName=[];
        fillTable(tableColsName,obj);
        $scope.nombreCapa="";
      }
    }
  };
  function loadTable(layerId){
    tableRows={};
    tableColsName=[];
    var propsName;
    $scope.selectTableColumn=[];
    leafletData.getMap("mapabase").then(function(map) {
      map.eachLayer(function (layer) {
        if (layer._leaflet_id === layerId) {
          var layers=layer._layers;
          angular.forEach(layers, function(value, key){
            try{
              var len=Object.keys(layers[key].feature.properties).length;
              if(len>0){
                //Get layer feature properties
                propsName=layers[key].feature.properties;
                return false;
              }
            }catch(err){

            }
          });
          var i=0;
          angular.forEach(propsName, function(value, key){
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
                                tableColsName[i]=key;
                                $scope.selectTableColumn.push({id:i,field:key});
                                i++;
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
          //console.log($scope.selectTableColumn);
          var rows = Object.keys(layers).length;
          var cols=tableColsName.length;
          tableRows=new Array(rows);
          for (var i = 0; i < rows; i++){
            tableRows[i]=new Array(cols);
          }
          var z=0;
          var j=0;
          angular.forEach(layers, function(value, key){
            var arrInfo=layers[key].feature.properties;
            angular.forEach(arrInfo, function(value, key){
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
                                  if(key!="$$hashKey"){
                                    tableRows[z][j]=value;
                                    j++;
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
              }
            });
            z++;
            j=0;
          });
          if(tableRows.length!=0&&tableColsName.length!=0){
            var obj='{';
            //console.log(tableColsName);
            //console.log(tableRows);
            for(var i=0;i<tableRows.length;i++){
              for(var j=0;j<tableRows[i].length;j++){
                if(tableColsName[j]!=""&&typeof(tableColsName[j]) != "undefined"){
                  obj=obj+'"'+tableColsName[j]+'" : "'+geoOperation.escapeHtml(tableRows[i][j])+'",';
                }
                obj = obj.replace("undefined", "");
              }
              obj = obj.substring(0, obj.length - 1);
              obj=obj+'},{';
            }
            obj = obj.substring(0, obj.length - 1);
            obj = obj.substring(0, obj.length - 1);
            /*$scope.dataColum=tableColsName;
            $scope.dataTable=obj;*/
            //console.log(obj);
            fillTable(tableColsName,obj);
          }else{

            //console.log(tableColsName);
            //console.log(tableRows);
            var obj='{';
            for(var i=0;i<rows;i++){
              obj=obj+'},{';
            }
            obj = obj.substring(0, obj.length - 1);
            obj = obj.substring(0, obj.length - 1);
            /*$scope.dataColum=tableColsName;
            $scope.dataTable=obj;*/
            fillTable(tableColsName,obj);
          }
        }
      });
    });
  }
  function fillTable(tableColsName,obj){
    $scope.dataColum=tableColsName;
    $scope.columnInfo=[];
    $scope.columnInfo.length = 0;

    for(var i=0;i<$scope.dataColum.length;i++){
      $scope.columnInfo.push({name:$scope.dataColum[i],field:$scope.dataColum[i],enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:true});
    }
    $scope.gridOptions.columnDefs=$scope.columnInfo;
    //console.log($scope.columnInfo);
    var object = "[" + obj + "]"; // 'Encapsulate object with square brackets '[]' and then I could use JSON.parse to then parse the new string into a JSON object...
    object = angular.fromJson(object);
    $scope.dataInfo = object;
    $scope.gridApi.core.refresh();
  }
  $scope.showDialogRmCol = function(value) {
    //var value=$scope.ddlvalue;
    //console.log(value);
    if($scope.selectTableColumn.length!=0){
      if(value!=0&&value!=$scope.selectedLayerName){
        $("#columnValue").val(value);
        $('#dialog-rmcol').dialog('open');
      }else{
        alert("Debe seleccionar un campo.");
      }
    }
  };
  //Remove column from attribute table
  function removeColumn(columnName) {
    try{
      for(var i=0;$scope.columnInfo.length;i++){
        if(columnName==$scope.columnInfo[i].field){
          $scope.columnInfo.splice(i, 1);
          break;
        }
      }
      for(var i=0;$scope.selectTableColumn.length;i++){
        if(columnName==$scope.selectTableColumn[i].field){
          $scope.selectTableColumn.splice(i, 1);
          break;
        }
      }
      $scope.gridOptions.columnDefs=$scope.columnInfo;
      for(var i=0;i<$scope.dataInfo.length;i++){
        delete $scope.dataInfo[i][columnName];
        delete $scope.dataInfo[i].$$hashKey;
      }
      leafletData.getMap("mapabase").then(function(map) {
        map.eachLayer(function (layer) {
          if (layer._leaflet_id ===  $rootScope.currentLayerId) {
            angular.forEach(layer._layers, function(value, key){
              try{
                //Remove property name with the selected columnName to delete
                delete layer._layers[key].feature.properties[columnName];
              }catch(err){

              }
            });
            angular.forEach(layer._layers, function(value, key){
              geoOperation.bindPopup(layer._layers[key]);
            });
            $scope.ddlvalue = 0;
            $scope.selectedLayerName=columnName;
          }
        });
      });
    }catch(err){
      //alert("Debe seleccionar un campo.");
    }
  }
  //show dialog to save map
  $scope.showDialogSaveMap = function(){
    var cont=0;
    for(var i=0;i<$rootScope.capas.length;i++){
      if($rootScope.capas[i].enabled){
        cont=cont+1;
      }
    }
    if(cont>0){
      angular.element('#map_title').css('border', 'none');
      $("#map_title").val("");
      $("#map_des").val("");
      $('#dialog-savemap').dialog('open');
    }else{
      alert("Debe haber por lo menos una capa activa en el toc para guardar el mapa.");
    }
  };
  //show dialog save layer
  $scope.showDialogSaveLayer = function(layerId,layerName){
    $("#layername").val(layerName);
    $("#layerid").val(layerId);
    $('#dialog-savelayer').dialog('open');
  };
  //Save layer to the cloud or database
  function saveLayerToCloud(layerId,layerName,layerDes){
    var layerId=parseInt(layerId);
    layerDes=layerDes.trim();
    var f=geoOperation.layerIsStoredByUsernameAndName($rootScope.username,layerName);
    //console.log(f);

    if(f==false){
      leafletData.getMap("mapabase").then(function(map) {
        $rootScope.m=map;
        $rootScope.m.spin(true);
        map.eachLayer(function (layer) {
          if (layer._leaflet_id === parseInt(layerId)) {
            var geoJson=layer.toGeoJSON();//Convert the layer to geojson
            var text=JSON.stringify(geoJson);//Convert the geojson to text
            var json=JSON.parse(text);
            //console.log(text);
            var tipo=geoOperation.getTypeGeometry(json);
            var imgTipo='';
            if(tipo=='FeatureCollection'){
              imgTipo=fcollection_img;
            }else if(tipo=='Point'){
              imgTipo=punto_img;
            }else if(tipo=='LineString'){
              imgTipo=linea_img;
            }else if(tipo=='Polygon'){
              imgTipo=poligono_img;
            }else{
              imgTipo=fcollection_img;
            }
            var dt = new Date();
            var m = dt.getUTCMonth() + 1; //months from 1-12
            var d = dt.getUTCDate();
            var year = dt.getUTCFullYear();
            if(m<10){
              m="0"+m;
            }
            if(d<10){
              d="0"+d;
            }
            var h=dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
            //var dateTime=d+'-'+m+'-'+year+" "+h;
            var dateTime=year+'-'+m+'-'+d+" "+h;
            var capa={id:null,nombre:layerName,usuario:$rootScope.username,empresa:$rootScope.company,descripcion:layerDes,type:imgTipo,features:text,createdDate:dateTime};
            Capa.save(capa, onSaveSuccess, onSaveError);
          }
        });
      });
    }else{
      $("#layerName").val(layerName);
      $("#layerId").val(layerId);
      $('#dialog-updatelayer').dialog('open');
    }
  };

  //Save layer to the cloud or database in a synchronous way
  function saveLayerToCloudSync(layerId,layerName,layerDes){
    var layerId=parseInt(layerId);
    layerDes=layerDes.trim();

    $rootScope.m.spin(true);
    $rootScope.m.eachLayer(function (layer) {
      if (layer._leaflet_id === parseInt(layerId)) {
        var geoJson=layer.toGeoJSON();//Convert the layer to geojson
        var text=JSON.stringify(geoJson);//Convert the geojson to text
        var json=JSON.parse(text);
        //console.log(text);
        var tipo=geoOperation.getTypeGeometry(json);
        var imgTipo='';
        if(tipo=='FeatureCollection'){
          imgTipo=fcollection_img;
        }else if(tipo=='Point'){
          imgTipo=punto_img;
        }else if(tipo=='LineString'){
          imgTipo=linea_img;
        }else if(tipo=='Polygon'){
          imgTipo=poligono_img;
        }else{
          imgTipo=fcollection_img;
        }

        $.ajax({
          async: false,
          type: "POST",
          url: $rootScope.host+"/api/capas",
          /*beforeSend : function(jqXHR, settings) {
          jqXHR.setRequestHeader(header, token);
        },*/
        data:JSON.stringify({id:null,nombre:layerName,empresa:$rootScope.company,usuario:$rootScope.username,type:imgTipo,descripcion:layerDes,features:text}),
        dataType: 'json',
        contentType: 'application/json',
        success: function(result) {
         // console.log(result);
          $rootScope.capasDb.push({id:result.id,nombre:result.nombre,descripcion:result.descripcion,tipo:result.type,isChecked:false});
          $rootScope.m.spin(false);
          layerIDs=layerIDs+result.id+",";
        },
        error: function (xhr, ajaxOptions, thrownError) {
         // console.log(xhr.status + ": " + thrownError);
          $rootScope.m.spin(false);
        }
      });
    }
  });
}
//Fill the main view with stored layer from the cloud or database
function loadLayersFromCloud(){
  $.ajax({
    async: false,
    type: "GET",
    url: $rootScope.host+"/api/capas/getCapas/"+$rootScope.username,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result) {
      var returnOb = angular.fromJson(result);
      //console.log(returnOb);
      if(returnOb!=null){
        for(var i=0;i<returnOb.length;i++){
          $rootScope.capasDb.push({id:returnOb[i].id,nombre:returnOb[i].nombre,descripcion:returnOb[i].descripcion,tipo:returnOb[i].type,isChecked:false});
        }

      }
    },error: function(xhr) {
     // console.log(xhr);
      //console.clear();
    }
  });
}
//Fill the main view with stored requirement layers from the cloud or database
function loadRequirementLayersFromCloud(){
  try{
    var dt = new Date();
    var m = dt.getUTCMonth() + 1; //months from 1-12
    var d = dt.getUTCDate();
    var year = dt.getUTCFullYear();

    if(m<10){
      m="0"+m;
    }
    if(d<10){
      d="0"+d;
    }
    var dateTime=year+'-'+m+'-'+d;
    $.ajax({
      async: false,
      type: "GET",
      url: $rootScope.host+"/api/requirements/getRequirement/"+$rootScope.company+"/"+dateTime,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (result) {
        var returnOb = angular.fromJson(result);
        console.log(returnOb);
        if(returnOb!=null){
          for(var i=0;i<returnOb.length;i++){
            //Fill the capasreqDb array with the stored requirement layers
            $rootScope.capasreqDb.push({id:returnOb[i].id,nombre:returnOb[i].reqid,isChecked:false});
          }
        }
      },error: function(xhr) {
        console.log(xhr);
        //console.clear();
      }
    });
  }catch(err){

  }
}
//Fill the main view with stored maps in the cloud or database
function loadMapsFromCloud(){
  $.ajax({
    async: false,
    type: "GET",
    url: $rootScope.host+"/api/mapas/getMapas/"+$rootScope.username,//Implementar en el servidor el metodo getmapas por usuario en java
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result) {
      var returnOb = angular.fromJson(result);
      //console.log(returnOb);
      if(returnOb!=null){
        for(var i=0;i<returnOb.length;i++){
          $rootScope.mapas.push({id:returnOb[i].id,titulo:returnOb[i].titulo,descripcion:returnOb[i].descripcion,tipo:map_img,isprivate:returnOb[i].esprivado,isChecked:false});
        }
      }
    },error: function(xhr) {
     // console.log(xhr);
      //console.clear();
    }
  });

}
//Fill the main view with stored apps in the cloud or database
function loadAppsFromCloud(){
  $.ajax({
    async: false,
    type: "GET",
    url: $rootScope.host+"/api/aplicacions/getApps/"+$rootScope.username,//implementar al lado del servidor de java
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result) {
      var returnOb = angular.fromJson(result);
      //console.log(returnOb);
      if(returnOb!=null){
        for(var i=0;i<returnOb.length;i++){
          $rootScope.apps.push({id:returnOb[i].id,titulo:returnOb[i].titulo,descripcion:returnOb[i].descripcion,tipo:app1_img,espublico:returnOb[i].espublico,isChecked:false});
        }
      }
    },error: function(xhr) {
     // console.log(xhr);

    }
  });
}
//Share selected app
$scope.shareSelectedApp = function() {
  if($rootScope.apps.length>0){
    var cont=0;
    for(var i=0;i<$rootScope.apps.length;i++){
      var id=$rootScope.apps[i].id;
      if($rootScope.apps[i].isChecked){
        cont=cont+1;
      }
    }
    if(cont==1){
      shareApp();
    }else{
      alert('Debe seleccionar una app de la lista.');
    }
  }
};
function shareApp(){
  for(var i=0;i<$rootScope.apps.length;i++){
    var id=$rootScope.apps[i].id;
    if($rootScope.apps[i].isChecked){
      $('#mapid').val(id);
      var url=$rootScope.host+"/#/apps?appId="+id;
      $scope.shareurlapp=url;
      $.ajax({
        async: false,
        type: "GET",
        url: $rootScope.host+"/api/aplicacions/"+id,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
         // console.log(data);
          $scope.checkboxModel.valueShareApp=data.espublico;
        },error: function(xhr) {
         // console.log(xhr);
          //console.clear();
        }
      });
      $('#dialog-shareapp').dialog('open');
    }
  }
}
//Get account credentials from mongodb (login, first_name, last_name, email, ....)
function getAccount() {
  Principal.identity().then(function(account) {
    //console.log(account);
    $rootScope.username=account.login;
    //$analytics.setUsername($rootScope.username);
    //$analytics.setAlias($rootScope.username);
    $rootScope.mail=account.email;
    if(account.businessType!=null){
      $rootScope.company=account.businessType;
    }
    if(account.isAdmin){
      $scope.showSection=true;
      $scope.showTrackSection=true;
      loadCompanyUsers(account.businessType);
    }
    vm.account = account;
    vm.settingsAccount = copyAccount(account);
    /*if(vm.settingsAccount.businessType=='Personal'){
      $scope.chkbusiness=false;
      $scope.showTrackSection=false;
    }else{
      $scope.chkbusiness=true;
    }*/
    //Load the stored layers in the cloud or database
    loadLayersFromCloud();
    loadMapsFromCloud();
    loadAppsFromCloud();
    loadBaseMap();
    loadRequirementLayersFromCloud();
    loadCosts();
  });
}
var copyAccount = function (account) {
   return {
      activated: account.activated,
      countryCode: account.countryCode,
      businessName: account.businessName,
      businessType: account.businessType,
      email: account.email,
      firstName: account.firstName,
      langKey: account.langKey,
      lastName: account.lastName,
      login: account.login
    };
};
//Get all the users from a company by companyCode
function loadCompanyUsers(companyCode){
  $.ajax({
    async: false,
    type: "GET",
    url: $rootScope.host+"/api/users/"+companyCode,//GET all the stored user layers from mongo database in a synchronously way
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {

      objArr = angular.fromJson(data);
      if(objArr!=null){
         for(var i=0;i<objArr.length;i++){
           var name='';
           if(objArr[i].firstName!=null){
             name=objArr[i].firstName;
             if(objArr[i].lastName!=null){
                name=name+' '+objArr[i].lastName;
             }
           }
           var email=objArr[i].email;
           //var business=objArr[i].businessType;
           var business="";
           try{
             business=objArr[i].businessName;
             if(businessName==null){
                business="";
             }
           }catch(err){

           }

           var activated=objArr[i].activated;
           var login=objArr[i].login;
           $scope.dataUsers.push({Nombre:name,Usuario:login,Email:email,Empresa:business,isActive:activated});
         }
         //console.log($scope.dataUsers);
       }
    },
    error: function(xhr) {
      console.log(xhr);
      //console.clear();
    }
  });
}
//Enable user by admin method in case of a corporate plan
$scope.enableUser = function(usuario,isActive) {
  $.ajax({
    async: false,
    type: "PUT",
    url: $rootScope.host+"/api/users/"+usuario+"/"+isActive,
    success: function (result) {
      console.log(result);
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.status + ": " + thrownError);
    }
  });
}
//Load defined stored costs for the routes
function loadCosts(){
  vm.settingsCost.businesscode=$rootScope.company;
  Cost1.get({businesscode:vm.settingsCost.businesscode},function(result){
    try{
      vm.settingsCost.costoRecogida1=result.costoRecogida1;
      vm.settingsCost.costoRecogida2=result.costoRecogida2;
      vm.settingsCost.costoRecogida3=result.costoRecogida3;
      vm.settingsCost.costoEntrega1=result.costoEntrega1;
      vm.settingsCost.costoEntrega2=result.costoEntrega2;
      vm.settingsCost.costoEntrega3=result.costoEntrega3;
    }catch(err){}
  },
  function(){
      vm.settingsCost.costoRecogida1=0;
      vm.settingsCost.costoRecogida2=0;
      vm.settingsCost.costoRecogida3=0;
      vm.settingsCost.costoEntrega1=0;
      vm.settingsCost.costoEntrega2=0;
      vm.settingsCost.costoEntrega3=0;
  });
}
//Modify costs for the routes
function changeCost(){
  Cost1.get({businesscode:vm.settingsCost.businesscode},function(result){
      var cost={id:result.id,businessCode:vm.settingsCost.businesscode,costoRecogida1:vm.settingsCost.costoRecogida1,costoRecogida2:vm.settingsCost.costoRecogida2,costoRecogida3:vm.settingsCost.costoRecogida3,costoEntrega1:vm.settingsCost.costoEntrega1,costoEntrega2:vm.settingsCost.costoEntrega2,costoEntrega3:vm.settingsCost.costoEntrega3};
      Cost.update(cost, onSaveCostSucess, onSaveCostError);
  },
  function(){
    var cost={id:null,businessCode:vm.settingsCost.businesscode,costoRecogida1:vm.settingsCost.costoRecogida1,costoRecogida2:vm.settingsCost.costoRecogida2,costoRecogida3:vm.settingsCost.costoRecogida3,costoEntrega1:vm.settingsCost.costoEntrega1,costoEntrega2:vm.settingsCost.costoEntrega2,costoEntrega3:vm.settingsCost.costoEntrega3};
    Cost.save(cost, onSaveCostSucess, onSaveCostError);
  });
}
function onSaveCostSucess(){
   vm.error1 = null;
   vm.success1 = 'OK';
}
function onSaveCostError(s){
   console.log(s);
   vm.success1 = null;
   vm.error1 = 'ERROR';
}
//Update logged user information
function save () {
  Auth.updateAccount(vm.settingsAccount).then(function() {
    vm.error = null;
    vm.success = 'OK';
    Principal.identity(true).then(function(account) {
      vm.settingsAccount = copyAccount(account);
    });
    JhiLanguageService.getCurrent().then(function(current) {
      if (vm.settingsAccount.langKey !== current) {
        $translate.use(vm.settingsAccount.langKey);
      }
    });
  }).catch(function() {
    vm.success = null;
    vm.error = 'ERROR';
  });
}
//Function to update the layer in the cloud or database
function updateLayer(layerId,layername,layerDes){
  var features = [];//Array for features
  var val=geoOperation.getLayerVal($rootScope.username,layername);//get stored layer Id from the database
  var newFc='';
  var imgTipo='';
  isUpdating=true;
  layerDes=layerDes.trim();
  //leafletData.getMap("mapabase").then(function(map) {
  //$rootScope.m=map;
  $rootScope.m.spin(true);
  //map.spin(true);
  $rootScope.m.eachLayer(function (layer) {
    if (layer._leaflet_id === parseInt(layerId)) {

      var geoJson=layer.toGeoJSON();//Convert the layer to geojson
      var text=JSON.stringify(geoJson);//Convert the geojson to text
      var json=JSON.parse(text);
      var tipo=geoOperation.getTypeGeometry(json);
      if(tipo=='FeatureCollection'){
        imgTipo=fcollection_img;
      }else if(tipo=='Point'){
        imgTipo=punto_img;
      }else if(tipo=='LineString'){
        imgTipo=linea_img;
      }else if(tipo=='Polygon'){
        imgTipo=poligono_img;
      }else{
        imgTipo=fcollection_img;
      }

      angular.forEach(geoJson.features, function(value, key){
        if(geoJson.features[key].properties!=null){
          var len=Object.keys(geoJson.features[key].properties).length;
          if(len==0){
            geoJson.features[key].properties=null;
          }
        }
        features.push(geoJson.features[key]);
      });
    }
  });
  if(features.length>0){
    var fc = turf.featureCollection(features);
    newFc=JSON.stringify(fc);

    var capa={id:val,nombre:layername,usuario:$rootScope.username,empresa:$rootScope.company,descripcion:layerDes,type:imgTipo,features:newFc};
    Capa.update(capa, onSaveSuccess, onSaveError);
  }
  //});
}

//Function to update the layer in the cloud or database when it a map is saving or updating
function updateLayerToCloud(layerId,layername,layerDes){
  var features = [];//Array for features
  var val=geoOperation.getLayerVal($rootScope.username,layername);//get stored layer Id from the database
  var newFc='';
  var imgTipo='';
  isUpdating=true;
  layerDes=layerDes.trim();
  $rootScope.m.spin(true);
  $rootScope.m.eachLayer(function (layer) {
    if (layer._leaflet_id === parseInt(layerId)) {

      var geoJson=layer.toGeoJSON();//Convert the layer to geojson
      var text=JSON.stringify(geoJson);//Convert the geojson to text
      var json=JSON.parse(text);
      var tipo=geoOperation.getTypeGeometry(json);
      if(tipo=='FeatureCollection'){
        imgTipo=fcollection_img;
      }else if(tipo=='Point'){
        imgTipo=punto_img;
      }else if(tipo=='LineString'){
        imgTipo=linea_img;
      }else if(tipo=='Polygon'){
        imgTipo=poligono_img;
      }else{
        imgTipo=fcollection_img;
      }

      angular.forEach(geoJson.features, function(value, key){
        if(geoJson.features[key].properties!=null){
          var len=Object.keys(geoJson.features[key].properties).length;
          if(len==0){
            geoJson.features[key].properties=null;
          }
        }
        features.push(geoJson.features[key]);
      });
    }
  });
  if(features.length>0){
    var fc = turf.featureCollection(features);
    newFc=JSON.stringify(fc);

    var capa={id:val,nombre:layername,usuario:$rootScope.username,empresa:$rootScope.company,descripcion:layerDes,type:imgTipo,features:newFc};
    Capa.update(capa, onUpdateSuccess, onUpdateError);
  }
}
function onUpdateSuccess (result) {
  //console.log(result);
  $scope.$emit('smallgisApp:capaUpdate', result);
  for(var i=0;i<$rootScope.capasDb.length;i++){
    if($rootScope.capasDb[i].id==result.id){
      $rootScope.capasDb[i].descripcion=result.descripcion;
      $rootScope.capasDb[i].tipo=result.type;
    }
  }
  $rootScope.m.spin(false);
}
function onUpdateError() {
}
function onSaveSuccess (result) {
  //console.log(result);
  $scope.$emit('smallgisApp:capaUpdate', result);
  if(result.id!=null&&isUpdating==false){
    $rootScope.capasDb.push({id:result.id,nombre:result.nombre,descripcion:result.descripcion,tipo:result.type,isChecked:false});
  }else{
    for(var i=0;i<$rootScope.capasDb.length;i++){
      if($rootScope.capasDb[i].id==result.id){
        $rootScope.capasDb[i].descripcion=result.descripcion;
        $rootScope.capasDb[i].tipo=result.type;
      }
    }
  }
  isUpdating=false;
  $rootScope.m.spin(false);
  $("#layerDes").val("");
}

function onSaveError () {
  //vm.isSaving = false;
  isUpdating=false;
}
function onReqSaveError() {

}
function onReqSaveSuccess(result) {
  //console.log(result);
  arrReqPts=[];
  $scope.$emit('smallgisApp:requirementUpdate', result);
  if(result.id!=null){
    $rootScope.capasreqDb.push({id:result.id,nombre:result.reqid,isChecked:false});
  }
}
function onReqSaveSuccess2(result) {
  $scope.$emit('smallgisApp:requirementUpdate', result);
  if(result.id!=null){
    $rootScope.capasreqDb.push({id:result.id,nombre:result.reqid,isChecked:false});
    isOriginAdded=false;
  }
}
function onReqUpdateSuccess(result) {
  $scope.$emit('smallgisApp:requirementUpdate', result);
}
function onReqUpdateSuccess2(result) {
  $scope.$emit('smallgisApp:requirementUpdate', result);
  isOriginAdded=false;
}
function onReqUpdateError(){

}
//Save map to the cloud or database
function saveMapToCloud(mapTitle,mapDes){
  if(mapTitle!=""){
    layerIDs="";
    for(var i=0;i<$rootScope.capas.length;i++){
      if($rootScope.capas[i].enabled){
        var layername=$rootScope.capas[i].nombre;
        var layerid=$rootScope.capas[i].id;
        var layerdes=$rootScope.capas[i].descripcion;
        layername=layername.trim();
        var f=geoOperation.layerIsStoredByUsernameAndName($rootScope.username,layername);
        if(f){
          var LId=geoOperation.getLayerVal($rootScope.username,layername);//get stored layer Id from the cloud
          if(LId!=null){
            var b=checkLayerGeojson(layerid, LId);
            if(b==false){
              if(confirm('Desea reemplazar la capa '+layername+' en la base de datos?')){
                updateLayerToCloud(layerid,layername,layerdes);
              }
            }
            layerIDs=layerIDs+LId+",";
          }
        }else{
          if(confirm('La capa '+layername+' no esta guardada en la base de datos. Desea guardar la capa?')){
            saveLayerToCloudSync(layerid,layername,layerdes);
          }
        }
        //$('#dialog-savemap').dialog('close');
      }
    }
    $('#dialog-savemap').dialog('close');
    layerIDs = layerIDs.substring(0, layerIDs.length - 1);
    layerIDs=layerIDs.trim();
    var mArrLayerIds=[];
    if(layerIDs!=""){
      mArrLayerIds = layerIDs.split(',');
    }

    if(mArrLayerIds.length>0){
      mapTitle=mapTitle.trim();
      mapDes=mapDes.trim();
      var fm=geoOperation.mapIsStoredByUsernameAndTitle($rootScope.username,mapTitle);//Validates that if the map is stored in the cloud or database
      if(fm){
        if(confirm('Desea reemplazar el mapa existente?')){
          isUpdatingMap=true;
          var val=geoOperation.getMapVal($rootScope.username,mapTitle);
          var mapa={id:val,titulo:mapTitle,empresa:$rootScope.company,usuario:$rootScope.username,descripcion:mapDes,capas:layerIDs};
          Mapa.update(mapa, onSaveSuccessMap, onSaveErrorMap);
        }
      }else{
        var mapa={id:null,titulo:mapTitle,empresa:$rootScope.company,usuario:$rootScope.username,descripcion:mapDes,capas:layerIDs};
        Mapa.save(mapa, onSaveSuccessMap, onSaveErrorMap);
      }
    }else{
      alert("El mapa no se puede guardar porque no contiene ninguna capa.");
    }
  }else{
    angular.element('#map_title').css('border', '2px solid red');
    angular.element('#map_title').focus();
    alert("El titulo del mapa no puede ser vacio.");
  }
}

function onSaveSuccessMap (result) {
  $scope.$emit('smallgisApp:mapaUpdate', result);
  if(result.id!=null&&isUpdatingMap==false){
    $rootScope.mapas.push({id:result.id,titulo:result.titulo,descripcion:result.descripcion,tipo:map_img,isprivate:result.esprivado,isChecked:false});
  }else{
    for(var i=0;i<$rootScope.mapas.length;i++){
      if($rootScope.mapas[i].id==result.id){
        $rootScope.mapas[i].descripcion=result.descripcion;
        $rootScope.mapas[i].esprivado=result.esprivado;
      }
    }
  }
  isUpdatingMap=false;
  $("#map_title").val("");
  $("#map_des").val("");
}

function onSaveErrorMap () {
  isUpdatingMap=false;
}
//Save app to database or cloud
function saveAppToCloud(mapId,appTitle,appDes){
  if(appTitle!=""){
    appTitle=appTitle.trim();
    appDes=appDes.trim();
   // console.log(mapId+" "+appTitle+" "+appDes+" "+isAppPublic+" "+$scope.seltypeapp);
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    var time=now.getHours()+":"+ now.getMinutes()+":"+now.getSeconds();
    var dateTime=today+" "+time;
    $('#dialog-saveapp').dialog('close');
    var appIsSaved=geoOperation.appIsStoredByUsernameAndTitle($rootScope.username,appTitle);//Validates if the app is stored in the cloud or database
    if(appIsSaved){
      if(confirm('Desea reemplazar el app existente?')){
        isUpdatingApp=true;
        var appId=geoOperation.getAppId($rootScope.username,appTitle);
        var app={id:appId,titulo:appTitle,mapid:mapId,empresa:$rootScope.company,usuario:$rootScope.username,descripcion:appDes,tipoApp:$scope.seltypeapp,espublico:isAppPublic,fecha:dateTime};
        Aplicacion.update(app,onSaveSuccessApp, onSaveErrorApp);
      }
    }else{
      var app={id:null,titulo:appTitle,mapid:mapId,empresa:$rootScope.company,usuario:$rootScope.username,descripcion:appDes,tipoApp:$scope.seltypeapp,espublico:isAppPublic,fecha:dateTime};
      Aplicacion.save(app,onSaveSuccessApp, onSaveErrorApp);
    }

  }else{
    angular.element('#app_title').css('border', '2px solid red');
    angular.element('#app_title').focus();
    alert("El titulo del mapa no puede ser vacio.");
  }
}
function onSaveSuccessApp(result) {
  $scope.$emit('smallgisApp:mapaUpdate', result);
  if(result.id!=null&&isUpdatingApp==false){
    $rootScope.apps.push({id:result.id,titulo:result.titulo,descripcion:result.descripcion,tipo:app1_img,espublico:result.espublico,isChecked:false});
  }else{
    for(var i=0;i<$rootScope.apps.length;i++){
      if($rootScope.apps[i].id==result.id){
        $rootScope.apps[i].descripcion=result.descripcion;
        $rootScope.apps[i].espublico=result.espublico;
      }
    }
  }
  $("#app_title").val("");
  $("#app_des").val("");
  $("#mapid").val("");
  isAppPublic=false;
  $scope.seltypeapp="basic";
  $scope.checkboxModel.valueCreateApp=false;
  isUpdatingApp=false;
}

function onSaveErrorApp() {
  isUpdatingApp=false;
}
//Add column to the attribute table
$scope.addColumn = function(columnName) {
  try{
    if(columnName!=""){
      var repetido=false;
      var i=0;
      while(i<$scope.columnInfo.length&&repetido==false){
        if($scope.columnInfo[i].field.toLowerCase()===columnName.toLowerCase()){
          repetido=true;
        }
        i=i+1;
      }
      if(repetido==true){
        alert("Debe agregar la columna con otro nombre.");
      }else{
        //Replace characters .,$,'' in columName variable
        columnName=geoOperation.replaceAll(columnName, ".", "_" );
        columnName=geoOperation.replaceAll(columnName, "$", "_" );
        columnName=geoOperation.replaceAll(columnName, "''", "_" );
        $scope.columnInfo.push({ field: columnName, enableSorting: false, editable:true, cellEditableCondition:true});
        $scope.gridOptions.columnDefs=$scope.columnInfo;
        $scope.ddlvalue = 0;
        //$scope.columname="";
        var tableRows={};
        var tableColsName={};

        leafletData.getMap("mapabase").then(function(map) {
          map.eachLayer(function (layer) {
            if (layer._leaflet_id === $rootScope.currentLayerId) {
              for(var i=0;i<$scope.dataInfo.length;i++){
                delete $scope.dataInfo[i].$$hashKey;
              }
              angular.forEach(layer._layers, function(value, key){
                try{

                  var objson='{';
                  angular.forEach(layer._layers[key].feature.properties, function(value1, key1){
                    var nValue=geoOperation.parseNumber(value1);
                    if(nValue==null){
                      objson=objson+'"'+key1+'" : "'+value1+'",';
                    }else{
                      objson=objson+'"'+key1+'" : '+nValue+',';
                    }

                  });
                  objson=objson+'"'+columnName+'" : ""}';
                  var obj = angular.fromJson(objson);
                  layer._layers[key].feature.properties=obj;
                  geoOperation.bindPopup(layer._layers[key]);
                }catch(err){
                  console.log(err);
                }
              });
              //console.log(layer._layers);

            }
          });
        });
      }
    }
  }catch(err){
    console.log(err);
  }
}
$scope.gridOptions.onRegisterApi = function(gridApi){
  //set gridApi on scope
  $scope.gridApi = gridApi;
  gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
    //console.log(currentLayerID);
   // console.log('edited: '+ colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue) ;
    if(newValue!=oldValue){
      var index1 = $scope.dataInfo.indexOf(rowEntity);
     // console.log("index1="+index1);
      //console.log($scope.dataInfo);
      var features = [];
      var arrColors=[];
      var opacity=1;
      //console.log($scope.dataInfo);
      angular.forEach($scope.dataInfo, function(value, key){
        features.push($scope.dataInfo[key]);
        //console.log(key+"="+$scope.dataInfo[key]);
      });
      $scope.$apply();
      for(var i=0;i<features.length;i++){
        delete features[i].$$hashKey;
      }
      angular.forEach($scope.dataInfo[index1], function(value, key){
        //console.log(key+"="+value);
      });

      leafletData.getMap("mapabase").then(function(map) {
        map.eachLayer(function (layer) {
          if (layer._leaflet_id === $rootScope.currentLayerId) {
            try{
              angular.forEach(layer._layers[layerSelectedID].feature.properties, function(value, key){
                if(oldValue==null){
                  oldValue="";
                }
                if(newValue==null){
                  newValue="";
                }
                if(colDef.name==key&&String(value)==oldValue){
                  layer._layers[layerSelectedID].feature.properties[key]=newValue;
                  geoOperation.bindPopup(layer._layers[layerSelectedID]);
                }
              });
            }catch(err){
             // console.log(err);
            }
          }
        });
      });
    }
  });
  gridApi.edit.on.beginCellEdit($scope, function(rowEntity, colDef) {
    var index = $scope.dataInfo.indexOf(rowEntity);
    //console.log("index="+index);
    setFocusLayer(rowEntity, colDef, index);
  });
};
//Function to check the geoJson of two layers
function checkLayerGeojson(layerId, L_Id){
  var json1,json2;
  var b=true;
  //leafletData.getMap("mapabase").then(function(map) {
  $rootScope.m.eachLayer(function (layer) {
    if (layer._leaflet_id === parseInt(layerId)) {
      var geoJson=layer.toGeoJSON();//Convert the layer to geojson
      for(var i=0;i<geoJson.features.length;i++){
        angular.forEach(geoJson.features[i].properties, function(value, key){
          var val=geoOperation.parseNumber(geoJson.features[i].properties[key]);
          if(val!=null){
            geoJson.features[i].properties[key]=val;
          }
        });
      }
      //console.log(geoJson);
      json1=JSON.stringify(geoJson);//Convert the geojson to text
    }

  });
  $.ajax({
    async: false,
    type: "GET",
    url: $rootScope.host+"/api/capas/"+L_Id,//GET all the stored user layers from mongo database in a synchronously way
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
      //console.log(data.geojson[0].geometry.coordinates);
      var contents=data.features;
      var json = JSON.parse(JSON.stringify(eval("(" + contents + ")")));
      for(var k=0;k<json.features.length;k++){
        if(json.features[k].properties==null){
          json.features[k].properties={};
        }
        angular.forEach(json.features[k].properties, function(value, key){
          var val=geoOperation.parseNumber(json.features[k].properties[key]);
          //console.log(val);
          if(val!=null){
            json.features[k].properties[key]=val;
          }
        });
        for(var i=0;i<json.features[k].geometry.coordinates.length;i++){
          //console.log(json.features[k].geometry.coordinates[i]);
          for(var j=0;j<json.features[k].geometry.coordinates[i].length;j++){
            angular.forEach(json.features[k].geometry.coordinates[i][j], function(value, key){
              //console.log(key+"="+value);
              json.features[k].geometry.coordinates[i][j][key]=geoOperation.parseNumber(value);
            });
          }
        }
      }
      json2=JSON.stringify(json);//Convert the geojson to text
    }
  });
  /*console.log(json1);
  console.log("----------------------");
  console.log(json2);*/
  if(json1 !== json2){
    b=false;
  }
  return b;
  //});
}
function setFocusLayer(rowEntity, colDef, index){
  try{
    var colName=colDef.name;
    var val;
    if(rowEntity[colDef.name]==null){
      val="";
    }else{
      val=String(rowEntity[colDef.name]);
    }
    leafletData.getMap("mapabase").then(function(map) {
      map.eachLayer(function (layer) {
        if (layer._leaflet_id === $rootScope.currentLayerId) {
          var cont=0;

          angular.forEach(layer._layers, function(value, key){
            var properties=layer._layers[key].feature.properties;
            var propVal;
            if(properties[colName]==null){
              propVal="";
            }else{
              propVal=String(properties[colName]);
            }
            if(cont==index&&propVal===val){
              //console.log("key:"+key);
              var l=layer._layers[key];
              layerSelectedID=key;
              map.fitBounds(l.getBounds());
            }
            cont=cont+1;
          });
        }
      });
    });
  }catch(err){

  }
}
$scope.close = function(which) {
  $scope.layout[which] = true;
};
$scope.open = function(which) {
  $scope.layout[which] = false;
};
$scope.$on('ui.layout.loaded', function(){
  $timeout(function(){
    $scope.layout.tablalayout = true;
  });
});
//Assign requirement method
$scope.$on('assignreq', function(event, data){
  assignRequirement(data[0],data[1],data[2]);
  //Execute assign requirement method each 1 minute
  assignInterval=setInterval(function() { assignRequirement(data[0],data[1],data[2]); },60000);
});

var configurar = 'content/images/SVG/controls.svg';
$rootScope.originalFts=[];
$rootScope.mapas=[];//Stored maps in the database or cloud
$scope.mapabase=[]; //Array of base maps
$rootScope.tracks=[];//Array of the latest users tracked position
$rootScope.capas=[];//Array of layers in the toc
$rootScope.capasDb=[];//Stored layers in the database or cloud
$rootScope.apps=[];//Stored apps in the database or cloud
$rootScope.capasreq=[]//Requirement layers (layer of points)
$rootScope.capasreqDb=[];//Stored requirement layers in the database or cloud
//listar Apps de ejemplo en SideNav3
var app1_img = 'content/images/app.svg';


var layerAUXID=0;
function loadBaseMap(){
  leafletData.getMap("mapabase").then(function(map) {
    leafletData.getLayers().then(function(baselayers) {
      $scope.lcontrol=L.control.layers(baselayers.baselayers, baselayers.overlays);
      var i=0;
      var srcImg='';
      angular.forEach($scope.lcontrol._layers, function(value, key){
        var name=$scope.lcontrol._layers[key].name;
        var l=$scope.lcontrol._layers[key].layer;

        if(i==0){
          srcImg='content/images/mapabase/baseblanca.png';
          layerAUXID=key;
        }else if(i==1){
          srcImg='content/images/mapabase/cartoDBDarkMatter.png';
        }else if(i==2){
          srcImg='content/images/mapabase/EsriGreyLithg.png';
        }else if(i==3){
          srcImg='content/images/mapabase/Satelite.png';
        }else if(i==4){
          srcImg='content/images/mapabase/Topografico.png';
        }else if(i==5){
          srcImg='content/images/mapabase/Relieve.png';
        }else if(i==6){
          srcImg='content/images/mapabase/Vias.png';
        }
        $scope.mapabase.push({id:key,nombre:name,imagen:srcImg,capa:l});
        i=i+1;
      });
    });
  });
}
//Method to assignRequirement to a device
function assignRequirement(reqid,distance,capaId){
  distance=Number(distance);//Convert distance to number
  var arrTracks=getCompanyTracks($rootScope.company);//Method to get the last tracked user device position from the company
  for(var i=0;i<arrTracks.length;i++){
    var Xd=arrTracks[i].x;
    var Yd=arrTracks[i].y;
    var Zd=0;
    var device=arrTracks[i].clientId;//Device id
    var deviceStatus=arrTracks[i].status;//Device status (libre, ocupado)
    var reqStatus=arrTracks[i].reqstatus;//Device status (preasignado)
    if(deviceStatus!="ocupado"&&reqStatus!='preasignado'){
      $.ajax({
        async: false,
        type: "GET",
        url: $rootScope.host+"/api/requirements/"+reqid,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
          var returnOb = angular.fromJson(result);
          if(returnOb!=null){
            var val=returnOb.id;
            var company=returnOb.companyid;
            var reqDate=returnOb.fecha;
            var jsonPts=jQuery.parseJSON(JSON.stringify(eval("(" + returnOb.features + ")")));
            var arrDistances=[];//Calculated distances from the tracked points to the requirements points from the selected layer
            for(var j=0;j<jsonPts.points.length;j++){

              var nombre=jsonPts.points[j].point.nombre;

              var Xr=Number(jsonPts.points[j].point.x);
              var Yr=Number(jsonPts.points[j].point.y);
              var Xde=Number(jsonPts.points[j].point.x1);
              if(Xde==0){
                Xde="";
              }
              var Yde=Number(jsonPts.points[j].point.y1);
              if(Yde==0){
                Yde="";
              }

              var reqpickedup=jsonPts.points[j].point.recogido;//Picked up requerimient
              var st=jsonPts.points[j].point.status;//Requeriment status (nuevo, asignado, cerrado)
              if(st!='cerrado'){
                if(st!='asignado'){
                  if(st!='preasignado'){

                    var from = {
                      "type": "Feature",
                      "properties": {},
                      "geometry": {
                        "type": "Point",
                        "coordinates": [Xd, Yd]
                      }
                    };
                    var to = {
                      "type": "Feature",
                      "properties": {},
                      "geometry": {
                        "type": "Point",
                        "coordinates": [Xr, Yr]
                      }
                    };
                    var units = "kilometers";
                    var dist = turf.distance(from, to, units);
                    //alert("disp:"+device);
                    if(dist<distance){
                      arrDistances.push({device:device,reqName:nombre,Xd:Xd,Yd:Yd,Zd:Zd,Xr:Xr,Yr:Yr,Xde:Xde,Yde:Yde,distance:dist});
                    }
                  }
                }
              }
            }
            if(arrDistances.length!=0){
              //it calculates the shortest distance
              var m=arrDistances[0];
              var i=1;
              while(i<arrDistances.length){
                if(arrDistances[i].distance<m.distance){
                  m=arrDistances[i];
                }
                i++;
              }
              //console.log(nombre);
              //console.log(m);

              var dt = new Date();
              var hA=dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();//Assign time
              var dispositivo=m.device;
              var reqName=m.reqName;
              var xd=m.Xd;
              var yd=m.Yd;
              var zd=m.Zd;
              var xr=m.Xr;
              var yr=m.Yr;
              var xde=m.Xde;
              var yde=m.Yde;



              preassignReqToDevice(reqName,reqid,capaId,xr,yr,dispositivo,xd,yd,zd,hA,xde,yde);

              var points="{'points':[";
              for(var k=0;k<jsonPts.points.length;k++){
                var reqNombre=jsonPts.points[k].point.nombre;
                if(reqNombre==reqName){
                  var reqPersona=jsonPts.points[k].point.persona;
                  var reqEmpresa=jsonPts.points[k].point.empresa;
                  var reqDireccion=jsonPts.points[k].point.direccion;
                  var reqTelefono=jsonPts.points[k].point.telefono;
                  var reqCiudad=jsonPts.points[k].point.ciudad;
                  var reqPais=jsonPts.points[k].point.pais;
                  var reqDes=jsonPts.points[k].point.descripcion;

                  var reqPersonadest=jsonPts.points[k].point.personadestino;
                  var reqEmpresadest=jsonPts.points[k].point.empresadestino;
                  var reqDirecciondest=jsonPts.points[k].point.direcciondestino;
                  var reqTelefonodest=jsonPts.points[k].point.telefonodestino;
                  var reqCiudaddest=jsonPts.points[k].point.ciudaddestino;
                  var reqPaisdest=jsonPts.points[k].point.paisdestino;
                  var reqDesdest=jsonPts.points[k].point.descripciondestino;

                  var createdTime=jsonPts.points[k].point.hora_creacion;
                  var closedTime=jsonPts.points[k].point.hora_cierre;
                  var x1=jsonPts.points[k].point.x;
                  var y1=jsonPts.points[k].point.y;
                  var z1=jsonPts.points[k].point.z;

                  var x2=jsonPts.points[k].point.x1;
                  var y2=jsonPts.points[k].point.y1;
                  var z2=jsonPts.points[k].point.z1;
                  var createdby=jsonPts.points[k].point.createdby;
                  var status=jsonPts.points[k].point.status;

                  points=points+"{'point':{'client_id':'"+dispositivo+"','hora_creacion':'"+createdTime+"','hora_asignacion':'"+hA+"','hora_cierre':'"+closedTime+"','x':"+x1+",'y':"+y1+",'z':"+z1+",'nombre':'"+reqNombre+"','persona':'"+reqPersona+"','empresa':'"+reqEmpresa+"','direccion':'"+reqDireccion+"','telefono':'"+reqTelefono+"','ciudad':'"+reqCiudad+"','pais':'"+reqPais+"','descripcion':'"+reqDes+"','recogido':'','personadestino':'"+reqPersonadest+"','empresadestino':'"+reqEmpresadest+"','direcciondestino':'"+reqDirecciondest+"','telefonodestino':'"+reqTelefonodest+"','ciudaddestino':'"+reqCiudaddest+"','paisdestino':'"+reqPaisdest+"','descripciondestino':'"+reqDesdest+"','x1':"+x2+",'y1':"+y2+",'z1':"+z2+",'entregado':'','createdby':'"+createdby+"','status':'preasignado'}},";
                }else{
                  var clientId=jsonPts.points[k].point.client_id;
                  var name=jsonPts.points[k].point.nombre;
                  var person=jsonPts.points[k].point.persona;
                  var company=jsonPts.points[k].point.empresa;
                  var address=jsonPts.points[k].point.direccion;
                  var phone=jsonPts.points[k].point.telefono;
                  var city=jsonPts.points[k].point.ciudad;
                  var country=jsonPts.points[k].point.pais;
                  var des=jsonPts.points[k].point.descripcion;

                  var persondest=jsonPts.points[k].point.personadestino;
                  var companydest=jsonPts.points[k].point.empresadestino;
                  var addressdest=jsonPts.points[k].point.direcciondestino;
                  var phonedest=jsonPts.points[k].point.telefonodestino;
                  var citydest=jsonPts.points[k].point.ciudaddestino;
                  var countrydest=jsonPts.points[k].point.paisdestino;
                  var desdest=jsonPts.points[k].point.descripciondestino;

                  var createdTime=jsonPts.points[k].point.hora_creacion;
                  var assignedTime=jsonPts.points[k].point.hora_asignacion;
                  var closedTime=jsonPts.points[k].point.hora_cierre;
                  var x1=jsonPts.points[k].point.x;
                  var y1=jsonPts.points[k].point.y;
                  var z1=jsonPts.points[k].point.z;

                  var x2=jsonPts.points[k].point.x1;
                  var y2=jsonPts.points[k].point.y1;
                  var z2=jsonPts.points[k].point.z1;
                  var pickedup=jsonPts.points[k].point.recogido;
                  var delivered=jsonPts.points[k].point.entregado;
                  var createdby=jsonPts.points[k].point.createdby;
                  var status=jsonPts.points[k].point.status;
                  points=points+"{'point':{'client_id':'"+clientId+"','hora_creacion':'"+createdTime+"','hora_asignacion':'"+assignedTime+"','hora_cierre':'"+closedTime+"','x':"+x1+",'y':"+y1+",'z':"+z1+",'nombre':'"+name+"','persona':'"+person+"','empresa':'"+company+"','direccion':'"+address+"','telefono':'"+phone+"','ciudad':'"+city+"','pais':'"+country+"','descripcion':'"+des+"','recogido':'"+pickedup+"','personadestino':'"+persondest+"','empresadestino':'"+companydest+"','direcciondestino':'"+addressdest+"','telefonodestino':'"+phonedest+"','ciudaddestino':'"+citydest+"','paisdestino':'"+countrydest+"','descripciondestino':'"+desdest+"','x1':"+x2+",'y1':"+y2+",'z1':"+z2+",'entregado':'"+delivered+"','createdby':'"+createdby+"','status':'"+status+"'}},";
                }
              }
              points = points.substring(0, points.length - 1);
              points=points+"]}";
              //console.log(points);
              var req={id:val,reqid:reqid,companyid:$rootScope.company,fecha:reqDate,features:points};
              //Update requirement cloud point in the database
              Requirement.update(req,onReqUpdateSuccess, onReqSaveError);

            }else{
              alert('No hay ningun punto de requerimiento contenido alrededor de los puntos de rastreo.');
              clearInterval(assignInterval);
            }
          }
        }
      });
    }
  }
}
//Get all the last tracked positions from a company
function getCompanyTracks(company){

    var company=$rootScope.company;
    //var companyId=company+"_"+dateTime;
    var companyId=company;
    var arrTracks=[];
    $.ajax({
     async: false,
     type: "GET",
     url: $rootScope.host+"/api/auxtracks/getAuxtrackCompany/"+companyId,
     contentType: "application/json; charset=utf-8",
     dataType: "json",
     success: function (result) {
       var returnOb = angular.fromJson(result);
       //console.log(returnOb);
       if(returnOb!=null){
        for(var i=0;i<returnOb.length;i++){
          var val=returnOb[i].id;
          var company=returnOb[i].empresaid;
          //var reqDate=returnOb[i].fecha;
          var jsonPts=jQuery.parseJSON(JSON.stringify(eval("(" + returnOb[i].features + ")")));
          for(var j=0;j<jsonPts.points.length;j++){
            var clientId=jsonPts.points[j].point.client_id;
            var x1=jsonPts.points[j].point.x;
            var y1=jsonPts.points[j].point.y;
            var z1=jsonPts.points[j].point.z;
            var st=jsonPts.points[j].point.status;
            var reqSt=jsonPts.points[j].point.reqstatus;
            var isTracking=geoOperation.getBool(jsonPts.points[j].point.tracking);
            if($rootScope.tracks.length!=0){
             if(isDeviceEnabled(clientId)&&isTracking){
               arrTracks.push({clientId:clientId,x:x1,y:y1,reqstatus:reqSt,status:st});
             }
            }else{
              if(isTracking){
                 arrTracks.push({clientId:clientId,x:x1,y:y1,reqstatus:reqSt,status:st});
              }
            }
            if(validateUserTrack(clientId)){
              for(var k=0;k<$rootScope.tracks.length;k++){
                if(clientId==$rootScope.tracks[k].clientId){
                  if(isTracking==false){
                     $rootScope.tracks.splice(k, 1);
                     if($rootScope.routes.length>0){
                      if($rootScope.routes[0].userid==clientId){
                         leafletData.getMap("mapabase").then(function(map) {
                            map.eachLayer(function (layer) {
                              if (layer._leaflet_id === parseInt(routeId)) {
                                map.removeLayer(layer);
                                $scope.isRouteTraced=false;
                                routeId=null;
                                $rootScope.routes=[];
                              }
                            });
                         });
                       }
                     }
                   }else{
                     $rootScope.tracks[k].x=x1;
                     $rootScope.tracks[k].y=y1;
                   }
                }
              }
            }else{
              if(isTracking){
                $rootScope.tracks.push({id:clientId+"_"+geoOperation.randomString(),tipo:smartphone_img,clientId:clientId,x:x1,y:y1,enabled:true});
              }
            }
          }
       }
      }
     }
   });
   return arrTracks;
}
//Validates that the user is in the $rootScope.tracks array
function validateUserTrack(clientId){
  var b=false;
  var i=0;
  while(i<$rootScope.tracks.length&&b==false){
    if(clientId==$rootScope.tracks[i].clientId){
       b=true;
    }
    i=i+1;
  }
  return b;
}
//Verifies if the device is enabled (state=true)
function isDeviceEnabled(clientId){
  var b=false;
  var i=0;
  while(i<$rootScope.tracks.length&&b==false){
    if(clientId==$rootScope.tracks[i].clientId&&$rootScope.tracks[i].enabled==true){
       b=true;
    }
    i=i+1;
  }
  return b;
}
//Method to update requeriment to closed
function updateReqToClosed(reqNombre,reqid,capaId,x,y,iconURL,device){
  $rootScope.m.eachLayer(function (layer) {
    if (layer._leaflet_id === parseInt(capaId) ){
      var layers=layer._layers;
      //console.log(layer);
      angular.forEach(layers, function(value, key){
        if(reqNombre==layers[key].feature.properties.nombre){
          var reqPersona=layers[key].feature.properties.persona;
          var reqEmpresa=layers[key].feature.properties.empresa;
          var reqDireccion=layers[key].feature.properties.direccion;
          var reqTelefono=layers[key].feature.properties.telefono;
          var reqCiudad=layers[key].feature.properties.ciudad;
          var reqPais=layers[key].feature.properties.pais;
          var reqDescripcion=layers[key].feature.properties.descripcion;

           layer.removeLayer(layers[key]);
           var iconSize = [30, 70];
           var geojsonFeature;
           if(device!=""){
             geojsonFeature = {
               "type": "Feature",
               "properties": {"nombre":reqNombre,"persona":reqPersona,"empresa":reqEmpresa,"direccion":reqDireccion,"telefono":reqTelefono,"ciudad":reqCiudad,"pais":reqPais,"descripcion":reqDescripcion,"dispositivo":device},
               "geometry": {
                 "type": "Point",
                 "coordinates": [y, x]
               }
             };
           }else{
             geojsonFeature = {
               "type": "Feature",
               "properties": {"nombre":reqNombre,"persona":reqPersona,"empresa":reqEmpresa,"direccion":reqDireccion,"telefono":reqTelefono,"ciudad":reqCiudad,"pais":reqPais,"descripcion":reqDescripcion},
               "geometry": {
                 "type": "Point",
                 "coordinates": [y, x]
               }
             };
           }

           var geojson=L.geoJson(geojsonFeature, {
             style: function (feature) {
             },
             onEachFeature: function(feature, layer){

               layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                 iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                 popupAnchor: [0, -iconSize[1] / 2]}));
               var content = '<table class="dropchop-table"><tr>';
               if (layer.feature.properties) {
                   for (var prop in layer.feature.properties) {
                    content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
                   }
                }
                content += '</table>';
                layer.bindPopup(L.popup({
                     maxWidth: 450,
                     maxHeight: 200,
                     autoPanPadding: [45, 45],
                     className: 'dropchop-popup'
                }, layer).setContent(content));
               }
            });
            console.log(geojson);
            geojson.eachLayer(
               function(l){
                 layer.addLayer(l);
           });
        }
      });
    }
  });
}
//Method to update requirement to assigned
function updateReqToAssigned(reqNombre,reqid,capaId,x,y,iconURL,device){
  $rootScope.m.eachLayer(function (layer) {
    if (layer._leaflet_id === parseInt(capaId) ){
      var layers=layer._layers;
      //console.log(layer);
      angular.forEach(layers, function(value, key){
        if(reqNombre==layers[key].feature.properties.nombre){
          var reqPersona=layers[key].feature.properties.persona;
          var reqEmpresa=layers[key].feature.properties.empresa;
          var reqDireccion=layers[key].feature.properties.direccion;
          var reqTelefono=layers[key].feature.properties.telefono;
          var reqCiudad=layers[key].feature.properties.ciudad;
          var reqPais=layers[key].feature.properties.pais;
          var reqDescripcion=layers[key].feature.properties.descripcion;

           layer.removeLayer(layers[key]);
           var iconSize = [30, 70];
           var geojsonFeature;
           if(device!=""){
             geojsonFeature = {
               "type": "Feature",
               "properties": {"nombre":reqNombre,"persona":reqPersona,"empresa":reqEmpresa,"direccion":reqDireccion,"telefono":reqTelefono,"ciudad":reqCiudad,"pais":reqPais,"descripcion":reqDescripcion,"dispositivo":device},
               "geometry": {
                 "type": "Point",
                 "coordinates": [y, x]
               }
             };

           }else{
             geojsonFeature = {
               "type": "Feature",
               "properties": {"nombre":reqNombre,"persona":reqPersona,"empresa":reqEmpresa,"direccion":reqDireccion,"telefono":reqTelefono,"ciudad":reqCiudad,"pais":reqPais,"descripcion":reqDescripcion},
               "geometry": {
                 "type": "Point",
                 "coordinates": [y, x]
               }
             };
           }

           var geojson=L.geoJson(geojsonFeature, {
             style: function (feature) {
             },
             onEachFeature: function(feature, layer){

               layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                 iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                 popupAnchor: [0, -iconSize[1] / 2]}));
               var content = '<table class="dropchop-table"><tr>';
               if (layer.feature.properties) {
                   for (var prop in layer.feature.properties) {
                    content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
                   }
                }
                content += '</table>';
                layer.bindPopup(L.popup({
                     maxWidth: 450,
                     maxHeight: 200,
                     autoPanPadding: [45, 45],
                     className: 'dropchop-popup'
                }, layer).setContent(content));
               }
            });
            console.log(geojson);
            geojson.eachLayer(
               function(l){
                 layer.addLayer(l);
           });
        }
      });
    }
  });
}
//update req status
function updateReqStatus(){
   if($rootScope.drawPoint==false){
     for(var i=0;i<$rootScope.capasreq.length;i++){
         var reqId=$rootScope.capasreq[i].nombre;
         var capaId=$rootScope.capasreq[i].id;
         $.ajax({
              async: false,
              type: "GET",
              url: $rootScope.host+"/api/requirements/"+reqId,
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function (result) {
                 var returnOb = angular.fromJson(result);
                 if(returnOb!=null){
                   var val=returnOb.id;
                   var company=returnOb.companyid;
                   var reqDate=returnOb.fecha;
                   var jsonPts=jQuery.parseJSON(JSON.stringify(eval("(" + returnOb.features + ")")));
                   for(var j=0;j<jsonPts.points.length;j++){
                     var nombre=jsonPts.points[j].point.nombre;
                     var Xr=Number(jsonPts.points[j].point.x);
                     var Yr=Number(jsonPts.points[j].point.y);
                     var Xde=Number(jsonPts.points[j].point.x1);
                     var device=jsonPts.points[j].point.client_id;
                     if(Xde==0){
                        Xde="";
                     }
                     var Yde=Number(jsonPts.points[j].point.y1);
                     if(Yde==0){
                       Yde="";
                     }
                     var st=jsonPts.points[j].point.status;//Requeriment status (nuevo, asignado, cerrado)
                     var reqpickedup=jsonPts.points[j].point.recogido;//Picked up requerimient
                     if(st=='asignado'){
                       if(Xde!=''&&Yde!=''){
                         if(reqpickedup=='X'){
                           updateReqToClosed(nombre,reqId,capaId,Xr,Yr,'http://api.tiles.mapbox.com/v3/marker/pin-m-marker+000000.png',device);
                           updateReqToAssigned(nombre+"(d)",reqId,capaId,Xde,Yde,'http://api.tiles.mapbox.com/v3/marker/pin-m-triangle+FF0000.png',device);
                         }else{
                           updateReqToAssigned(nombre,reqId,capaId,Xr,Yr,'http://api.tiles.mapbox.com/v3/marker/pin-m-marker+FF0000.png',device);
                           updateReqToAssigned(nombre+"(d)",reqId,capaId,Xde,Yde,'http://api.tiles.mapbox.com/v3/marker/pin-m-triangle+FF0000.png',device);

                         }
                       }else{
                         updateReqToAssigned(nombre,reqId,capaId,Xr,Yr,'http://api.tiles.mapbox.com/v3/marker/pin-m-marker+FF0000.png',device);
                       }
                     }else if(st=='cerrado'){
                       if(Xde!=''&&Yde!=''){
                         updateReqToClosed(nombre,reqId,capaId,Xr,Yr,'http://api.tiles.mapbox.com/v3/marker/pin-m-marker+000000.png',device);
                         updateReqToClosed(nombre+"(d)",reqId,capaId,Xde,Yde,'http://api.tiles.mapbox.com/v3/marker/pin-m-triangle+000000.png',device);
                       }else{
                         updateReqToClosed(nombre,reqId,capaId,Xr,Yr,'http://api.tiles.mapbox.com/v3/marker/pin-m-marker+000000.png',device);
                       }
                     }
                   }
                 }
               }
         });
     }
   }
}
//Preassign req to device
function preassignReqToDevice(reqNombre,reqid,capaId,x,y,device,xd,yd,zd,hA,Xde,Yde){
  $.ajax({
     async: false,
     type: "GET",
     url: $rootScope.host+"/api/auxtracks/getAuxtrackUser/"+device,
     contentType: "application/json; charset=utf-8",
     dataType: "json",
     success: function (result) {
       var id=result.id;
       $.ajax({
         async: false,
         type: "POST",
         url: $rootScope.host+"/api/auxtracks/"+id,
         data: {_method: "delete"},
         success: function(result){
           var pts="{'points':[{'point':{'client_id':'"+device+"','time':'"+hA+"','x':"+xd+",'y':"+yd+",'z':"+zd+",'reqname':'"+reqNombre+"','reqid':'"+reqid+"','Xr':"+x+",'Yr':"+y+",'recogido':'','Xde':'"+Xde+"','Yde':'"+Yde+"','entregado':'','reqstatus':'preasignado','status':'libre','tracking':'true'}}]}";
           var auxTracked={id:null,empresaid:$rootScope.company,user:device,features:pts};
           $.ajax({
            async: false,
            type: "POST",
            url: $rootScope.host+"/api/auxtracks",
            data:JSON.stringify(auxTracked),
            dataType: 'json',
            contentType: 'application/json',
            success: function(result) {

            },
            error: function (xhr, ajaxOptions, thrownError) {

            }
          });
          //Auxtrack.save(auxTracked, onSaveAuxtrackSuccess, onSaveAuxtrackError);
         }
       });
     },error: function(xhr) {
       //console.clear();
     }
   });
}
$scope.traceRoute= function(user){
 //alert(user);
 if($scope.isRouteTraced){
  leafletData.getMap("mapabase").then(function(map) {
     map.eachLayer(function (layer) {
        if (layer._leaflet_id === parseInt(routeId)) {
          map.removeLayer(layer);
          $scope.isRouteTraced=false;
          routeId=null;
          $rootScope.routes=[];
          if($('#route-'+user).hasClass('onRoute')){
             $('#route-'+user).removeClass('onRoute');
          }
        }
      });
  });
 }else{
  leafletData.getMap("mapabase").then(function(map) {
    var dt = new Date();
    var m = dt.getUTCMonth() + 1; //months from 1-12
    var d = dt.getUTCDate();
    var year = dt.getUTCFullYear();
    if(d<10){
      d="0"+d;
    }
    if(m<10){
      m="0"+m;
    }
    var company=$rootScope.company;
    var dateTime=d+'-'+m+'-'+year;
    var h=dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
    var companyId=company+"_"+dateTime;
    $.ajax({
      async: false,
      type: "GET",
      url: $rootScope.host+"/api/tracks/"+companyId,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (result) {
        var returnOb = angular.fromJson(result);
        //console.log(returnOb);
        if(returnOb!=null){
          var arrTrackedPoints=getTrackedPoints(returnOb.features);
          var array = new Array();
          for(var i=0;i<arrTrackedPoints.length;i++){
            if(arrTrackedPoints[i].client_id==user){
              var x=arrTrackedPoints[i].x;
              var y=arrTrackedPoints[i].y;
              array.push([y,x]);
            }
          }
          if(array.length!=0){
            var line = turf.lineString(array);
            var type;
            var geojson=L.geoJson(line, {
              style: function (feature) {
                return {color: '#FF0000', weight:4, opacity: 1.0};
              },
              onEachFeature: function(feature, layer){
              }
            });
            var name='ruta en el mapa';
            $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
            routeId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
            $rootScope.routes.push({id:routeId,userid:user});
            map.invalidateSize();
            map.fitBounds(geojson.getBounds());
            $scope.isRouteTraced=true;
            if(!$('#route-'+user).hasClass('onRoute')){
                $('#route-'+user).addClass('onRoute');//Add onCls to clu-layerId element
            }
          }else{
            //$scope.isRouteTraced=false;
          }
        }
      },error: function(xhr) {
        console.log(xhr);
        //console.clear();
      }
    });
  });
 }
}
function onSaveTrackError () {

}
function onSaveAuxtrackError () {

}
function onSaveTrackSuccess(){

}
function onSaveAuxtrackSuccess(result){
  $scope.$emit('smallgisApp:auxtrackUpdate', result);
  if(result.id!=null){
  }
}
$scope.selectBaseMap= function(id,l){
  if(parseInt(id)!=parseInt(layerAUXID)){
    leafletData.getMap("mapabase").then(function(map) {
      map.eachLayer(function (layer) {
        if (layer._leaflet_id === parseInt(layerAUXID) ){
          map.removeLayer(layer);
        }
      });
      map.invalidateSize();
      map.addLayer(l);
      layerAUXID=id;
    });
  }
};

$scope.removeLayer = function (layerId) {
  //console.clear();
  layerId=parseInt(layerId);
  leafletData.getMap("mapabase").then(function(map) {
    map.eachLayer(function (layer) {
      if (layer._leaflet_id === layerId) {

        map.removeLayer(layer);
        //Delete array Point asssociated with the layerId
        for(var i=0;i<$rootScope.capas.length;i++){
          var id=parseInt($rootScope.capas[i].id);
          if(layerId==id){

            $rootScope.capas.splice(i, 1);
            if($rootScope.simplifyId==layerId){
              $mdSidenav('left11').toggle();
              if($mdSidenav('left11').isLockedOpen()){
                $scope.islocked11=false;
              }else{
                $scope.islocked11=true;
              }
              $scope.isOpen11=false;
              fts=[];
              $scope.isCheckedSimplify=false;
              $rootScope.simplifyId=0;
              $scope.valueinisimplify = "0";
            }
            if($rootScope.currentLayerId==layerId){
              $scope.dataInfo.length=0;
              var obj='{}';
              tableColsName=[];
              fillTable(tableColsName,obj);
              if(tableLayoutIsOpen){
                $scope.layout['tablalayout'] = !$scope.layout['tablalayout'];
              }

              tableLayoutIsOpen=false;
              $rootScope.currentLayerId=0;
              $scope.nombreCapa="";
            }
            try{
              var b1=contains(arrClusterPoints,layerId);
              if(b1){
                var clusterId=getClusterId(arrClusterPoints, layerId);
                map.eachLayer(function (layer) {
                  if (layer._leaflet_id === clusterId) {
                    map.removeLayer(layer);
                    removeElement(arrClusterPoints, layerId);//Remove element id from arrClusterPoints array
                    //clusterCtrlIsAdded=false;
                    delete $rootScope.clcontrol._layers[clusterId];
                  }
                });
              }
              var b2=contains(arrHeatLayers,layerId);
              if(b2){
                removeElement(arrHeatLayers, layerId);
              }
              if(arrHeatLayers.length==0){
                var heatId=parseInt(arrHeatPoints[0].heatId);
                map.eachLayer(function (layer) {
                  if (layer._leaflet_id === heatId) {
                    map.removeLayer(layer);
                    //heatCtrlIsAdded=false;
                    delete $rootScope.clcontrol._layers[heatId];
                  }
                });
                arrHeatPoints=[];
              }


            }catch(err){

            }
          }
        }
      }
    });
     map.invalidateSize();
  });
};
//Method to clear the map and free resources
$scope.clearMap = function (){
  leafletData.getMap("mapabase").then(function(map) {
    for(var i=0;i<$rootScope.capas.length;i++){
      var id=parseInt($rootScope.capas[i].id);
      map.eachLayer(function (layer) {
        if (layer._leaflet_id === id) {
          map.removeLayer(layer);
          //$rootScope.capas.splice(i, 1);
        }
      });
    }
    if($rootScope.simplifyId!=0){
      $mdSidenav('left11').toggle();
      if($mdSidenav('left11').isLockedOpen()){
        $scope.islocked11=false;
      }else{
        $scope.islocked11=true;
      }
      $scope.isOpen11=false;
      fts=[];
      $scope.isCheckedSimplify=false;
      $rootScope.simplifyId=0;
      $scope.valueinisimplify = "0";
    }
    var obj='{}';
    tableColsName=[];
    fillTable(tableColsName,obj);
    if(tableLayoutIsOpen){
      $scope.layout['tablalayout'] = !$scope.layout['tablalayout'];
    }
    tableLayoutIsOpen=false;
    $scope.nombreCapa="";
    $rootScope.capas=[];
    $rootScope.originalFts=[];
    for(var i=0;i<arrClusterPoints.length;i++){
      var clusterId=parseInt(arrClusterPoints[i].clusterId);
      map.eachLayer(function (layer) {
        if (layer._leaflet_id === clusterId) {
          map.removeLayer(layer);
          removeElement(arrClusterPoints, layerId);//Remove element id from arrClusterPoints array
        }
      });
    }
    if(arrHeatLayers.length!=0){
      var heatId=parseInt(arrHeatPoints[0].heatId);
      map.eachLayer(function (layer) {
        if (layer._leaflet_id === heatId) {
          map.removeLayer(layer);
        }
      });
      arrHeatPoints=[];
      arrHeatLayers=[];
    }
    angular.forEach($rootScope.clcontrol._layers, function(value, key){
      delete $rootScope.clcontrol._layers[key];
    });
    if($rootScope.isLayerEditing){
      $rootScope.drawCtrlEdit.removeFrom(map);
      $rootScope.exitEditBtn.removeFrom(map);
      $rootScope.isLayerEditing=false;
      $rootScope.editingLayerId=0;
    }
    if($rootScope.isdrawctrladded){
      $rootScope.drawCtrl.removeFrom(map);
      $rootScope.exitDrawBtn.removeFrom(map);
      $rootScope.isdrawctrladded=false;
    }
    map.invalidateSize();
  });
};
$scope.mapLegend =function(){
  console.clear();
  leafletData.getMap("mapabase").then(function(map) {
    if($rootScope.islegendctrladded==false){

      //var n=Object.keys($rootScope.layersMapa2).length;
      var n=$rootScope.capas.length;
      if(n>0){
        labels = ['<div style="text-align:center"><strong>Mapa</strong></div>'];
        for(var i=0;i<$rootScope.capas.length;i++){
          var layerId=parseInt($rootScope.capas[i].id);
          map.eachLayer(function (layer) {
            if (layer._leaflet_id === layerId) {
              createLegend(layer);
            }
          });
        }

        $rootScope.legendControl.onAdd = function (map) {
          div.innerHTML = labels.join('<br>');
          return div;
        };
        $rootScope.legendControl.addTo(map);
        $rootScope.islegendctrladded=true;
        var h=$('.legend').height();
        if(h>600){
          $('.info').addClass('scrollCls');//Add scroll to info class
          $('.legend').height(600);
        }
      }

    }else{
      $rootScope.legendControl.removeFrom(map);
      $rootScope.islegendctrladded=false;
    }
  });
};
function uploadCSV(){
  leafletData.getMap("mapabase").then(function(map) {
    map.spin(false);
    map.spin(true);
    try{
      var reader = new FileReader();
      reader.onload = function(e) {
        var ext;
        if (reader.readyState !== 2 || reader.error) {
          return;
        }
        else {
          ext = filecsv.name.split('.');
          ext = ext[ext.length - 1];
          var name=filecsv.name.slice(0, (0 - (ext.length + 1)));
          //var color=geoOperation.get_random_color();
          var type='';

          var csvString = e.target.result;
          var color=geoOperation.get_random_color();
          csv2geojson.csv2geojson(csvString, function(err, data) {
            var geojson = L.geoJson(data, {
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
                  }else if (layer instanceof L.Circle) {
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
          }
        };
        reader.readAsText(filecsv);
      }catch(err){
        alert("El archivo no pudo ser cargado correctamente.");
      }
    });
  }
  function createLegend(layer){
    var arrColors=[];
    var markerIcons=[];
    var arrTags=[];
    var arrLineType=[];
    var b=false;//Indicates that the layer has legend
    angular.forEach(layer._layers, function(value, key){
      var tag=layer._layers[key].feature.properties["etiqueta"];
      if(tag!=null){
        b=true;
      }
    });
    if(b==true){
      if($rootScope.islegendctrladded==true){
        legendControl.removeFrom(map);
        $rootScope.islegendctrladded=false;
      }
      var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
      var typeG=geoOperation.getTypeGeometry(json);
      if(typeG=="Point"){
        angular.forEach(layer._layers, function(value, key){
          var tag=layer._layers[key].feature.properties["etiqueta"];
          var markerColor=layer._layers[key].feature.properties["marker-color"];
          var markerSymbol=layer._layers[key].feature.properties["marker-symbol"];
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
          var img=$rootScope.mapAPI+"pin-m-"+markerIcons[i]+"+"+color+".png";
          div.innerHTML += labels.push('<img src="' + img + '" width="20" height="40"/>' +arrTags[i]+ '<br>');
        }


      }else if(typeG=="LineString"){
        angular.forEach(layer._layers, function(value, key){
          var lineStroke=layer._layers[key].feature.properties["line-stroke"];
          var tag=layer._layers[key].feature.properties["etiqueta"];
          var stroke=layer._layers[key].feature.properties["stroke"];
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
        angular.forEach(layer._layers, function(value, key){
          var tag=layer._layers[key].feature.properties["etiqueta"];
          var fill=layer._layers[key].feature.properties["fill"];
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
    //Function to duplicate the layer
    $scope.copyLayer= function (layerId,layerName) {
      console.clear();
      layerId=parseInt(layerId);
      var name="copia_"+layerName;//Layer name
      var type,fColor;
      var originalColors=[];//Original color array for layer
      var color=geoOperation.get_random_color();
      leafletData.getMap("mapabase").then(function(map) {
        map.eachLayer(function (layer) {
          if (layer._leaflet_id === layerId) {
            var geoJson=layer.toGeoJSON();//Convert the layer to geojson
            var json=JSON.parse(JSON.stringify(geoJson));//Convert the geojson to text
            var featureLayer = new L.GeoJSON();
            var cont=0;
            var featureLayer = L.geoJson(geoJson, {
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
                  }else if (layer instanceof L.Circle) {
                    type = 'Circle';
                  }

                }
              });
              $rootScope.clcontrol.addOverlay(featureLayer.addTo(map), name);
              map.invalidateSize();
              map.fitBounds(featureLayer.getBounds());

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
            }
          });
        });
      };
      //Function to rename the layer
      $scope.renameLayer = function(layerId) {
        $rootScope.layerIdRn=parseInt(layerId);
        ModalService.showModal({
          templateUrl: 'renamelayer.html',
          controller: "renamelayerController"
        }).then(function(modal) {

          modal.element.modal({backdrop: 'static'});
          modal.close.then(function(result) {
          });
        });
      };
      //Function to zoom in layer
      $scope.getClose = function (layerId) {
        layerId=parseInt(layerId);
        leafletData.getMap("mapabase").then(function(map) {
          map.eachLayer(function (layer) {
            if (layer._leaflet_id === layerId) {
              map.invalidateSize();
              map.fitBounds(layer.getBounds());//Zoom to focus the Object
            }
          });
        });
      };
      $scope.addFile = function() {
        document.getElementById("file1").click();
      };
      $scope.fileNameChanged1 = function() {
        var file = document.getElementById("file1").files[0];
        if(file){
          handleFile(file);
        }
        //alert("select file "+file);

      };
      $scope.addExternalLink = function() {
        ModalService.showModal({
          templateUrl: 'addexternallink.html',
          controller: "addexternallinkController"
        }).then(function(modal) {

          modal.element.modal();
          modal.close.then(function(result) {
            //$scope.message ="Name: " + result.name + ", age: " + result.age;
          });
        });
      };
      $scope.addArcGISFeature=function(){
        ModalService.showModal({
          templateUrl: 'addarcgisfeature.html',
          controller: "addarcgisfeatureController"
        }).then(function(modal) {

          modal.element.modal();
          modal.close.then(function(result) {

          });
        });
      };
      $scope.showLegendCtrl=function(layerId,layerName){
        layerId=parseInt(layerId);
        if($rootScope.islegendctrladded==false){
          var arrColors=[];
          var markerIcons=[];
          var arrTags=[];
          var arrLineType=[];
          leafletData.getMap("mapabase").then(function(map) {
            map.eachLayer(function (layer) {
              if(layer._leaflet_id===layerId){
                var b=false;//Indicates that the layer has legend
                angular.forEach(layer._layers, function(value, key){
                  var tag=layer._layers[key].feature.properties["etiqueta"];
                  if(tag!=null){
                    b=true;
                  }
                });
                if(b==true){

                  var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                  var typeG=geoOperation.getTypeGeometry(json);
                  if(typeG=="Point"){
                    angular.forEach(layer._layers, function(value, key){
                      var tag=layer._layers[key].feature.properties["etiqueta"];
                      var markerColor=layer._layers[key].feature.properties["marker-color"];
                      var markerSymbol=layer._layers[key].feature.properties["marker-symbol"];
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

                            var variableauxiliar3=markerIcons[i];
                            markerIcons[i]=markerIcons[j];
                            markerIcons[j]=variableauxiliar3;

                          }
                        }
                      }
                    }
                    var arrLegendLen=arrTags.length;
                    $rootScope.legendControl.onAdd = function (map) {
                      var div = L.DomUtil.create('div', 'info legend');
                      var labels = ['<strong>'+layerName+'</strong>'];
                      //div.innerHTML = '<strong>'+layerName+'</strong><br>';
                      for (var i = 0; i < arrLegendLen; i++) {
                        var color=arrColors[i].replace("#","");
                        var img=$rootScope.mapAPI+"pin-m-"+markerIcons[i]+"+"+color+".png";
                        div.innerHTML += labels.push('<img alt="legend" src="' + img + '" width="25" height="45"/>' +arrTags[i]+ '<br>');
                      }
                      div.innerHTML = labels.join('<br>');
                      return div;
                    };
                    $rootScope.legendControl.addTo(map);
                    $rootScope.islegendctrladded=true;
                    var h=$('.legend').height();
                    if(h>600){
                      $('.info').addClass('scrollCls');//Add scroll to info class
                      $('.legend').height(600);
                    }

                  }else if(typeG=="LineString"){
                    angular.forEach(layer._layers, function(value, key){
                      var lineStroke=layer._layers[key].feature.properties["line-stroke"];
                      var tag=layer._layers[key].feature.properties["etiqueta"];
                      var stroke=layer._layers[key].feature.properties["stroke"];
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

                            var variableauxiliar3=arrLineType[i];
                            arrLineType[i]=arrLineType[j];
                            arrLineType[j]=variableauxiliar3;

                          }
                        }
                      }
                    }

                    var arrLegendLen=arrTags.length;


                    $rootScope.legendControl.onAdd = function (map) {
                      var div = L.DomUtil.create('div', 'info legend');
                      var labels = ['<strong>'+layerName+'</strong>'];
                      //div.innerHTML = '<strong>'+layerName+'</strong><br>';
                      for (var i = 0; i < arrLegendLen; i++) {
                       // console.log(arrLineType[i]);
                        if(arrLineType[i]=="stroke1"){
                          div.innerHTML += labels.push('<s style="border-bottom: 2px solid ' + arrColors[i] + '"></s> ' +arrTags[i]+ '<br>');
                        }else if(arrLineType[i]=="stroke2"){
                          div.innerHTML += labels.push('<s style="border-bottom: 2px dashed ' + arrColors[i] + '"></s> ' +arrTags[i]+ '<br>');
                        }else if(arrLineType[i]=="stroke3"){
                          div.innerHTML += labels.push('<s style="border-bottom: 2px dotted ' + arrColors[i] + '"></s> ' +arrTags[i]+ '<br>');
                        }else{
                          div.innerHTML += labels.push('<s style="border-bottom: 2px solid ' + arrColors[i] + '"></s> ' +arrTags[i]+ '<br>');
                        }
                        //div.innerHTML += labels.push('<i style="background:' + arrColors[i] + '"></i> ' +arrTags[i]+ '<br>');

                      }
                      div.innerHTML = labels.join('<br>');
                      return div;
                    };
                    $rootScope.legendControl.addTo(map);
                    $rootScope.islegendctrladded=true;
                    var h=$('.legend').height();
                    if(h>600){
                      $('.info').addClass('scrollCls');//Add scroll to info class
                      $('.legend').height(600);
                    }

                  }else{
                    angular.forEach(layer._layers, function(value, key){
                      var tag=layer._layers[key].feature.properties["etiqueta"];
                      var fill=layer._layers[key].feature.properties["fill"];
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


                    $rootScope.legendControl.onAdd = function (map) {
                      var div = L.DomUtil.create('div', 'info legend');
                      var labels = ['<strong>'+layerName+'</strong>'];
                      for (var i = 0; i < arrLegendLen; i++) {
                        div.innerHTML += labels.push('<i style="background:' + arrColors[i] + '"></i> ' +arrTags[i]+ '<br>');
                      }
                      div.innerHTML = labels.join('<br>');
                      return div;
                    };
                    $rootScope.legendControl.addTo(map);
                    $rootScope.islegendctrladded=true;
                    var h=$('.legend').height();
                    if(h>600){
                      $('.info').addClass('scrollCls');//Add scroll to info class
                      $('.legend').height(600);
                    }

                  }
                  if(!$('#legend-'+layerId).hasClass('onLegend')){
                    $('#legend-'+layerId).addClass('onLegend');//Add off to legend ctrl button
                  }
                }else{
                  alert("No se puede generar leyenda para esa capa porque no esta clasificada.");
                }
              }
            });
          });
        }else{
          leafletData.getMap("mapabase").then(function(map) {
            $rootScope.legendControl.removeFrom(map);
            $rootScope.islegendctrladded=false;
            if($('#legend-'+layerId).hasClass('onLegend')){
              $('#legend-'+layerId).removeClass('onLegend');//Add off to legend ctrl button
            }
          });
        }
      };
      $scope.setTransparence=function(layerId,value){
        value=parseInt(value);
        value=value/100;
        value=1-value;
        var layerId=parseInt(layerId);
        try{
          leafletData.getMap("mapabase").then(function(map) {
            leafletData.getMap("mapabase").then(function(featureGroup) {
              featureGroup.eachLayer(function (layer) {
                if (layer._leaflet_id === layerId) {
                  layer.setStyle({fillOpacity:value});
                  layer.setStyle({opacity:value});
                }
              });
            });
          });
        }catch(err){

        }
      };
      $scope.clasLayer = function(layerId,layerName) {
        $rootScope.layerIDColor=parseInt(layerId);
        $rootScope.layerNameColor=layerName;
        layerId=parseInt(layerId);
        var fColor;
        $rootScope.originalColors=[];
        leafletData.getMap("mapabase").then(function(map) {
          map.eachLayer(function (layer) {
            if (layer._leaflet_id === layerId) {

              angular.forEach(layer._layers, function(value, key){
                try{
                  fColor=layer._layers[key].options.fillColor;//Get original fillColor from layer
                  $rootScope.originalColorStroke=layer._layers[key].options.color;//Get the original color stroke from layer
                  $rootScope.originalStrokeValue=layer._layers[key].options.weight;//Get the original weight from layer
                  $rootScope.originalOpacity=layer._layers[key].options.opacity;//Get the original opacity from layer

                  if(fColor==null){
                    fColor="#999";
                  }
                }catch(err){
                  fColor="#999";
                }
                $rootScope.originalColors[key]=fColor;

              });
              $rootScope.tagName=layerName;
              var LGeojson=JSON.parse(JSON.stringify(layer.toGeoJSON()));
              $rootScope.typeG=geoOperation.getTypeGeometry(LGeojson);//Type of geometry (Feature, Point or LineString)
              //alert('Type of geometry:'+geoOperation.getTypeGeometry(LGeojson));

              ModalService.showModal({
                templateUrl: 'clasifylayer.html',
                controller: "clasifylayerController"
              }).then(function(modal) {

                modal.element.modal({backdrop: 'static'});
                modal.element.draggable();
                //modal.element.show();
                modal.close.then(function(result) {
                });
              });
              //console.log(LGeojson);
            }
          });
        });
      };
      //Show cluster for points
      $scope.showCluster = function(layerId,layerName){
        if(contains(arrHeatLayers,layerId)==false){
          layerId=parseInt(layerId);
          var b=contains(arrClusterPoints,layerId);
          //console.log(b);
          if(b==false){
            leafletData.getMap("mapabase").then(function(map) {
              map.eachLayer(function (layer) {
                if (layer._leaflet_id === layerId) {
                  var geoJsonData=layer.toGeoJSON();//Convert the layer to geojson
                  var markers = L.markerClusterGroup();
                  var geoJsonLayer = L.geoJson(geoJsonData, {
                    onEachFeature: function (feature, layer) {
                      layer.bindPopup(feature.properties);
                    }
                  });
                  markers.addLayer(geoJsonLayer);
                  map.removeLayer(layer);
                  var name="cluster"+layerName+$rootScope.clu;
                  $rootScope.clcontrol.addOverlay(markers.addTo(map), name);
                  //var Id = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
                  var Id=getLayerId($rootScope.clcontrol._layers,name);
                  Id=parseInt(Id);
                  arrClusterPoints.push({layerId:layerId,clusterId:Id});
                 // console.log(arrClusterPoints);
                  map.fitBounds(markers.getBounds());
                  $rootScope.clu=$rootScope.clu+1;
                  if(!$('#cl-'+layerId).hasClass('onCls')){
                    $('#cl-'+layerId).addClass('onCls');//Add onCls to clu-layerId element
                  }
                  //clusterCtrlIsAdded=true;

                }
              });
            });
          }else{
            leafletData.getMap("mapabase").then(function(map) {
              var clusterId=getClusterId(arrClusterPoints, layerId);
              map.eachLayer(function (layer) {
                if (layer._leaflet_id === clusterId) {
                  map.removeLayer(layer);
                  removeElement(arrClusterPoints, layerId);//Remove element id from arrClusterPoints array
                  //clusterCtrlIsAdded=false;
                  delete $rootScope.clcontrol._layers[clusterId];
                  if($('#cl-'+layerId).hasClass('onCls')){
                    $('#cl-'+layerId).removeClass('onCls');//Remove onCls to clu-layerId element
                  }
                }
              });
              var capa=getLayer(layerId);
              map.addLayer(capa);
            });
          }
        }
      };
      $scope.editLayer= function(layerId){
        layerId=parseInt(layerId);
        if($rootScope.isLayerEditing==false&&$rootScope.isdrawctrladded==false&&$rootScope.drawLine==false&&$rootScope.drawPoint==false){
          leafletData.getMap("mapabase").then(function(map) {
            map.eachLayer(function (layer) {
              if (layer._leaflet_id === layerId) {
                $rootScope.drawnItemsEdit=new L.FeatureGroup();
                var optionsEdit = {
                  position: 'topleft',
                  draw: {
                    polyline:true,
                    polygon:true,
                    rectangle: false,
                    circle: false,
                    marker: true
                  },
                  edit: {
                    featureGroup: $rootScope.drawnItemsEdit
                  }
                };
                $rootScope.drawCtrlEdit = new L.Control.Draw(optionsEdit);
                $rootScope.drawCtrlEdit.addTo(map);
                map.addLayer($rootScope.drawnItemsEdit);
                layer.eachLayer(
                  function(l){
                    $rootScope.drawnItemsEdit.addLayer(l);
                  });
                  $rootScope.exitEditBtn.addTo(map);
                  $rootScope.isLayerEditing=true;
                  $rootScope.editingLayerId=layerId;
                  if(!$('#edit-'+layerId).hasClass('onEdit')){
                    $('#edit-'+layerId).addClass('onEdit');//Add onCls to clu-layerId element
                  }
                  try{
                    map.fitBounds(layer.getBounds());
                  }catch(err){}
                }
              });
            });
          }
          if($rootScope.isdrawctrladded){
            alert("Debe de terminar de crear la capa.");
          }else if($rootScope.drawLine){
            alert("Debe de finalizar el perfil de terreno.");
          }else if($rootScope.drawPoint){
            alert("Debe de finalizar de crear el requerimiento.");
          }
        };
        //Show heat for points
        /*$scope.showHeat = function(layerId,layerName){
        if(contains(arrClusterPoints,layerId)==false){
        layerId=parseInt(layerId);
        var b=contains(arrHeatPoints,layerId);
        if(b==false){
        leafletData.getMap("mapabase").then(function(map) {
        var dataPoints=[];
        map.eachLayer(function (layer) {
        if (layer._leaflet_id === layerId){

        layer.eachLayer(function(l) {
        var latlng=l.getLatLng();
        //console.log(latlng);
        var cont=0;
        var lat;
        var lon;
        angular.forEach(latlng, function(value, key){
        if(cont==0){
        lat=value;
      }else if(cont==1){
      lon=value;
    }
    cont=cont+1;
  });
  var count=Math.floor((Math.random() * 3) + 1);
  dataPoints.push({lat:lat,lng:lon,count:count});
});
map.removeLayer(layer);
var testData = {
max: 8,
data: dataPoints
};
heatmapInstances[layerId]=new HeatmapOverlay(cfg);

heatmapInstances[layerId].setData(testData);
//map.addLayer(heatmapLayer);
var name="heat"+layerName+$rootScope.h;
//$rootScope.clcontrol.addOverlay(heatmapLayer.addTo(map), name);
$rootScope.clcontrol.addOverlay(heatmapInstances[layerId].addTo(map), name);
var Id=getLayerId($rootScope.clcontrol._layers,name);
//var Id = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
Id=parseInt(Id);
arrHeatPoints.push({layerId:layerId,heatId:Id});
console.log(arrHeatPoints);
//heatCtrlIsAdded=true;
$rootScope.h=$rootScope.h+1;
//map.fitWorld().zoomIn();
}
});
});
}else{
leafletData.getMap("mapabase").then(function(map) {
var heatId=getHeatId(arrHeatPoints, layerId);
map.eachLayer(function (layer) {
if (layer._leaflet_id === heatId) {
map.removeLayer(layer);
removeElement(arrHeatPoints, layerId);//Remove element id from arrHeatPoints array
//heatCtrlIsAdded=false;
delete $rootScope.clcontrol._layers[heatId];
delete heatmapInstances[layerId];
}
});
var capa=getLayer(layerId);
map.addLayer(capa);
});
}
}
};*/
//Show heat for points
$scope.showHeatPoints=function(){
  var dataPoints=[];
  var b=false;
  if(arrHeatPoints.length==0){
    leafletData.getMap("mapabase").then(function(map) {
      for(var i=0;i<$rootScope.capas.length;i++){
        if($rootScope.capas[i].espunto==1){
          var layerId=parseInt($rootScope.capas[i].id);
          if(contains(arrClusterPoints,layerId)==false){
            map.eachLayer(function (layer) {
              if (layer._leaflet_id === layerId){

                layer.eachLayer(function(l) {
                  var latlng=l.getLatLng();
                  //console.log(latlng);
                  var cont=0;
                  var lat;
                  var lon;
                  angular.forEach(latlng, function(value, key){
                    if(cont==0){
                      lat=value;
                    }else if(cont==1){
                      lon=value;
                    }
                    cont=cont+1;
                  });
                  var count=Math.floor((Math.random() * 3) + 1);
                  dataPoints.push({lat:lat,lng:lon,count:count});
                });
                map.removeLayer(layer);
                arrHeatLayers.push({layerId:layerId});
                b=true;
                //map.fitWorld().zoomIn();
              }
            });
          }
        }
      }
      if(b==true){
        var testData = {
          max: 8,
          data: dataPoints
        };
        var heatmapLayer = new HeatmapOverlay(cfg);
        heatmapLayer.setData(testData);
        //map.addLayer(heatmapLayer);
        var name="heat"+$rootScope.h;
        $rootScope.clcontrol.addOverlay(heatmapLayer.addTo(map), name);
        var Id=getLayerId($rootScope.clcontrol._layers,name);
        //var Id = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
        Id=parseInt(Id);
        arrHeatPoints.push({heatId:Id});
        //console.log(arrHeatPoints);
        //heatCtrlIsAdded=true;
        $rootScope.h=$rootScope.h+1;
        if(!$('#fire').hasClass('onFire')){
          $('#fire').addClass('onFire');//Add onCls to clu-layerId element
        }
      }
    });
  }else{
    leafletData.getMap("mapabase").then(function(map) {
      var heatId=parseInt(arrHeatPoints[0].heatId);
      map.eachLayer(function (layer) {
        if (layer._leaflet_id === heatId) {
          map.removeLayer(layer);
          //heatCtrlIsAdded=false;
          delete $rootScope.clcontrol._layers[heatId];
        }
      });
      for(var i=0;i<arrHeatLayers.length;i++){
        var layerId=parseInt(arrHeatLayers[i].layerId);
        var capa=getLayer(layerId);
        map.addLayer(capa);
      }
      arrHeatPoints=[];
      arrHeatLayers=[];
      if($('#fire').hasClass('onFire')){
        $('#fire').removeClass('onFire');//Remove onCls to clu-layerId element
      }
    });
  }
};
//Function to validate if the heat or cluster layer is on/off
function contains(a, layerId) {
  var i = a.length;
  while (i--) {
    if (parseInt(a[i].layerId) === parseInt(layerId)) {
      return true;
    }
  }
  return false;
}
//Function that returns clusterId
function getClusterId(a, layerId){
  var i = a.length;
  while (i--) {
    if (parseInt(a[i].layerId) === parseInt(layerId)) {
      return parseInt(a[i].clusterId);
    }
  }
}
//Function that returns heatId
function getHeatId(a, layerId){
  var i = a.length;
  while (i--) {
    if (parseInt(a[i].layerId) === parseInt(layerId)) {
      return parseInt(a[i].heatId);
    }
  }
}
//Get layer from $rootScope.capas
function getLayer(layerId){
  var i = $rootScope.capas.length;
  while (i--) {
    if (parseInt($rootScope.capas[i].id) === parseInt(layerId)) {
      return $rootScope.capas[i].capa;
    }
  }
}
//Remove element with layerId as index
function removeElement(a,layerId){
  var i = 0;
  while (i<a.length) {
    if (parseInt(a[i].layerId) ==parseInt(layerId)) {
      a.splice(i, 1);
    }
    i=i+1;
  }
}
function getLayerId(layers,name){
  var layerId;
  angular.forEach(layers, function(value, key){
    if(layers[key].name==name){
      layerId=key;
    }
  });
  return layerId;
}
$scope.showAlong = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'alongtool.html',
      controller: "alongtoolController"
    }).then(function(modal) {

      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message ="Name: " + result.name + ", age: " + result.age;
      });
    });
  }
};
$scope.showEnvelope = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'bboxtool.html',
      controller: "bboxtoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showBezier = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'beziertool.html',
      controller: "beziertoolController"
    }).then(function(modal) {

      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message ="Name: " + result.name + ", age: " + result.age;
      });
    });
  }
};
$scope.showBuffer = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'buffertool.html',
      controller: "buffertoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showCenter = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'centertool.html',
      controller: "centertoolController"
    }).then(function(modal) {

      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message ="Name: " + result.name + ", age: " + result.age;
      });
    });
  }
};
$scope.showCentroid = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'centroidtool.html',
      controller: "centroidtoolController"
    }).then(function(modal) {

      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message ="Name: " + result.name + ", age: " + result.age;
      });
    });
  }
};
$scope.showDestination = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'destinationtool.html',
      controller: "destinationtoolController"
    }).then(function(modal) {

      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message ="Name: " + result.name + ", age: " + result.age;
      });
    });
  }
};
$scope.showErase = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'removetool.html',
      controller: "removetoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showExplode = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'explodetool.html',
      controller: "explodetoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showIdentity = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'identitytool.html',
      controller: "identitytoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showIntersect = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'intersectool.html',
      controller: "intersectoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showIsoline = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'polilinetool.html',
      controller: "polilinetoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showMerge = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'mergetool.html',
      controller: "mergetoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showMidPoint = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'midpointtool.html',
      controller: "midpointtoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showSimplified = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'simplifiedtool.html',
      controller: "simplifiedtoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showTin = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'tintool.html',
      controller: "tintoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showUpdate = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'updatetool.html',
      controller: "updatetoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showUnion = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'uniontool.html',
      controller: "uniontoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showSquare = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'squaretool.html',
      controller: "squaretoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showSquareGrid = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'squaregridtool.html',
      controller: "squaregridtoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showTriangleGrid = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'trianglegridtool.html',
      controller: "trianglegridtoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showConcave = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'concavetool.html',
      controller: "concavetoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showConvex = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'convextool.html',
      controller: "convextoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showDistance = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'distancetool.html',
      controller: "distancetoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
$scope.showWithin = function() {
  if($rootScope.capas.length>0){
    ModalService.showModal({
      templateUrl: 'withintool.html',
      controller: "withintoolController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
  }
};
//Create line ctrl to draw a polyline to calculate the terrain
$scope.showTerrain =function(){
  if($rootScope.drawLine==false&&$rootScope.isdrawctrladded==false&&$rootScope.isLayerEditing==false&&$rootScope.drawPoint==false){
    leafletData.getMap("mapabase").then(function(map) {
      drawnLineItems=new L.FeatureGroup();
      var options = {
        position: 'topleft',
        draw: {
          polyline:true,
          polygon:false,
          rectangle: false,
          circle: false,
          marker: false
        },
        edit:false
      };
      $rootScope.drawLineCtrl = new L.Control.Draw(options);
      $rootScope.drawLineCtrl.addTo(map);
      $rootScope.exitLineBtn.addTo(map);
      $rootScope.clcontrol.addOverlay(drawnLineItems.addTo(map),"terreno");
      $rootScope.drawLine=true;
    });
  }
  if($rootScope.isdrawctrladded){
    alert("Debe de terminar de crear la capa.");
  }else if($rootScope.isLayerEditing){
    alert("Debe de terminar la edición de la capa.");
  }else if($rootScope.drawPoint){
    alert("Debe de finalizar de crear el requerimiento.");
  }
}
//Hide point ctrl
function closePointCtrl(){
  leafletData.getMap("mapabase").then(function(map) {
    if(markerAddress!=null){
    map.removeLayer(markerAddress);

    var lat,lng,obj;
    if(isOriginAdded==false){
     lat=arrReqPts[0].x;
     lng=arrReqPts[0].y;
     obj={"nombre": arrReqPts[0].nombre,"persona":arrReqPts[0].persona,"empresa":arrReqPts[0].empresa,"direccion":arrReqPts[0].direccion,"telefono":arrReqPts[0].telefono,"ciudad":arrReqPts[0].ciudad,"pais":arrReqPts[0].pais,"descripcion":arrReqPts[0].descripcion};
    }else{
     lat=auxReq1[0].x;
     lng=auxReq1[0].y;
     obj={"nombre": auxReq1[0].nombre,"persona":auxReq1[0].persona,"empresa":auxReq1[0].empresa,"direccion":auxReq1[0].direccion,"telefono":auxReq1[0].telefono,"ciudad":auxReq1[0].ciudad,"pais":auxReq1[0].pais,"descripcion":auxReq1[0].descripcion};
    }
    var geojsonFeature = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": [lng, lat]
    }
    };
    var geojson=L.geoJson(geojsonFeature, {
    style: function (feature) {
    },
    onEachFeature: function(feature, layer){
      feature.properties=obj;
      var iconSize = [30, 70];
      var iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-marker+00FF00.png';
      layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
        iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
        popupAnchor: [0, -iconSize[1] / 2]}));
        //geoOperation.bindPopup(layer);
        var content = '<table class="dropchop-table"><tr>';
        if (layer.feature.properties) {
          for (var prop in layer.feature.properties) {
            content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
          }
        }
        content += '</table>';
        layer.bindPopup(L.popup({
          maxWidth: 450,
          maxHeight: 200,
          autoPanPadding: [45, 45],
          className: 'dropchop-popup'
        }, layer).setContent(content));
      }
    });
    geojson.eachLayer(
      function(l){
        $rootScope.drawnPointItems.addLayer(l);
      });
      markerAddress=null;
      if(isOriginAdded==false){
        updateReqLayer(arrReqPts);
      }
    }
    if(markerAddressDest!=null){
      map.removeLayer(markerAddressDest);
      var lat= arrReqPts[0].x1;
      var lng=  arrReqPts[0].y1;
      var obj={"nombre": arrReqPts[0].nombre+"(d)","persona":arrReqPts[0].personadestino,"empresa":arrReqPts[0].empresadestino,"direccion":arrReqPts[0].direcciondestino,"telefono":arrReqPts[0].telefonodestino,"ciudad":arrReqPts[0].ciudaddestino,"pais":arrReqPts[0].paisdestino,"descripcion":arrReqPts[0].descripciondestino};
      var geojsonFeature = {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [lng, lat]
        }
      };
      var geojson=L.geoJson(geojsonFeature, {
        style: function (feature) {
        },
        onEachFeature: function(feature, layer){
          feature.properties=obj;
          var iconSize = [30, 70];
          var iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-triangle+00FF00.png';
          layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
            iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
            popupAnchor: [0, -iconSize[1] / 2]}));
            //geoOperation.bindPopup(layer);
            var content = '<table class="dropchop-table"><tr>';
            if (layer.feature.properties) {
              for (var prop in layer.feature.properties) {
                content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
              }
            }
            content += '</table>';
            layer.bindPopup(L.popup({
              maxWidth: 450,
              maxHeight: 200,
              autoPanPadding: [45, 45],
              className: 'dropchop-popup'
            }, layer).setContent(content));
          }
        });
        geojson.eachLayer(
          function(l){
            $rootScope.drawnPointItems.addLayer(l);
          });
          markerAddressDest=null;

          updateReqLayer(arrReqPts);
        }
        if(isOriginAdded){
          alert('Antes de terminar la creación de la capa debe primero de terminar de asignar el punto de entrega del requerimiento actual.');
        }else{
          $rootScope.drawPointCtrl.removeFrom(map);
          $rootScope.exitPointBtn.removeFrom(map);
          $rootScope.drawCurrentPosition.removeFrom(map);
          $rootScope.geoCodingCrtl.removeFrom(map);
          $rootScope.drawPoint=false;
          if($rootScope.editReqId!=null){
            for(var i=0;i<$rootScope.capasreq.length;i++){
              var capasId=parseInt($rootScope.capasreq[i].id);
              if(capasId== $rootScope.editReqId){
                $rootScope.capasreq[i].edit=false;
              }
            }
          }
          $rootScope.editReqId=null;
        }
    });
}
//Hide line ctrl
function closeLineCtrl(){
  leafletData.getMap("mapabase").then(function(map) {
    $rootScope.drawLineCtrl.removeFrom(map);
    $rootScope.exitLineBtn.removeFrom(map);
    if(elevationControl!=null){
      elevationControl.removeFrom(map);
      map.removeLayer(gjl);
      elevationControl=null;
      gjl=null;
    }
    $rootScope.drawLine=false;
  });
}
//Hide draw ctrl
function closeDrawCtrl(){
  leafletData.getMap("mapabase").then(function(map) {
    $rootScope.drawCtrl.removeFrom(map);
    $rootScope.exitDrawBtn.removeFrom(map);
    $rootScope.isdrawctrladded=false;
  });
}
//Hide edit ctrl
function closeEditCtrl(){
  leafletData.getMap("mapabase").then(function(map) {
    $rootScope.drawCtrlEdit.removeFrom(map);
    $rootScope.exitEditBtn.removeFrom(map);
    $rootScope.isLayerEditing=false;
    if($rootScope.editingLayerId!=0){
      if($('#edit-'+$rootScope.editingLayerId).hasClass('onEdit')){
        $('#edit-'+$rootScope.editingLayerId).removeClass('onEdit');//Remove onCls to clu-layerId element
      }
    }
    $rootScope.editingLayerId=0;
  });
}
function calculateTerrain(layerId){
  leafletData.getMap("mapabase").then(function(map) {
    map.eachLayer(function (layer) {
      if (layer._leaflet_id === layerId) {
        var geojson=JSON.parse(JSON.stringify(layer.toGeoJSON()));//Convert the layer to geojson
        var N=30;//Number of iterations
        var layers=layer._layers;
        var coords=[];
        var pts=[];

        angular.forEach(layers, function(value, key){
          for(var i=0;i<layers[key].feature.geometry.coordinates.length;i++){
            coords.push(layers[key].feature.geometry.coordinates[i]);
          }
        });
        var linestring1 = turf.lineString(coords);
        //console.log(linestring1);
        var lineLen = turf.lineDistance(linestring1, 'kilometers');
        //console.log(lineLen);
        var d=lineLen/N;
        var x=coords[0][0];
        var y=coords[0][1];
        var locations = [];
        pts.push({0:x,1:y});

        locations.push(new google.maps.LatLng(y,x));
        //console.log("["+x+","+y+"]");
        for(var i=1;i<=N;i++){
          var point = turf.along(linestring1, d*i, 'kilometers');
          x=point.geometry.coordinates[0];
          y=point.geometry.coordinates[1];
          //console.log("["+x+","+y+"]");
          pts.push({0:x,1:y});
          locations.push(new google.maps.LatLng(y,x));
        }
        //console.log(pts);
        var elevator = new google.maps.ElevationService();
        var positionalRequest = {
          'locations': locations
        }

        elevator.getElevationForLocations(positionalRequest, function(results, status) {
          if (status == google.maps.ElevationStatus.OK) {
            if (results[0]) {
              var points=[];
              for (var i=0; i< results.length; i++) {
                var x=pts[i][0];
                var y=pts[i][1];
                var h=parseInt(results[i].elevation.toFixed(0));
                points.push({0:x,1:y,2:h})
              }
              var linestring2 = [turf.lineString(points)];
              var fc=turf.featureCollection(linestring2);
              //Function to create terrain elevation control
              showTerrainElevation(coords,fc);
            }
          }
        });
      }
    });
  });
}
function showTerrainElevation(coords,fc){
  leafletData.getMap("mapabase").then(function(map) {
    var url = 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg',
    attr ='Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    service = new L.TileLayer(url, {subdomains:"1234",attribution: attr});
    var x1=coords[0][0];
    var y1=coords[0][1];
    var x2=coords[coords.length-1][0];
    var y2=coords[coords.length-1][1];
    var bounds = new L.LatLngBounds(new L.LatLng(y1, x1), new L.LatLng(y2,x2));
    //var bounds = new L.LatLngBounds(new L.LatLng(6.293458760393998, -75.5255126953125), new L.LatLng(6.0968598188879355, -75.2947998046875));
    //console.log(fc);
    elevationControl = L.control.elevation({
      position: "topright",
      theme: "lime-theme", //default: lime-theme
      width: 600,
      height: 150,

      margins: {
        top: 10,
        right: 20,
        bottom: 30,
        left: 50
      },
      useHeightIndicator: false, //if false a marker is drawn at map position
      interpolation: "linear", //see https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-area_interpolate
      hoverNumber: {
        decimalsX: 3, //decimals on distance (always in km)
        decimalsY: 1, //deciamls on hehttps://www.npmjs.com/package/leaflet.coordinatesight (always in m)

        formatter: undefined //custom formatter function may be injected
      },
      xTicks: undefined, //number of ticks in x axis, calculated by default according to width
      yTicks: undefined, //number of ticks on y axis, calculated by default according to height
      collapsed: false,  //collapsed mode, show chart on click or mouseover
      imperial: false    //display imperial units instead of metric
    });
    /*var fc2 = {"name":"NewFeatureType","type":"FeatureCollection","features":[
    {"type":"Feature","geometry":{"type":"LineString","coordinates":[[-75.5255126953125,6.293458760393998,2425],[-75.47935632365397,6.254146971737007,2520],[-75.4332068930675,6.214831157155874,2183],[-75.38706435924375,6.1755113427589645,2106],[-75.34092867788146,6.13618755464196,2126],[-75.2947998046875,6.0968598188879355,2275]]},"properties":null}
  ]};
  console.log(fc2);*/
  elevationControl.addTo(map);
  gjl = L.geoJson(fc,{
    onEachFeature:   elevationControl.addData.bind(elevationControl)
  }).addTo(map);
  map.addLayer(service).fitBounds(bounds);
  var layerId=drawnLineItems._leaflet_id;
  leafletData.getMap("mapabase").then(function(map) {
    map.eachLayer(function (layer) {
      if (layer._leaflet_id === layerId) {
        map.removeLayer(layer);
      }
    });
  });

});
}
//Turn on/off layers from TOC
$scope.onChange= function(cbState,layerId){
  layerId=parseInt(layerId);
  //console.log($rootScope.capas);
  if(cbState){
    clearLayers();
    addLayers();
  }else{
    leafletData.getMap("mapabase").then(function(map) {
      map.eachLayer(function (layer) {
        if (layer._leaflet_id === layerId) {
          map.removeLayer(layer);
        }
      });
    });
  }
};
//Turn on/off added requirement layers from map
$scope.onChangeLayerRequirement= function(cbState, layerId){
 //alert(cbState+" "+layerId);
 if(cbState){
   leafletData.getMap("mapabase").then(function(map) {
    for(var i=0;i<$rootScope.capasreq.length;i++){
      var id=parseInt($rootScope.capasreq[i].id);
      if(id==parseInt(layerId)){
        var capa=$rootScope.capasreq[i].capa;
        //console.log(capa);
        map.addLayer(capa);
      }
    }
   });

 }else{
     leafletData.getMap("mapabase").then(function(map) {
      map.eachLayer(function (layer) {
        if (layer._leaflet_id === parseInt(layerId)) {
          map.removeLayer(layer);
        }
      });
    });
 }
};
//Remove requirement layer
$scope.removeRequirementLayer= function(layerId){
  var layerId=parseInt(layerId);
  leafletData.getMap("mapabase").then(function(map) {
      map.eachLayer(function (layer) {
        if (layer._leaflet_id === parseInt(layerId)) {
          for(var i=0;i<$rootScope.capasreq.length;i++){
            var id=parseInt($rootScope.capasreq[i].id);
            var editMode=$rootScope.capasreq[i].edit;
            if(layerId==id&&editMode==false){
              $rootScope.capasreq.splice(i, 1);
              map.removeLayer(layer);
              break;
            }else if(layerId==id&&editMode==true){
              alert("La capa no se puede eliminar porque se encuentra en modo de edición.");
            }
          }
        }
      });
  });
};
//Show assign requirement modal window
$scope.showAssignmentTable = function(){
   ModalService.showModal({
      templateUrl: 'assigntable.html',
      controller: "assigntableController"
    }).then(function(modal) {
      modal.element.modal({backdrop: 'static'});
      modal.close.then(function(result) {
        //$scope.message = "You said " + result;
      });
    });
};
//Show assign devices modal window
$scope.showAssignDevice = function() {
  if($rootScope.capasreq.length>0&&$scope.devicesVisible){
    if($rootScope.drawPoint==false){
      ModalService.showModal({
        templateUrl: 'assigndevice.html',
        controller: "assigndeviceController"
      }).then(function(modal) {
        modal.element.modal({backdrop: 'static'});
        modal.close.then(function(result) {
          //$scope.message = "You said " + result;
        });
      });
   }else{
    alert("Debe de finalizar de crear la capa de requerimientos actual antes de asignar.");
   }
 }else{
   alert("Debe de agregar una capa de requerimientos ó debe activar el rastreo de los dispositivos.");
 }
};
//Remove layers from map
function clearLayers(){
  leafletData.getMap("mapabase").then(function(map) {
    for(var i=0;i<$rootScope.capas.length;i++){
      var layerId=parseInt($rootScope.capas[i].id);
      map.eachLayer(function (layer) {
        if (layer._leaflet_id === layerId) {
          var b=contains(arrClusterPoints,layerId);
          if(b==false){
            map.removeLayer(layer);
          }
        }
      });
    }
  });
}
//Add layers to map
function addLayers(){
  leafletData.getMap("mapabase").then(function(map) {
    for (var i = $rootScope.capas.length-1; i >= 0; i--) {
      var layerId=parseInt($rootScope.capas[i].id);
      if($rootScope.capas[i].enabled){
        if($rootScope.capas[i].espunto==1){
          var b=contains(arrClusterPoints,layerId);
          if(b==false){
            var capa=getLayer(layerId);
            map.addLayer(capa);
          }
        }else{
          var capa=getLayer(layerId);
          map.addLayer(capa);
        }
      }
    }
  });
}
//Show dialog to remove the selected layers from the database
$scope.showDialogRmLayer = function (){
  if($rootScope.capasDb.length>0){
    var cont=0;
    for(var i=0;i<$rootScope.capasDb.length;i++){
      var id=$rootScope.capasDb[i].id;
      if($rootScope.capasDb[i].isChecked){
        cont=cont+1;
      }
    }
    if(cont>=1){
      $('#dialog-rmlayers').dialog('open');
    }else{
      alert('Debe seleccionar por lo menos una capa.');
    }
  }
}
//Remove selected layers from cloud or database
function removeLayersFromCloud() {
  try{
    /*for(var i=0;i<$rootScope.capasDb.length;i++){
    var id=$rootScope.capasDb[i].id;
    if($rootScope.capasDb[i].isChecked){
    $rootScope.capasDb.splice(i, 1);
    Capa.delete({id: id},
    function () {
  });
}
}*/
var i=0;
while(i<$rootScope.capasDb.length){
  var id=$rootScope.capasDb[i].id;
  if($rootScope.capasDb[i].isChecked){
    $rootScope.capasDb.splice(i, 1);
    Capa.delete({id: id},
      function () {
        i=i+1;
      });
    }else{
      i=i+1;
    }
  }
}catch(err){

}
}
//Remove map from cloud or database
function removeMapFromCloud(){
  try{
    var i=0;
    while(i<$rootScope.mapas.length){
      var id=$rootScope.mapas[i].id;
      if($rootScope.mapas[i].isChecked){
        $rootScope.mapas.splice(i, 1);
        Mapa.delete({id: id},
          function () {
            i=i+1;
          });
        }else{
          i=i+1;
        }
      }
    }catch(err){

    }
  }
  //Remove app from cloud or database
  function removeAppFromCloud(){
    try{
      var i=0;
      while(i<$rootScope.apps.length){
        var id=$rootScope.apps[i].id;
        if($rootScope.apps[i].isChecked){
          $rootScope.apps.splice(i, 1);
          Aplicacion.delete({id: id},
            function () {
              i=i+1;
            });
          }else{
            i=i+1;
          }
        }
      }catch(err){

      }
    }
    //Add selected the stored layers from cloud or database
    function addLayersFromCloud(){
      leafletData.getMap("mapabase").then(function(map) {
        map.spin(true);
        try{
          for(var i=0;i<$rootScope.capasDb.length;i++){
            var id=$rootScope.capasDb[i].id;
            if($rootScope.capasDb[i].isChecked){
              $.ajax({
                async: false,
                type: "GET",
                url: $rootScope.host+"/api/capas/"+id,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                  var returnOb = angular.fromJson(result);
                  //console.log(returnOb);
                  if(returnOb!=null){
                    var description=returnOb.descripcion;
                    var name=returnOb.nombre;
                    var contents=returnOb.features;
                    var json = JSON.parse(JSON.stringify(eval("(" + contents + ")")));
                    angular.forEach(json.features, function(value, key){
                      if(json.features[key].properties==null){
                        json.features[key].properties={};
                      }
                    });
                    var type='';
                    //console.log(json);
                    var color=geoOperation.get_random_color();
                    var typeG= geoOperation.getTypeGeometry(json);

                    var geojson=L.geoJson(json, {
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
                          }else if (layer instanceof L.Circle) {
                            type = 'Circle';
                          }

                        }
                      });

                      $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
                      map.invalidateSize();
                      map.fitBounds(geojson.getBounds());

                      var lastId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
                      if(typeG=='FeatureCollection'){
                        $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:description,usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
                      }else if(typeG=='Point'){
                        $rootScope.capas.push({id:lastId,nombre:name,tipo:punto_img,descripcion:description,usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
                      }else if(typeG=='LineString'){
                        $rootScope.capas.push({id:lastId,nombre:name,tipo:linea_img,descripcion:description,usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
                      }else if(typeG=='Polygon'){
                        $rootScope.capas.push({id:lastId,nombre:name,tipo:poligono_img,descripcion:description,usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
                      }else{
                        $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:description,usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
                      }
                      if(type=='Point'){
                        for(var i=0;i<$rootScope.capas.length;i++){
                          if(parseInt($rootScope.capas[i].id)==parseInt(lastId)){
                            $rootScope.capas[i].espunto=1;
                          }
                        }
                      }
                      //console.log( $rootScope.capas);
                    }
                  },error: function(xhr) {
                    console.log(xhr);
                    //console.clear();
                  }
                });
              }
            }
            for(var i=0;i<$rootScope.capasDb.length;i++){
              if($rootScope.capasDb[i].isChecked){
                $rootScope.capasDb[i].isChecked=false;
              }
            }
            map.spin(false);
          }catch(err){

          }
        });
      }
      //Add selected the stored requirement layers from cloud or database
      function addReqLayersFromCloud(){
       leafletData.getMap("mapabase").then(function(map) {
        try{
          for(var z=0;z<$rootScope.capasreqDb.length;z++){
            var reqid=$rootScope.capasreqDb[z].nombre;
            if($rootScope.capasreqDb[z].isChecked){
               $.ajax({
                async: false,
                type: "GET",
                url: $rootScope.host+"/api/requirements/"+reqid,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                 //console.log(result);
                 var returnOb = angular.fromJson(result);
                 if(returnOb!=null){
                    //var reqid=returnOb.reqid;

                    if(isRequiredmentLayerAdded(reqid)==false){
                       var id=returnOb.id;
                       var companyid=returnOb.companyid;
                       var dateTime=returnOb.fecha;
                       $rootScope.drawnPointItems=new L.FeatureGroup();
                       $rootScope.clcontrol.addOverlay($rootScope.drawnPointItems.addTo(map),reqid);
                       var lastId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
                       var jsonPts='';
                       if(returnOb.features!=''){
                           jsonPts=jQuery.parseJSON(JSON.stringify(eval("(" + returnOb.features + ")")));
                           for(var j=0;j<jsonPts.points.length;j++){
                            //Get Latitude/longitude that represents each requiriment from the selected requirement layer
                            var nombre=jsonPts.points[j].point.nombre;
                            var persona=jsonPts.points[j].point.persona;
                            var empresa=jsonPts.points[j].point.empresa;
                            var direccion=jsonPts.points[j].point.direccion;
                            var telefono=jsonPts.points[j].point.telefono;
                            var ciudad=jsonPts.points[j].point.ciudad;
                            var pais=jsonPts.points[j].point.pais;
                            var descripcion=jsonPts.points[j].point.descripcion;

                            var x=Number(jsonPts.points[j].point.x);
                            var y=Number(jsonPts.points[j].point.y);
                            var status=jsonPts.points[j].point.status;
                            var personadest=jsonPts.points[j].point.personadestino;
                            var recogido=jsonPts.points[j].point.recogido;
                            var device=jsonPts.points[j].point.client_id;
                            var iconSize = [30, 70];
                            var iconURL='';
                            if(status=='asignado'){
                              if(recogido=='X'){
                                iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-marker+000000.png';
                              }else{
                                iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-marker+FF0000.png';
                              }
                            }else if(status=='cerrado'){
                               iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-marker+000000.png';
                            }else{
                               iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-marker+00FF00.png';
                            }
                            //console.log(x+" "+y+" "+status+" "+iconURL);
                            var geojsonFeature;
                            if(device!=""){
                              geojsonFeature = {
                                "type": "Feature",
                                "properties": {"nombre":nombre,"persona":persona,"empresa":empresa,"direccion":direccion,"telefono":telefono,"ciudad":ciudad,"pais":pais,"descripcion":descripcion,"dispositivo":device},
                                "geometry": {
                                  "type": "Point",
                                  "coordinates": [y, x]
                                }
                              };
                            }else{
                              geojsonFeature = {
                                "type": "Feature",
                                "properties": {"nombre":nombre,"persona":persona,"empresa":empresa,"direccion":direccion,"telefono":telefono,"ciudad":ciudad,"pais":pais,"descripcion":descripcion},
                                "geometry": {
                                  "type": "Point",
                                  "coordinates": [y, x]
                                }
                              };
                            }

                            var geojson=L.geoJson(geojsonFeature, {
                              style: function (feature) {
                                /*return {stroke: true, color: '#000000', weight:4, opacity: 0.5, fill: false};*/
                              },
                              onEachFeature: function(feature, layer){
                                layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                                  iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                                  popupAnchor: [0, -iconSize[1] / 2]}));
                                  var content='';
                                  if(personadest!=""){
                                      content = '<table class="dropchop-table"><tr><td rowspan="2" align="center"><strong>Origen</strong></td></tr><tr>';
                                  }else{
                                      content = '<table class="dropchop-table"><tr>';
                                  }

                                  if (layer.feature.properties) {
                                       for (var prop in layer.feature.properties) {
                                        content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
                                       }
                                  }
                                  content += '</table>';
                                  layer.bindPopup(L.popup({
                                       maxWidth: 450,
                                       maxHeight: 200,
                                       autoPanPadding: [45, 45],
                                       className: 'dropchop-popup'
                                  }, layer).setContent(content));
                                }
                             });
                            // console.log(geojson);
                             geojson.eachLayer(
                                function(l){
                                  $rootScope.drawnPointItems.addLayer(l);
                             });

                             //It validates that the marker has a destination
                             if(personadest!=""){
                                if(status=='asignado'){
                                   iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-triangle+FF0000.png';
                                }else if(status=='cerrado'){
                                   iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-triangle+000000.png';
                                }else{
                                   iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-triangle+00FF00.png';
                                }
                                var empresadest=jsonPts.points[j].point.empresadestino;
                                var direcciondest=jsonPts.points[j].point.direcciondestino;
                                var telefonodest=jsonPts.points[j].point.telefonodestino;
                                var ciudaddest=jsonPts.points[j].point.ciudaddestino;
                                var paisdest=jsonPts.points[j].point.paisdestino;
                                var desdest=jsonPts.points[j].point.descripciondestino;

                                var x1=Number(jsonPts.points[j].point.x1);
                                var y1=Number(jsonPts.points[j].point.y1);
                                var geojsonFeature2;
                                if(device!=""){
                                  geojsonFeature2 = {
                                    "type": "Feature",
                                    "properties": {"nombre":nombre+"(d)","persona":personadest,"empresa":empresadest,"direccion":direcciondest,"telefono":telefonodest,"ciudad":ciudaddest,"pais":paisdest,"descripcion":desdest,"dispositivo":device},
                                    "geometry": {
                                      "type": "Point",
                                      "coordinates": [y1, x1]
                                    }
                                  };
                                }else{
                                  geojsonFeature2 = {
                                    "type": "Feature",
                                    "properties": {"nombre":nombre+"(d)","persona":personadest,"empresa":empresadest,"direccion":direcciondest,"telefono":telefonodest,"ciudad":ciudaddest,"pais":paisdest,"descripcion":desdest},
                                    "geometry": {
                                      "type": "Point",
                                      "coordinates": [y1, x1]
                                    }
                                  };
                                }

                                var geojson2=L.geoJson(geojsonFeature2, {
                                  style: function (feature) {

                                  },
                                  onEachFeature: function(feature, layer){
                                    layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                                      iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                                      popupAnchor: [0, -iconSize[1] / 2]}));

                                      var content = '<table class="dropchop-table"><tr><td rowspan="2" align="center"><strong>Destino</strong></td></tr><tr>';
                                      if (layer.feature.properties) {
                                           for (var prop in layer.feature.properties) {
                                            content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
                                           }
                                      }
                                      content += '</table>';
                                      layer.bindPopup(L.popup({
                                           maxWidth: 450,
                                           maxHeight: 200,
                                           autoPanPadding: [45, 45],
                                           className: 'dropchop-popup'
                                      }, layer).setContent(content));
                                    }
                                 });
                                 geojson2.eachLayer(
                                    function(l){
                                      $rootScope.drawnPointItems.addLayer(l);
                                 });

                             }

                             map.invalidateSize();
                             map.fitBounds(geojson.getBounds());
                           }
                       }

                       $rootScope.capasreq.push({id:lastId,nombre:reqid,dateTime:dateTime,tipo:'requerimiento',capa:$rootScope.clcontrol._layers[lastId].layer,edit:false,enabled:true});
                       //console.log($rootScope.capasreq);
                    }else{
                      alert("La capa de requerimientos "+reqid+" ya fue adicionada al mapa.");
                    }
                 }
                }
               });
             $rootScope.capasreqDb[z].isChecked=false;
            }
          }
        }catch(err){

        }
       });
      }
      //Validates if the requirement layer with same reqid (name) is added to map, it means that is opened at the moment

      function isRequiredmentLayerAdded(reqid){
       var f=false;
       for(var i=0;i<$rootScope.capasreq.length;i++){
         var reqId=$rootScope.capasreq[i].nombre;
         if(reqId==reqid){
            f=true;
            break;
         }
       }
       return f;

      }
      //Show dialog to remove the selected map from the cloud or database
      $scope.showDialogRemoveMap =function (){
        if($rootScope.mapas.length>0){
          var cont=0;
          for(var i=0;i<$rootScope.mapas.length;i++){
            var id=$rootScope.mapas[i].id;
            if($rootScope.mapas[i].isChecked){
              cont=cont+1;
            }
          }
          if(cont>=1){
            $('#dialog-removemap').dialog('open');
          }else{
            alert('Debe seleccionar por lo menos una capa.');
          }
        }
      }
      //Show dialog to remove the selected app from the cloud or database
      $scope.showDialogRemoveApp =function(){
        if($rootScope.apps.length>0){
          var cont=0;
          for(var i=0;i<$rootScope.apps.length;i++){
            var id=$rootScope.apps[i].id;
            if($rootScope.apps[i].isChecked){
              cont=cont+1;
            }
          }
          if(cont>=1){
            $('#dialog-removeapp').dialog('open');
          }else{
            alert('Debe seleccionar por lo menos una capa.');
          }
        }
      }
      //Show dialog to add the selected layers from the cloud or database
      $scope.showDialogAddLayers = function (){
        if($rootScope.capasDb.length>0){
          var cont=0;
          for(var i=0;i<$rootScope.capasDb.length;i++){
            var id=$rootScope.capasDb[i].id;
            if($rootScope.capasDb[i].isChecked){
              cont=cont+1;
            }
          }
          if(cont>=1){
            $('#dialog-addlayers').dialog('open');
          }else{
            alert('Debe seleccionar por lo menos una capa.');
          }
        }
      }
      //Show dialog to add the selected requirement layers from the cloud or database
      $scope.showDialogAddReqLayers = function (){
        if($rootScope.capasreqDb.length>0){
          var cont=0;
          for(var i=0;i<$rootScope.capasreqDb.length;i++){
            var id=$rootScope.capasreqDb[i].id;
            if($rootScope.capasreqDb[i].isChecked){
              cont=cont+1;
            }
          }
          if(cont>=1){
            $('#dialog-addreqlayers').dialog('open');
          }else{
            alert('Debe seleccionar por lo menos una capa de requerimientos.');
          }
        }
      }
      //Show dialog to add the selected map from the cloud or database
      $scope.showDialogAddMap = function (){
        if($rootScope.mapas.length>0){
          var cont=0;
          for(var i=0;i<$rootScope.mapas.length;i++){
            var id=$rootScope.mapas[i].id;
            if($rootScope.mapas[i].isChecked){
              cont=cont+1;
            }
          }
          if(cont>=1){
            $('#dialog-addmap').dialog('open');
          }else{
            alert('Debe seleccionar por lo menos un mapa.');
          }
        }
      }
      //Show dialog to create an app with the selected map from the cloud or database
      $scope.showDialogCreateApp = function (){
        if($rootScope.mapas.length>0){
          var cont=0;
          for(var i=0;i<$rootScope.mapas.length;i++){
            var id=$rootScope.mapas[i].id;
            if($rootScope.mapas[i].isChecked){
              cont=cont+1;
            }
          }
          if(cont>=1){
            $('#dialog-createapp').dialog('open');
          }else{
            alert('Debe seleccionar un mapa para crear una aplicación.');
          }
        }
      }
      $scope.showSelectedApp= function(appId){
        var url=$rootScope.host+"/#/apps?appId="+appId;
        var win = window.open(url, '_blank');
        win.focus();
      };
      function createApp(){
        for(var i=0;i<$rootScope.mapas.length;i++){
          var id=$rootScope.mapas[i].id;
          if($rootScope.mapas[i].isChecked){
            angular.element('#app_title').css('border', 'none');
            $('#mapid').val(id);
            $("#app_title").val("");
            $("#app_des").val("");
            $('#dialog-saveapp').dialog('open');
          }
        }
      }
      //Set app creation to public or private
      $scope.clickEventApp =function($event){
        isAppPublic=$event;
      };
      //Set app creation to public or private
      $scope.clickEventShareApp =function($event){
        var isPublic=$event;
        //console.log(isPublic);
        for(var i=0;i<$rootScope.apps.length;i++){
          var id=$rootScope.apps[i].id;
          if($rootScope.apps[i].isChecked){
            var now = new Date();
            var day = ("0" + now.getDate()).slice(-2);
            var month = ("0" + (now.getMonth() + 1)).slice(-2);
            var today = now.getFullYear() + "-" + (month) + "-" + (day);
            var time=now.getHours()+":"+ now.getMinutes()+":"+now.getSeconds();
            var dateTime=today=today+" "+time;
            $.ajax({
              async: false,
              type: "GET",
              url: $rootScope.host+"/api/aplicacions/"+id,
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              success: function (data) {
                $.ajax({
                  async: false,
                  type: "PUT",
                  url: $rootScope.host+"/api/aplicacions",
                  data:JSON.stringify({id:id,titulo:data.titulo,mapid:data.mapid,empresa:$rootScope.company, usuario:$rootScope.username,descripcion:data.descripcion,tipoApp:data.tipoApp,espublico:isPublic,fecha:dateTime}),
                  dataType: 'json',
                  contentType: 'application/json',
                  success: function (result) {
                    //console.log(result);
                  },
                  error: function (xhr, ajaxOptions, thrownError) {
                    //console.log(xhr.status + ": " + thrownError);
                  }
                });

              },error: function(xhr) {
                console.log(xhr);
                //console.clear();
              }
            });
          }
        }
      };
      //Update checkboxes selection from the map list stored in the cloud
      $scope.updateSelection = function(position, mapas) {
        //console.log(position);
        //console.log(mapas);
        for(var i=0;i<mapas.length;i++){
          if(position!=i){
            mapas[i].isChecked=false;
          }
        }
      }
      //Update checkboxes selection from the app list stored in the cloud
      $scope.updateSelectionApp = function(position, apps) {
        for(var i=0;i<apps.length;i++){
          if(position!=i){
            apps[i].isChecked=false;
          }
        }
      }
      //Add stored map in the cloud
      function addMapFromCloud(){
        leafletData.getMap("mapabase").then(function(map) {
          try{
            for(var i=0;i<$rootScope.mapas.length;i++){
              if($rootScope.mapas[i].isChecked){
                var mapId=$rootScope.mapas[i].id;
                //console.log(mapId);
                $.ajax({
                  async: false,
                  type: "GET",
                  url: $rootScope.host+"/api/mapas/"+mapId,//GET all the stored user layers from mongo database in a synchronously way
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  success: function (data) {
                    var capasIDs=data.capas;
                    var mArrLayerIds = capasIDs.split(',');
                    var cont=0;
                    //console.log(mArrLayerIds);
                    for(var i=0;i<mArrLayerIds.length;i++){
                      var layerId=mArrLayerIds[i];
                      //console.log(layerId);
                      $.ajax({
                        async: false,
                        type: "GET",
                        url: $rootScope.host+"/api/capas/"+layerId,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (result) {
                          var returnOb = angular.fromJson(result);
                          //console.log(returnOb);
                          if(returnOb!=null){
                            map.spin(true);
                            var description=returnOb.descripcion;
                            var name=returnOb.nombre;
                            var contents=returnOb.features;
                            var json = JSON.parse(JSON.stringify(eval("(" + contents + ")")));
                            angular.forEach(json.features, function(value, key){
                              if(json.features[key].properties==null){
                                json.features[key].properties={};
                              }
                            });
                            var type='';
                            //console.log(json);
                            var color=geoOperation.get_random_color();
                            var typeG= geoOperation.getTypeGeometry(json);

                            var geojson=L.geoJson(json, {
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
                                  }else if (layer instanceof L.Circle) {
                                    type = 'Circle';
                                  }

                                }
                              });

                              $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
                              map.invalidateSize();
                              map.fitBounds(geojson.getBounds());

                              var lastId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
                              if(typeG=='FeatureCollection'){
                                $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:description,usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
                              }else if(typeG=='Point'){
                                $rootScope.capas.push({id:lastId,nombre:name,tipo:punto_img,descripcion:description,usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
                              }else if(typeG=='LineString'){
                                $rootScope.capas.push({id:lastId,nombre:name,tipo:linea_img,descripcion:description,usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
                              }else if(typeG=='Polygon'){
                                $rootScope.capas.push({id:lastId,nombre:name,tipo:poligono_img,descripcion:description,usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
                              }else{
                                $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:description,usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
                              }
                              if(type=='Point'){
                                for(var i=0;i<$rootScope.capas.length;i++){
                                  if(parseInt($rootScope.capas[i].id)==parseInt(lastId)){
                                    $rootScope.capas[i].espunto=1;

                                  }
                                }
                              }
                              map.spin(false);
                              //console.log( $rootScope.capas);
                            }
                          },error: function(xhr) {
                            console.clear();
                            cont=cont+1;
                          }
                        });
                      }
                      if(cont==mArrLayerIds.length){
                        alert("Todas las capas asociadas al mapa fueron borradas.");
                      }
                    }
                  });
                  $rootScope.mapas[i].isChecked=false;
                }
              }
            }catch(err){}
          });
        }
        // Move list item Up
        $scope.listItemUp = function (itemIndex) {
         // console.log(itemIndex);
          $scope.moveItem(itemIndex, itemIndex - 1);
        };
        // Move list item down
        $scope.listItemDown = function (itemIndex) {
          //console.log(itemIndex);
          $scope.moveItem(itemIndex, itemIndex + 1);
        };
        $scope.logout=function(){
          $('#dialog-logout').dialog('open');
        };
        function exitApp(){
          Auth.logout();
          //window.location=$rootScope.host+'/site/index.html';
          window.location='http://smallgis.co/';
        }
        //Move item down/up
        $scope.moveItem = function (origin, destination) {
          leafletData.getMap("mapabase").then(function(map) {
            var o=getKey(origin);
            var d=getKey(destination);
            if(o!=0&&d!=0){
              /*console.log(origin+"="+o);
              console.log(destination+"="+d);*/
              var temp1 = $rootScope.capas[destination];
              $rootScope.capas[destination] = $rootScope.capas[origin];
              $rootScope.capas[origin] = temp1;
              //console.log($rootScope.capas);
              clearLayers();
              addLayers();
            }
          });
        };
        //Get layerId from $rootScope.capas
        function getKey(k){
          var vKey=0;
          for(var i=0;i<$rootScope.capas.length;i++){
            if(k==i){
              vKey=parseInt($rootScope.capas[i].id);
              break;
            }
          }
          return vKey;
        }
        $scope.showDialogDrawCtrl = function() {
          if($rootScope.drawLine==false){
             if($rootScope.drawPoint==false){
                  if($rootScope.isLayerEditing==false){
                    if($rootScope.isdrawctrladded==false){
                      $('#dialog').dialog('open');
                    }else{
                      hideDrawCtrl();
                    }
                  }else{
                    alert("Debe de terminar la edición capa.");
                  }
           }else{
              alert("Debe de finalizar de crear el requerimiento.");
           }
          }else{
            alert("Debe de finalizar el perfil de terreno.");
          }
        };
        function hideDrawCtrl(){
          leafletData.getMap("mapabase").then(function(map) {
            $rootScope.drawCtrl.removeFrom(map);
            $rootScope.exitDrawBtn.removeFrom(map);
            $rootScope.isdrawctrladded=false;
          });
        }
        function showDrawCtrlB(val){
          if($rootScope.isdrawctrladded==false&&$rootScope.isLayerEditing==false&&$rootScope.drawLine==false&&$rootScope.drawPoint==false){
            leafletData.getMap("mapabase").then(function(map) {
              if(val==1){
                var name = prompt("Cual es el nombre de la capa?", "");
                // $rootScope.drawnItems.clearLayers();
                $rootScope.drawnItems=new L.FeatureGroup();
                if(name!=""){
                  var options = {
                    position: 'topleft',
                    draw: {
                      rectangle: false,
                      circle: false,
                      polyline:true,
                      polygon:true,
                      marker: true
                    },
                    edit:false
                    /*edit: {
                    featureGroup: $rootScope.drawnItems
                  }*/
                };
                $rootScope.mapOptionsCtrl=options;
                $rootScope.drawCtrl = new L.Control.Draw($rootScope.mapOptionsCtrl);
                $rootScope.drawCtrl.addTo(map);
                $rootScope.flag=1;
                $rootScope.exitDrawBtn.addTo(map);
                $rootScope.clcontrol.addOverlay($rootScope.drawnItems.addTo(map),name);
                var lastId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
                $rootScope.capas.push({id:lastId,nombre:name,tipo:'',descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});

                $rootScope.isdrawctrladded=true;
              }else{
                alert("El nombre de la capa no puede ser vacio.");
              }
            }else{
              var drawnItems=new L.FeatureGroup();
              var options = {
                position: 'topleft',
                draw: {
                  polyline:true,
                  polygon:true,
                  rectangle: false,
                  circle: false,
                  marker: true
                },
                edit:false
                /*edit: {
                featureGroup: drawnItems
              }*/
            };
            $rootScope.drawCtrl = new L.Control.Draw(options);
            $rootScope.drawCtrl.addTo(map);
            $rootScope.exitDrawBtn.addTo(map);
            $rootScope.flag=0;
            $rootScope.isdrawctrladded=true;
          }
        });
      }
    }
    function uploadGpxFile(file){
      leafletData.getMap("mapabase").then(function(map) {
        map.spin(true);
        var reader = new FileReader();
        reader.onload = function(e) {
          var ext;
          if (reader.readyState !== 2 || reader.error) {
            return;
          }
          else {
            ext = file.name.split('.');
            ext = ext[ext.length - 1];
            var name=file.name.slice(0, (0 - (ext.length + 1)));
            var color=geoOperation.get_random_color();
            var contents = e.target.result;
            var type='';
            //console.log(contents);
            var dom = (new DOMParser()).parseFromString(contents, 'text/xml');
            //console.log(dom);
            //omnivore.gpx(dom).addTo(map);
            var fc=parseToGeoJSON.gpx(dom);//Convert kml to featurecollection
            //console.log(fc);
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
                }
              });
              $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
              map.invalidateSize();
              map.fitBounds(geojson.getBounds());
              map.spin(false);

              var lastId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
              var typeG=geoOperation.getTypeGeometryTopoJSON(fc);
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
                    var el=angular.element('#cl-'+lastId);
                    el.css('right', '76px');
                  }
                }
              }
            }
          };
          reader.readAsText(file);
        });
      }
      function uploadKmlFile(file){
        leafletData.getMap("mapabase").then(function(map) {
          map.spin(true);
          var reader = new FileReader();
          reader.onload = function(e) {
            var ext;
            if (reader.readyState !== 2 || reader.error) {
              return;
            }
            else {
              ext = file.name.split('.');
              ext = ext[ext.length - 1];
              var name=file.name.slice(0, (0 - (ext.length + 1)));
              var color=geoOperation.get_random_color();
              var contents = e.target.result;
              var type='';
              var dom = (new DOMParser()).parseFromString(contents, 'text/xml');
              //console.log(dom);
              var fc=parseToGeoJSON.kml(dom);//Convert kml to featurecollection
              //console.log(fc);
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
                  }
                });
                $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
                map.invalidateSize();
                map.fitBounds(geojson.getBounds());
                map.spin(false);

                var lastId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
                var typeG=geoOperation.getTypeGeometryTopoJSON(fc);
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
                      var el=angular.element('#cl-'+lastId);
                      el.css('right', '76px');
                    }
                  }
                }

              }
            };
            reader.readAsText(file);
          });
        }
        function uploadTopoJsonFile(file){
          leafletData.getMap("mapabase").then(function(map) {
            map.spin(true);
            var reader = new FileReader();
            reader.onload = function(e) {
              var ext;
              if (reader.readyState !== 2 || reader.error) {
                return;
              }
              else {
                ext = file.name.split('.');
                ext = ext[ext.length - 1];
                var name=file.name.slice(0, (0 - (ext.length + 1)));
                var color=geoOperation.get_random_color();
                var type='';
                L.TopoJSON = L.GeoJSON.extend(
                  {
                    addData: function(jsonData)
                    {
                      if (jsonData.type === "Topology")
                      {
                        for (var key in jsonData.objects)
                        {
                          var geojson = topojson.feature(	jsonData,
                            jsonData.objects[key]);
                            L.GeoJSON.prototype.addData.call(this, geojson);
                          }
                        }
                        else
                        {
                          L.GeoJSON.prototype.addData.call(this, jsonData);
                        }
                      }
                    });
                    var contents = e.target.result;
                    var json = JSON.parse(JSON.stringify(eval("(" + contents + ")")));
                    //var topoLayer = new L.TopoJSON();
                    var topoLayer = new L.TopoJSON(null, {
                      onEachFeature: function (feature, layer) {
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
                            }else{
                              if(feature.properties['stroke']!=null&&feature.properties['stroke-width']!=null&&feature.properties['stroke-opacity']!=null&&feature.properties['fill']!=null&&feature.properties['fill-opacity']!=null){

                                layer.setStyle({color:feature.properties['stroke'],weight:feature.properties['stroke-width'],opacity:feature.properties['stroke-opacity'],fillOpacity:feature.properties['fill-opacity'],fillColor:feature.properties['fill']});

                              }else if(feature.properties['stroke']!=null&&feature.properties['stroke-width']!=null&&feature.properties['stroke-opacity']!=null){
                                if(feature.properties['line-stroke']!=null){
                                  if(feature.properties['line-stroke']=='stroke1'){
                                    layer.setStyle({stroke: true, color:feature.properties['stroke'], weight:feature.properties['stroke-width'], opacity:feature.properties['stroke-opacity'],dashArray:'1'});
                                  }else if(feature.properties['line-stroke']=='stroke2'){
                                    layer.setStyle({stroke: true, color:feature.properties['stroke'], weight:feature.properties['stroke-width'], opacity:feature.properties['stroke-opacity'],dashArray:'10,10'});
                                  }else if(feature.properties['line-stroke']=='stroke3'){
                                    layer.setStyle({stroke: true, color:feature.properties['stroke'], weight:feature.properties['stroke-width'], opacity:feature.properties['stroke-opacity'],dashArray:'15, 10, 1, 10'});
                                  }

                                }else{
                                  layer.setStyle({stroke: true, color:feature.properties['stroke'], weight:feature.properties['stroke-width'], opacity:feature.properties['stroke-opacity']});
                                }
                              }else {
                                layer.setStyle({stroke: true, color: '#000000', weight:2, fillOpacity: 1.0, fillColor: color});

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
                          }else if (layer instanceof L.Circle) {
                            type = 'Circle';
                          }
                        }
                      });
                      topoLayer.addData(json);
                      $rootScope.clcontrol.addOverlay(topoLayer.addTo(map), name);
                      map.invalidateSize();
                      map.fitBounds(topoLayer.getBounds());
                      map.spin(false);

                      var lastId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
                      var typeG=geoOperation.getTypeGeometryTopoJSON(json);
                      if(typeG=='GeometryCollection'){
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
                            var el=angular.element('#cl-'+lastId);
                            el.css('right', '76px');
                          }
                        }
                      }
                    }
                  };
                  reader.readAsText(file);
                });
              }
              function uploadZipFile(file) {
                leafletData.getMap("mapabase").then(function(map) {
                  map.spin(true);
                  try{
                    var reader = new FileReader();
                    reader.onloadend = function(e){
                      var d = reader.result;
                      var ext = file.name.split('.');
                      ext = ext[ext.length - 1];
                      var name=file.name.slice(0, (0 - (ext.length + 1)));
                      var type='';
                      var color=geoOperation.get_random_color();
                      var geo = L.geoJson({features:[]},{
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

                      shp(d).then(function(data){
                        try{
                          var radio='';
                          var geojson;

                          angular.forEach(data.features, function(value, key){
                            //data.features[key].properties.radius;
                            if (data.features[key].properties.radius!= null){
                              radio=data.features[key].properties.radius
                            }
                          });
                          //console.log(radio);

                          geo.addData(data);
                          $rootScope.clcontrol.addOverlay(geo.addTo(map), name);
                          map.invalidateSize();
                          map.fitBounds(geo.getBounds());

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
                          //console.log( $rootScope.capas);

                          map.spin(false);
                        }catch(err){

                        }
                      });

                      map.spin(false);
                    }
                    //send you binary data via $http or $resource or do anything else with it
                    reader.readAsArrayBuffer(file);
                  }catch(err){
                    console.log(err);
                  }
                });
              }
              function uploadCsvFile(file){
                filecsv=file;
                $('#dialog-csv').dialog('open');
              }
              function handleFile(file,handleFile) {

                try{
                  if (file.name.slice(-3) === 'zip') {
                    return uploadZipFile(file);
                  }else if(file.name.slice(-3) === 'gpx'){
                    return uploadGpxFile(file);
                  }else if(file.name.slice(-3) === 'kml'){
                    return uploadKmlFile(file);
                  }else if(file.name.slice(-3) === 'csv'){
                    return uploadCsvFile(file);
                  }else if(file.name.slice(-8)==='topojson'){
                    return uploadTopoJsonFile(file);
                  }
                  leafletData.getMap("mapabase").then(function(map) {
                    map.spin(true);
                    var reader = new FileReader();
                    reader.onload = function(e) {
                      var ext;
                      if (reader.readyState !== 2 || reader.error) {
                        return;
                      }
                      else {
                        ext = file.name.split('.');
                        ext = ext[ext.length - 1];

                        //alert(reader.result);
                        var contents = e.target.result;
                        var json = JSON.parse(JSON.stringify(eval("(" + contents + ")")));
                        var name=file.name.slice(0, (0 - (ext.length + 1)));
                        var type='';
                        var radio='';
                        var geojson;
                        var typeG=geoOperation.getTypeGeometry(json);
                        var color=geoOperation.get_random_color();

                        angular.forEach(json.features, function(value, key){
                          if (json.features[key].properties!=null){
                            if (json.features[key].properties.radius!= null){
                              radio=json.features[key].properties.radius
                            }
                          }else{
                            json.features[key].properties="";
                          }
                        });
                        geojson=L.geoJson( json, {
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
                              }else if (layer instanceof L.Circle) {
                                type = 'Circle';
                              }

                            }
                          });

                          $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
                          map.invalidateSize();
                          map.fitBounds(geojson.getBounds());

                          var lastId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
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
                          //console.log( $rootScope.capas);
                          map.spin(false);

                        }
                      };

                      reader.readAsText(file);
                    });
                  }catch(err){
                    console.log(err);
                  }
                }
                leafletData.getMap("mapabase").then(function(map) {

                  var bLayers = {
                  };

                  var lc = L.control.layers(bLayers);
                  $rootScope.flag=0;
                  $scope.layer_control=lc;
                  $rootScope.clcontrol=lc;
                  $rootScope.m=map;
                  //var featureGroup = L.featureGroup();
                  /*$rootScope.drawnItems = new L.FeatureGroup();

                  var options = {
                  position: 'topleft',
                  draw: {
                  polyline:true,
                  polygon:true,
                  rectangle: false,
                  circle: false,
                  marker: true
                },
                edit: {
                featureGroup: $rootScope.drawnItems
              }
            };
            $rootScope.mapOptionsCtrl=options;*/
            var NewButton = L.Control.extend({ //creating the buttons
              options: {
                position: 'topleft'
              },
              onAdd: addFunction
            });
            new L.Control.GeoSearch({
              provider: new L.GeoSearch.Provider.Esri()
            }).addTo(map);
            //add them to the map
            map.addControl(new NewButton());
            function makeDiv() {
              var div = L.DomUtil.create('form', 'bgroup');
              div.id = "dropzone";
              return div;
            }
            map.on('draw:created', function(e) {
              var layer=e.layer;
              var type = e.layerType;
              if($rootScope.drawPoint==false){
               if($rootScope.drawLine==false){
                if($rootScope.isLayerEditing==false){
                  if($rootScope.flag==1){
                    if(type==='polyline'){
                      var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                      var geojson=L.geoJson( json, {
                        style: function (feature) {
                          return {stroke: true, color: geoOperation.get_random_color(), weight:4, opacity: 1.0, fill: false};
                        },
                        onEachFeature: function(feature, layer){
                          geoOperation.bindPopup(layer);
                        }
                      });
                      geojson.eachLayer(
                        function(l){
                          $rootScope.drawnItems.addLayer(l);
                        });
                      }else if(type==='marker'){
                        var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                        var geojson=L.geoJson( json, {
                          onEachFeature: function(feature, layer){
                            geoOperation.bindPopup(layer);
                          }
                        });
                        geojson.eachLayer(
                          function(l){
                            $rootScope.drawnItems.addLayer(l);
                          });
                        }else{
                          var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                          var geojson=L.geoJson( json, {
                            style: function (feature) {
                              return {stroke: true, color: '#000000', weight:2, fillOpacity: 1.0, fillColor: geoOperation.get_random_color()};
                            },
                            onEachFeature: function(feature, layer){
                              geoOperation.bindPopup(layer);
                            }
                          });
                          geojson.eachLayer(
                            function(l){
                              $rootScope.drawnItems.addLayer(l);
                            });

                          }
                          var json = JSON.parse(JSON.stringify($rootScope.drawnItems.toGeoJSON()));
                          var id=$rootScope.drawnItems._leaflet_id;
                          var typeG=geoOperation.getTypeGeometry(json);//Returns type of geometry
                          //map.fitBounds(json.getBounds());

                          if(typeG=='FeatureCollection'){
                            for(var i=0;i<$rootScope.capas.length;i++){
                              if(parseInt($rootScope.capas[i].id)==parseInt(id)){
                                $rootScope.capas[i].tipo=fcollection_img;
                              }
                            }
                          }else if(typeG=='Point'){
                            for(var i=0;i<$rootScope.capas.length;i++){
                              if(parseInt($rootScope.capas[i].id)==parseInt(id)){
                                $rootScope.capas[i].tipo=punto_img;
                              }
                            }
                          }else if(typeG=='LineString'){
                            for(var i=0;i<$rootScope.capas.length;i++){
                              if(parseInt($rootScope.capas[i].id)==parseInt(id)){
                                $rootScope.capas[i].tipo=linea_img;
                              }
                            }
                          }else if(typeG=='Polygon'){
                            for(var i=0;i<$rootScope.capas.length;i++){
                              if(parseInt($rootScope.capas[i].id)==parseInt(id)){
                                $rootScope.capas[i].tipo=poligono_img;
                              }
                            }
                          }else{
                            for(var i=0;i<$rootScope.capas.length;i++){
                              if(parseInt($rootScope.capas[i].id)==parseInt(id)){
                                $rootScope.capas[i].tipo=fcollection_img;
                              }
                            }
                          }
                          if(type=='marker'){
                            for(var i=0;i<$rootScope.capas.length;i++){
                              if(parseInt($rootScope.capas[i].id)==parseInt(id)){
                                $rootScope.capas[i].espunto=1;
                              }
                            }
                          }
                          //addCols(parseInt(id));
                          if(tableLayoutIsOpen&&$rootScope.currentLayerId==parseInt(id)){
                            loadTable($rootScope.currentLayerId);
                          }

                        }else{
                          var geoJson = layer.toGeoJSON();

                          if(type==='polyline'){
                            var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                            var geojson=L.geoJson( json, {
                              style: function (feature) {
                                return {stroke: true, color: geoOperation.get_random_color(), weight:4, opacity: 0.5, fill: false};
                              },
                              onEachFeature: function(feature, layer){

                                geoOperation.bindPopup(layer);
                              }
                            });
                            var name = prompt("Cual es el nombre de la capa?", "");
                            if(name==""){
                              name="objeto-"+zCont;
                              zCont=zCont+1;
                            }
                            lc.addOverlay(geojson.addTo(map),name);
                            map.invalidateSize();
                            map.fitBounds(geojson.getBounds());
                            var lastId = Object.keys(lc._layers)[Object.keys(lc._layers).length - 1];
                            $rootScope.capas.push({id:lastId,nombre:name,tipo:linea_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});

                          }else if(type==='marker'){
                            var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                            var geojson=L.geoJson( json, {
                              onEachFeature: function(feature, layer){
                                geoOperation.bindPopup(layer);
                              }
                            });
                            var name = prompt("Cual es el nombre de la capa?", "");
                            if(name==""){
                              name="objeto-"+zCont;
                              zCont=zCont+1;
                            }
                            lc.addOverlay(geojson.addTo(map),name);
                            map.invalidateSize();
                            map.fitBounds(geojson.getBounds());
                            var lastId = Object.keys(lc._layers)[Object.keys(lc._layers).length - 1];
                            $rootScope.capas.push({id:lastId,nombre:name,tipo:punto_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:1,capa:lc._layers[lastId].layer,enabled:true});

                          }else{
                            var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                            var geojson=L.geoJson( json, {
                              style: function (feature) {
                                return {stroke: true, color: '#000000', weight:2, fillOpacity: 1.0, fillColor: geoOperation.get_random_color()};
                              },
                              onEachFeature: function(feature, layer){
                                geoOperation.bindPopup(layer);
                              }
                            });
                            var name = prompt("Cual es el nombre de la capa?", "");
                            if(name==""){
                              name="objeto-"+zCont;
                              zCont=zCont+1;
                            }
                            lc.addOverlay(geojson.addTo(map),name);
                            map.invalidateSize();
                            map.fitBounds(geojson.getBounds());
                            var lastId = Object.keys(lc._layers)[Object.keys(lc._layers).length - 1];
                            var typeG=geoOperation.getTypeGeometry(json);//Returns type of geometry

                            if(typeG=='FeatureCollection'){
                              $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                            }else if(typeG=='Point'){
                              $rootScope.capas.push({id:lastId,nombre:name,tipo:punto_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                            }else if(typeG=='LineString'){
                              $rootScope.capas.push({id:lastId,nombre:name,tipo:linea_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                            }else if(typeG=='Polygon'){
                              $rootScope.capas.push({id:lastId,nombre:name,tipo:poligono_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                            }else{
                              $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                            }
                            if(type=='Point'){
                              for(var i=0;i<$rootScope.capas.length;i++){
                                if(parseInt($rootScope.capas[i].id)==parseInt(lastId)){
                                  $rootScope.capas[i].espunto=1;
                                }
                              }
                            }

                          }
                          //console.log("Tipo dibujado="+type);
                        }
                      }else{

                        map.eachLayer(function (lc) {
                          if (lc._leaflet_id === $rootScope.editingLayerId) {
                            var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                            var tipo=geoOperation.getTypeGeometry(json);
                            var geojson;

                            if(tipo=='Point'){
                              var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                              geojson=L.geoJson( json, {
                                onEachFeature: function(feature, layer){
                                  geoOperation.bindPopup(layer);
                                }
                              });
                            }else if(tipo=='LineString'){
                              var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                              geojson=L.geoJson( json, {
                                style: function (feature) {
                                  return {stroke: true, color: geoOperation.get_random_color(), weight:4, opacity: 1.0, fill: false};
                                },
                                onEachFeature: function(feature, layer){
                                  geoOperation.bindPopup(layer);
                                }
                              });
                            }else if(tipo=='Polygon'){
                              var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                              geojson=L.geoJson( json, {
                                style: function (feature) {
                                  return {stroke: true, color: '#000000', weight:2, fillOpacity: 1.0, fillColor: geoOperation.get_random_color()};
                                },
                                onEachFeature: function(feature, layer){
                                  geoOperation.bindPopup(layer);
                                }
                              });
                            }
                            lc.eachLayer(
                              function(l){
                                $rootScope.drawnItemsEdit.addLayer(l);
                              });
                              geojson.eachLayer(
                                function(l){
                                  $rootScope.drawnItemsEdit.addLayer(l);
                                });
                                var auxLc=lc;
                                map.removeLayer(lc);
                                auxLc._layers=$rootScope.drawnItemsEdit._layers;
                                map.addLayer(auxLc);
                                var id=$rootScope.editingLayerId;
                                for(var i=0;i<$rootScope.capas.length;i++){
                                  if(parseInt($rootScope.capas[i].id)==parseInt(id)){
                                    //if($rootScope.capas[i].tipo==''){
                                    var json = JSON.parse(JSON.stringify($rootScope.drawnItemsEdit.toGeoJSON()));
                                    //var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                                    //console.log(json);
                                    var typeG=geoOperation.getTypeGeometry(json);//Returns type of geometry
                                    //console.log(typeG);
                                    if(typeG=='FeatureCollection'){
                                      $rootScope.capas[i].tipo=fcollection_img;
                                    }else if(typeG=='Point'){
                                      $rootScope.capas[i].tipo=punto_img;
                                    }else if(typeG=='LineString'){
                                      $rootScope.capas[i].tipo=linea_img;
                                    }else if(typeG=='Polygon'){
                                      $rootScope.capas[i].tipo=poligono_img;
                                    }else{
                                      $rootScope.capas[i].tipo=fcollection_img;
                                    }
                                    //}
                                  }
                                }
                                //console.log($rootScope.editingLayerId+" "+$rootScope.editingLayerId+" "+$rootScope.drawnItemsEdit._leaflet_id);
                                addCols($rootScope.editingLayerId);
                                if(tableLayoutIsOpen&&$rootScope.currentLayerId==$rootScope.editingLayerId){
                                  loadTable($rootScope.currentLayerId);
                                }
                              }
                            });
                          }
                        }else{
                          var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                          var geojson=L.geoJson( json, {
                            style: function (feature) {
                              return {stroke: true, color: geoOperation.get_random_color(), weight:4, opacity: 0.5, fill: false};
                            },
                            onEachFeature: function(feature, layer){
                              //geoOperation.bindPopup(layer);
                            }
                          });
                          geojson.eachLayer(
                            function(l){
                              drawnLineItems.addLayer(l);
                            });
                            var layerId=drawnLineItems._leaflet_id;
                            calculateTerrain(layerId);
                          }
                        }else{

                          if(markerAddress!=null){
                            map.removeLayer(markerAddress);
                            var lat,lng,obj;
                            if(isOriginAdded==false){
                              lat=arrReqPts[0].x;
                              lng=arrReqPts[0].y;
                              obj={"nombre": arrReqPts[0].nombre,"persona":arrReqPts[0].persona,"empresa":arrReqPts[0].empresa,"direccion":arrReqPts[0].direccion,"telefono":arrReqPts[0].telefono,"ciudad":arrReqPts[0].ciudad,"pais":arrReqPts[0].pais,"descripcion":arrReqPts[0].descripcion};
                            }else{
                              lat=auxReq1[0].x;
                              lng=auxReq1[0].y;
                              obj={"nombre": auxReq1[0].nombre,"persona":auxReq1[0].persona,"empresa":auxReq1[0].empresa,"direccion":auxReq1[0].direccion,"telefono":auxReq1[0].telefono,"ciudad":auxReq1[0].ciudad,"pais":auxReq1[0].pais,"descripcion":auxReq1[0].descripcion};
                            }

                            var geojsonFeature = {
                              "type": "Feature",
                              "properties": {},
                              "geometry": {
                                "type": "Point",
                                "coordinates": [lng, lat]
                              }
                            };
                            var geojson=L.geoJson(geojsonFeature, {
                                style: function (feature) {
                                },
                                onEachFeature: function(feature, layer){
                                  feature.properties=obj;
                                  var iconSize = [30, 70];
                                  var iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-marker+00FF00.png';
                                  layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                                    iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                                    popupAnchor: [0, -iconSize[1] / 2]}));
                                    //geoOperation.bindPopup(layer);
                                    var content = '<table class="dropchop-table"><tr>';
                                    if (layer.feature.properties) {
                                      for (var prop in layer.feature.properties) {
                                        content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
                                      }
                                    }
                                    content += '</table>';
                                    layer.bindPopup(L.popup({
                                      maxWidth: 450,
                                      maxHeight: 200,
                                      autoPanPadding: [45, 45],
                                      className: 'dropchop-popup'
                                    }, layer).setContent(content));
                                  }
                                });
                                geojson.eachLayer(
                                   function(l){
                                  $rootScope.drawnPointItems.addLayer(l);
                                });
                                markerAddress=null;
                                if(isOriginAdded==false){
                                   updateReqLayer(arrReqPts);
                                }
                            }
                            if(markerAddressDest!=null){
                              map.removeLayer(markerAddressDest);
                              var lat= arrReqPts[0].x1;
                              var lng=  arrReqPts[0].y1;
                              var obj={"nombre": arrReqPts[0].nombre+"(d)","persona":arrReqPts[0].personadestino,"empresa":arrReqPts[0].empresadestino,"direccion":arrReqPts[0].direcciondestino,"telefono":arrReqPts[0].telefonodestino,"ciudad":arrReqPts[0].ciudaddestino,"pais":arrReqPts[0].paisdestino,"descripcion":arrReqPts[0].descripciondestino};
                              var geojsonFeature = {
                                "type": "Feature",
                                "properties": {},
                                "geometry": {
                                  "type": "Point",
                                  "coordinates": [lng, lat]
                                }
                              };
                              var geojson=L.geoJson(geojsonFeature, {
                                style: function (feature) {
                                },
                                onEachFeature: function(feature, layer){
                                  feature.properties=obj;
                                  var iconSize = [30, 70];
                                  var iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-triangle+00FF00.png';
                                  layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                                    iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                                    popupAnchor: [0, -iconSize[1] / 2]}));
                                    //geoOperation.bindPopup(layer);
                                    var content = '<table class="dropchop-table"><tr>';
                                    if (layer.feature.properties) {
                                      for (var prop in layer.feature.properties) {
                                        content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
                                      }
                                    }
                                    content += '</table>';
                                    layer.bindPopup(L.popup({
                                      maxWidth: 450,
                                      maxHeight: 200,
                                      autoPanPadding: [45, 45],
                                      className: 'dropchop-popup'
                                    }, layer).setContent(content));
                                  }
                             });
                             geojson.eachLayer(
                                function(l){
                                  $rootScope.drawnPointItems.addLayer(l);
                             });
                             markerAddressDest=null;
                             updateReqLayer(arrReqPts);
                          }

                          if(isOriginAdded==false){
                               var layerId=$rootScope.drawnPointItems._leaflet_id;

                               $("#dialog-requirement").html("<div><label for='lbl_person_name' style='font-weight:bold;'>Nombre del requerimiento</label>"
                               +"<input type='text' id='reqName' name='reqName' value ='' style='width:100%;'>"
                               +"<label for='lbl_person_name' style='font-weight:bold;'>Nombre de la persona</label>"
                               +"<input type='text' id='reqPerson' name='reqPerson' value ='' style='width:100%;'>"
                               +"<label for='lbl_company' style='font-weight:bold;'>Empresa</label>"
                               +"<input type='text' id='reqCompany' value ='' style='width:100%;'>"
                               +"<label for='lbl_address' style='font-weight:bold;'>Direccion</label>"
                               +"<input type='text' id='reqAddress' name='reqAddress' value ='' style='width:100%;'>"
                               +"<label for='lbl_phone' style='font-weight:bold;'>Telefono</label>"
                               +"<input type='text' id='reqPhone' name='reqPhone' value ='' style='width:100%;'>"
                               +"<label for='lbl_city' style='font-weight:bold;'>Ciudad</label>"
                               +"<input type='text' id='reqCity' name='reqCity' value ='' style='width:100%;'>"
                               +"<label for='lbl_country' style='font-weight:bold;'>Pais</label>"
                               +"<input type='text' id='reqCountry' name='reqCountry' value ='' style='width:100%;'>"
                               +"<label for='lbl_country' style='font-weight:bold;'>Descripcion</label>"
                               +"<input type='text' id='reqDescripcion' name='reqDescripcion' value ='' style='width:100%;'>"
                               +"<input type='checkbox' id='destination' name='destination'>Tiene punto de entrega?</div>"
                             );
                              $("#dialog-requirement").dialog({
                                  resizable: false,
                                  modal: true,
                                  title: "Crear un nuevo requerimiento",
                                  height: 545,
                                  width: 400,
                                  buttons: {
                                      "Aceptar": function () {
                                        var nombre=$("#reqName").val();
                                        var reqPerson=$("#reqPerson").val();
                                        var reqCompany=$("#reqCompany").val();
                                        var reqAddress=$("#reqAddress").val();
                                        var reqPhone=$("#reqPhone").val();
                                        var reqCity=$("#reqCity").val();
                                        var reqCountry=$("#reqCountry").val();
                                        var reqDes=$("#reqDescripcion").val();
                                        var destChk=$("#destination").is(':checked');

                                        if(nombre===''||reqPerson===''||reqCompany===''||reqAddress===''||reqPhone===''||reqCity===''||reqCountry===''||reqDes===''){
                                             alert("Debe de completar todos los campos.");
                                        }else{
                                              if(geoOperation.validateRequirementName($rootScope.capasreq[0].nombre,nombre)==false){
                                                 coords_1 = [];
                                                 var obj={"nombre":nombre,"persona":reqPerson,"empresa":reqCompany,"direccion":reqAddress,"telefono":reqPhone,"ciudad":reqCity,"pais":reqCountry,"descripcion":reqDes};
                                                 var json=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                                                 var geojson=L.geoJson( json, {
                                                   style: function (feature) {

                                                   },
                                                   onEachFeature: function(feature, layer){
                                                       feature.properties=obj;
                                                       //console.log(feature.properties);
                                                       //console.log(layer.feature.properties);
                                                       var iconSize = [30, 70];
                                                       var iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-marker+00FF00.png';
                                                       layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                                                         iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                                                         popupAnchor: [0, -iconSize[1] / 2]}));
                                                       coords_1.push(feature.geometry.coordinates);
                                                       //geoOperation.bindPopup(layer);
                                                       var content = '<table class="dropchop-table"><tr>';
                                                       if (layer.feature.properties) {
                                                          for (var prop in layer.feature.properties) {
                                                           content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
                                                          }
                                                       }
                                                       content += '</table>';
                                                       layer.bindPopup(L.popup({
                                                            maxWidth: 450,
                                                            maxHeight: 200,
                                                            autoPanPadding: [45, 45],
                                                            className: 'dropchop-popup'
                                                       }, layer).setContent(content));
                                                   }
                                                 });
                                                 //console.log(geojson);
                                                 geojson.eachLayer(
                                                   function(l){
                                                     $rootScope.drawnPointItems.addLayer(l);
                                                 });
                                                 //map.invalidateSize();
                                                 //map.fitBounds(geojson.getBounds());
                                                 var dt = new Date();
                                                 var h=dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
                                                 var x=coords_1[0][1];
                                                 var y=coords_1[0][0];
                                                 var z=0;

                                                if(destChk){
                                                  isOriginAdded=true;
                                                  $(this).dialog('close');
                                                  auxReq1.push({client_id:'',hora_creacion:h,hora_asignacion:'',hora_cierre:'',x:x,y:y,z:z,nombre:nombre,persona:reqPerson,empresa:reqCompany,direccion:reqAddress,telefono:reqPhone,ciudad:reqCity,pais:reqCountry,descripcion:reqDes});
                                                }else{
                                                  arrReqPts.push({client_id:'',hora_creacion:h,hora_asignacion:'',hora_cierre:'',x:x,y:y,z:z,nombre:nombre,persona:reqPerson,empresa:reqCompany,direccion:reqAddress,telefono:reqPhone,ciudad:reqCity,pais:reqCountry,descripcion:reqDes,recogido:'',personadestino:'',empresadestino:'',direcciondestino:'',telefonodestino:'',ciudaddestino:'',paisdestino:'',descripciondestino:'',x1:0,y1:0,z1:0,entregado:'',createdby:'',status:'nuevo'});
                                                  updateReqLayer(arrReqPts);
                                                  $(this).dialog('close');
                                                }

                                              }else{
                                                alert("Ya existe un requerimiento con el mismo nombre "+nombre);
                                              }
                                         }
                                      }
                                  }
                              });
                              $('#dialog-requirement').dialog('open');
                            }else{
                              var layerId=$rootScope.drawnPointItems._leaflet_id;
                              $("#dialog-requirement-dest").html("<div><label for='lbl_person_name' style='font-weight:bold;'>Nombre de la persona</label>"
                              +"<input type='text' id='reqPersonDest' name='reqPersonDest' value ='' style='width:100%;'>"
                              +"<label for='lbl_company' style='font-weight:bold;'>Empresa</label>"
                              +"<input type='text' id='reqCompanyDest' value ='' style='width:100%;'>"
                              +"<label for='lbl_address' style='font-weight:bold;'>Direccion</label>"
                              +"<input type='text' id='reqAddressDest' name='reqAddressDest' value ='' style='width:100%;'>"
                              +"<label for='lbl_phone' style='font-weight:bold;'>Telefono</label>"
                              +"<input type='text' id='reqPhoneDest' name='reqPhoneDest' value ='' style='width:100%;'>"
                              +"<label for='lbl_city' style='font-weight:bold;'>Ciudad</label>"
                              +"<input type='text' id='reqCityDest' name='reqCityDest' value ='' style='width:100%;'>"
                              +"<label for='lbl_country' style='font-weight:bold;'>Pais</label>"
                              +"<input type='text' id='reqCountryDest' name='reqCountryDest' value ='' style='width:100%;'>"
                              +"<label for='lbl_country' style='font-weight:bold;'>Descripcion</label>"
                              +"<input type='text' id='reqDescripcionDest' name='reqDescripcionDest' value ='' style='width:100%;'></div>"
                            );
                            $("#dialog-requirement-dest").dialog({
                                resizable: false,
                                modal: true,
                                title: "Punto de entrega",
                                height: 480,
                                width: 400,
                                buttons: {
                                    "Aceptar": function () {
                                      var reqPersonDest=$("#reqPersonDest").val();
                                      var reqCompanyDest=$("#reqCompanyDest").val();
                                      var reqAddressDest=$("#reqAddressDest").val();
                                      var reqPhoneDest=$("#reqPhoneDest").val();
                                      var reqCityDest=$("#reqCityDest").val();
                                      var reqCountryDest=$("#reqCountryDest").val();
                                      var reqDesDest=$("#reqDescripcionDest").val();
                                      if( reqPersonDest===''||reqCompanyDest===''||reqAddressDest===''||reqPhoneDest===''||reqCityDest===''||reqCountryDest===''||reqDesDest===''){
                                         alert("Debe de completar todos los campos.");
                                      }else{
                                        var obj1={"nombre":auxReq1[0].nombre+"(d)","persona":reqPersonDest,"empresa":reqCompanyDest,"direccion":reqAddressDest,"telefono":reqPhoneDest,"ciudad":reqCityDest,"pais":reqCountryDest,"descripcion":reqDesDest};
                                        var json2=JSON.parse(JSON.stringify(layer.toGeoJSON()));
                                        var geojson2=L.geoJson(json2, {
                                              style: function (feature) {
                                              },
                                              onEachFeature: function(feature, layer){
                                                   feature.properties=obj1;
                                                   var iconSize = [30, 70];
                                                   var iconURL='http://api.tiles.mapbox.com/v3/marker/pin-m-triangle+00FF00.png';
                                                   layer.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                                                     iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                                                     popupAnchor: [0, -iconSize[1] / 2]}));
                                                   coords_1.push(feature.geometry.coordinates);
                                                   var content = '<table class="dropchop-table"><tr><td rowspan="2" align="center"><strong>Destino</strong></td></tr><tr>';
                                                   if (layer.feature.properties) {
                                                      for (var prop in layer.feature.properties) {
                                                       content += '<tr><td><strong>' + prop + '</strong></td><td>' + layer.feature.properties[prop] + '</td></tr>';
                                                      }
                                                   }
                                                   content += '</table>';
                                                   layer.bindPopup(L.popup({
                                                        maxWidth: 450,
                                                        maxHeight: 200,
                                                        autoPanPadding: [45, 45],
                                                        className: 'dropchop-popup'
                                                   }, layer).setContent(content));
                                              }
                                        });
                                        geojson2.eachLayer(
                                           function(l){
                                             $rootScope.drawnPointItems.addLayer(l);
                                        });
                                        var x_2=coords_1[1][1];
                                        var y_2=coords_1[1][0];
                                        var z_2=0;
                                        arrReqPts.push({client_id:auxReq1[0].client_id,hora_creacion:auxReq1[0].hora_creacion,hora_asignacion:'',hora_cierre:'',x:auxReq1[0].x,y:auxReq1[0].y,z:auxReq1[0].z,nombre:auxReq1[0].nombre,persona:auxReq1[0].persona,empresa:auxReq1[0].empresa,direccion:auxReq1[0].direccion,telefono:auxReq1[0].telefono,ciudad:auxReq1[0].ciudad,pais:auxReq1[0].pais,descripcion:auxReq1[0].descripcion,recogido:'',personadestino:reqPersonDest,empresadestino:reqCompanyDest,direcciondestino:reqAddressDest,telefonodestino:reqPhoneDest,ciudaddestino:reqCityDest,paisdestino:reqCountryDest,descripciondestino:reqDesDest,x1:x_2,y1:y_2,z1:z_2,entregado:'',createdby:'',status:'nuevo'});
                                        isOriginAdded=false;
                                        updateReqLayer(arrReqPts);
                                        auxReq1=[];
                                        $( this ).dialog( "close" );
                                      }
                                    }
                                 }
                              });
                              $('#dialog-requirement-dest').dialog('open');
                              //alert('Debe de terminar de asignar el destino.');
                            }
                          }
                        });

                        map.on('draw:edited', function (e) {
                          var layers = e.layers;
                          layers.eachLayer(function (layer) {
                            var geoJson=layer.toGeoJSON();//Convert the layer to geojson
                            var text=JSON.stringify(geoJson);//Convert the geojson to text
                            //console.log("Edited:"+text);
                          });
                        });
                        map.on('draw:deleted', function (e) {
                          var layers = e.layers;
                          layers.eachLayer(function (layer) {
                            var geoJson=layer.toGeoJSON();//Convert the layer to geojson
                            var text=JSON.stringify(geoJson);//Convert the geojson to text
                            //console.log("l-ID="+layer._leaflet_id);
                            if($rootScope.isLayerEditing){
                              if(tableLayoutIsOpen&&$rootScope.currentLayerId==$rootScope.editingLayerId){
                                loadTable($rootScope.currentLayerId);
                              }
                              map.eachLayer(function (layer) {
                                try{
                                  var layers=layer._layers;//Get all the layers added to the map
                                  var n=Object.keys(layers).length;//Number of sub layers
                                  var layerId=layer._leaflet_id;

                                  if(n>0){
                                    var contNoVisible=0;
                                    angular.forEach(layers, function(value, key){
                                      if(map.hasLayer(layers[key])==false){
                                        contNoVisible=contNoVisible+1;
                                        layer.removeLayer(layers[key]);//Remove layer son from the layer's father
                                      }
                                    });
                                    if(n==contNoVisible){
                                      map.removeLayer(layer);
                                      //Delete layer associated with the layerId
                                      for(var i=0;i<$rootScope.capas.length;i++){
                                        var id=parseInt($rootScope.capas[i].id);
                                        if(layerId==id){
                                          if(tableLayoutIsOpen&&$rootScope.currentLayerId==layerId){
                                            var obj='{}';
                                            tableColsName=[];
                                            fillTable(tableColsName,obj);
                                            $scope.layout['tablalayout'] = !$scope.layout['tablalayout'];
                                            tableLayoutIsOpen=false;
                                            $scope.nombreCapa="";
                                          }else if(tableLayoutIsOpen==false&&$rootScope.currentLayerId==layerId){
                                            var obj='{}';
                                            tableColsName=[];
                                            fillTable(tableColsName,obj);
                                            $scope.nombreCapa="";
                                          }
                                          $rootScope.capas.splice(i, 1);
                                          try{
                                            var b1=contains(arrClusterPoints,layerId);
                                            if(b1){
                                              var clusterId=getClusterId(arrClusterPoints, layerId);
                                              map.eachLayer(function (layer) {
                                                if (layer._leaflet_id === clusterId) {
                                                  map.removeLayer(layer);
                                                  removeElement(arrClusterPoints, layerId);//Remove element id from arrClusterPoints array
                                                  //clusterCtrlIsAdded=false;
                                                  delete $rootScope.clcontrol._layers[clusterId];
                                                }
                                              });
                                            }
                                            var b2=contains(arrHeatLayers,layerId);
                                            if(b2){
                                              removeElement(arrHeatLayers, layerId);
                                            }
                                            if(arrHeatLayers.length==0){
                                              var heatId=parseInt(arrHeatPoints[0].heatId);
                                              map.eachLayer(function (layer) {
                                                if (layer._leaflet_id === heatId) {
                                                  map.removeLayer(layer);
                                                  //heatCtrlIsAdded=false;
                                                  delete $rootScope.clcontrol._layers[heatId];
                                                }
                                              });
                                              arrHeatPoints=[];
                                            }

                                          }catch(err){

                                          }
                                        }
                                      }
                                      $rootScope.drawCtrlEdit.removeFrom(map);
                                      $rootScope.exitEditBtn.removeFrom(map);
                                      $rootScope.isLayerEditing=false;
                                      $rootScope.editingLayerId=0;
                                    }
                                  }
                                }catch(err){

                                }
                              });
                            }else{

                            }
                          });
                          /*if($rootScope.isLayerEditing){
                          $('#dialog-edit-layer').dialog('open');
                        }*/
                      });
                      map.on('popupopen', function (e) {

                        var sel = d3.select(e.popup._contentNode);
                        sel.selectAll('.add').on('click', addRow);
                        sel.selectAll('.cancel').on('click', clickClose);
                        sel.selectAll('.delete-invert').on('click', removeFeature);
                        sel.selectAll('.save').on('click', saveFeature);
                        function clickClose() {
                          map.closePopup(e.popup);
                        }
                        function removeFeature() {
                          if (e.popup._source && map.hasLayer(e.popup._source)) {
                            console.log(e.popup._source);
                            //Remove the layer from map
                            var parentId=getParentLayerId(e.popup._source);
                            map.removeLayer(e.popup._source);

                            if(tableLayoutIsOpen&&$rootScope.currentLayerId==parentId){
                              loadTable($rootScope.currentLayerId);
                            }
                            map.eachLayer(function (layer) {
                              try{
                                var layers=layer._layers;//Get all the layers added to the map
                                if(layers!=null){

                                  var n=Object.keys(layers).length;//Number of sub layers
                                  var layerId=layer._leaflet_id;
                                  if(n>0){
                                    var contNoVisible=0;
                                    angular.forEach(layers, function(value, key){
                                      if(map.hasLayer(layers[key])==false){
                                        contNoVisible=contNoVisible+1;
                                        layer.removeLayer(layers[key]);//Remove layer son from the layer's father
                                      }
                                    });

                                    if(n==contNoVisible){
                                      map.removeLayer(layer);
                                      //Delete layer associated with the layerId
                                      for(var i=0;i<$rootScope.capas.length;i++){
                                        var id=parseInt($rootScope.capas[i].id);
                                        if(layerId==id){
                                          if(tableLayoutIsOpen&&$rootScope.currentLayerId==parentId){
                                            var obj='{}';
                                            tableColsName=[];
                                            fillTable(tableColsName,obj);
                                            $scope.layout['tablalayout'] = !$scope.layout['tablalayout'];
                                            tableLayoutIsOpen=false;
                                            $scope.nombreCapa="";
                                          }else if(tableLayoutIsOpen==false&&$rootScope.currentLayerId==layerId){
                                            var obj='{}';
                                            tableColsName=[];
                                            fillTable(tableColsName,obj);
                                            $scope.nombreCapa="";
                                          }
                                          $rootScope.capas.splice(i, 1);
                                          try{
                                            var b1=contains(arrClusterPoints,layerId);
                                            if(b1){
                                              var clusterId=getClusterId(arrClusterPoints, layerId);
                                              map.eachLayer(function (layer) {
                                                if (layer._leaflet_id === clusterId) {
                                                  map.removeLayer(layer);
                                                  removeElement(arrClusterPoints, layerId);//Remove element id from arrClusterPoints array
                                                  //clusterCtrlIsAdded=false;
                                                  delete $rootScope.clcontrol._layers[clusterId];
                                                }
                                              });
                                            }
                                            var b2=contains(arrHeatLayers,layerId);
                                            if(b2){
                                              removeElement(arrHeatLayers, layerId);
                                            }
                                            if(arrHeatLayers.length==0){
                                              var heatId=parseInt(arrHeatPoints[0].heatId);
                                              map.eachLayer(function (layer) {
                                                if (layer._leaflet_id === heatId) {
                                                  map.removeLayer(layer);
                                                  //heatCtrlIsAdded=false;
                                                  delete $rootScope.clcontrol._layers[heatId];
                                                }
                                              });
                                              arrHeatPoints=[];
                                            }

                                          }catch(err){

                                          }
                                        }
                                      }
                                    }
                                  }

                                }

                              }catch(err){
                                console.log(err);
                              }
                            });
                          }
                        }
                        function losslessNumber(x) {
                          var fl = parseFloat(x);
                          if (fl.toString() === x) return fl;
                          else return x;
                        }
                        function saveFeature() {
                          var obj = {};
                          var table = sel.select('table.marker-properties');
                          table.selectAll('tr').each(collectRow);
                          function collectRow() {
                            if (d3.select(this).selectAll('input')[0][0].value) {
                              obj[d3.select(this).selectAll('input')[0][0].value] =
                              losslessNumber(d3.select(this).selectAll('input')[0][1].value);
                            }
                          }
                          //console.log(obj);
                          if(obj['marker-color']!=null){
                            //Get marker-color, marker-size and marker-symbol from popup table
                            var mSize="s";
                            var markerColor=obj['marker-color'];
                            var markerSize=obj['marker-size'];
                            var markerSymbol=obj['marker-symbol'];
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
                                e.popup._source.setIcon(new L.Icon({iconUrl: iconURL,  iconSize: iconSize,
                                  iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
                                  popupAnchor: [0, -iconSize[1] / 2]}));
                                  //e.popup._source._icon.style.backgroundColor = markerColor;
                                  var latlng=e.popup._source._latlng;
                                  map.panTo(latlng);
                                }
                              }
                            }else{
                              //Get stroke, stroke-width, stroke-opacity, fill and fill-opacity from popup table
                              var strokeColor=obj['stroke'];
                              var strokeWidth=obj['stroke-width'];
                              var opacity=obj['stroke-opacity'];
                              var fill=obj['fill'];
                              var fillOpacity=obj['fill-opacity'];

                              var style={
                                color: strokeColor,
                                weight: strokeWidth,
                                opacity: opacity,
                                fillOpacity:fillOpacity,
                                fillColor: fill
                              };
                              //Set layer style in case of polygon
                              e.popup._source.setStyle(style);
                            }
                            //console.log(obj);
                            //var b=validateColumn(obj);
                            //Get the parent layer Id
                            var parentId=getParentLayerId(e.popup._source);
                            //console.log(parentId);
                            //if(b){
                            e.popup._source.feature.properties = obj;

                            geoOperation.bindPopup(e.popup._source);
                            //Method to add new column to all the layers from popup
                            addColumns(parentId, e.popup._source._leaflet_id, obj);
                            map.closePopup(e.popup);
                            //Verifies if the tableLayout is open with the current parentId
                            if(tableLayoutIsOpen&&$rootScope.currentLayerId==parentId){
                              loadTable(parentId);
                            }
                            //}
                          }
                          function addRow() {
                            var tr = sel.select('table.marker-properties tbody')
                            .append('tr');

                            tr.append('th')
                            .append('input')
                            .attr('type', 'text');

                            tr.append('td')
                            .append('input')
                            .attr('type', 'text');
                          }

                        });
                        //Get parent ID from layer
                        function getParentLayerId(source){
                          var layerId=0;
                          var found=false;
                          map.eachLayer(function (layer) {
                            try{
                              if (layer.hasLayer(source)) {
                                if(found==false){
                                  layerId=layer._leaflet_id;
                                  found=true;
                                }
                                //return layerId;
                              }
                            }catch(err){}
                          });
                          return layerId;
                        }

                        //Get requirement layer points from objson response in /api/requirements/:reqid
                        function getReqPoints(obj){
                         var array = new Array();
                         var jsonPts=jQuery.parseJSON(JSON.stringify(eval("(" + obj + ")")));
                         for(var i=0;i<jsonPts.points.length;i++){
                             array.push({client_id:jsonPts.points[i].point.client_id,hora_creacion:jsonPts.points[i].point.hora_creacion,hora_asignacion:jsonPts.points[i].point.hora_asignacion,hora_cierre:jsonPts.points[i].point.hora_cierre,x:jsonPts.points[i].point.x,y:jsonPts.points[i].point.y,z:jsonPts.points[i].point.z,nombre:jsonPts.points[i].point.nombre,persona:jsonPts.points[i].point.persona,empresa:jsonPts.points[i].point.empresa,direccion:jsonPts.points[i].point.direccion,telefono:jsonPts.points[i].point.telefono,ciudad:jsonPts.points[i].point.ciudad,pais:jsonPts.points[i].point.pais,descripcion:jsonPts.points[i].point.descripcion,recogido:jsonPts.points[i].point.recogido,personadestino:jsonPts.points[i].point.personadestino,empresadestino:jsonPts.points[i].point.empresadestino,direcciondestino:jsonPts.points[i].point.direcciondestino,telefonodestino:jsonPts.points[i].point.telefonodestino,ciudaddestino:jsonPts.points[i].point.ciudaddestino,paisdestino:jsonPts.points[i].point.paisdestino,descripciondestino:jsonPts.points[i].point.descripciondestino,x2:jsonPts.points[i].point.x2,y2:jsonPts.points[i].point.y2,z2:jsonPts.points[i].point.z2,entregado:jsonPts.points[i].point.entregado,status:jsonPts.points[i].point.status});
                         }
                         return array;
                        }
                        function addColumns(parentLayerId, layerId, obj){
                          var arr=[];
                          var cont=0;
                          angular.forEach(obj, function(value, key){
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
                                                //console.log(key+"="+value);
                                                arr[cont]=key;
                                                cont++;
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
                          //console.log(arr);
                          map.eachLayer(function (layer) {
                            if (layer._leaflet_id==parentLayerId) {
                              var layers=layer._layers;
                              angular.forEach(layers, function(value, key){
                                if(layerId!=parseInt(key)){
                                  var len=Object.keys(layers[key].feature.properties).length;
                                  if(len>0){
                                    var objson='{';
                                    angular.forEach(layers[key].feature.properties, function(value1, key1){
                                      // console.log(key1+"="+value1);
                                      objson=objson+'"'+key1+'" : "'+value1+'",';
                                    });

                                    for(var i=0;i<arr.length;i++){
                                      //console.log(layers[key].feature.properties[arr[i]]);
                                      var val=layers[key].feature.properties[arr[i]];
                                      if(val!=null){
                                        objson=objson+'"'+arr[i]+'" : "'+val+'",';
                                      }else{
                                        //val=" ";
                                        objson=objson+'"'+arr[i]+'" :"",';
                                      }
                                    }
                                    objson = objson.substring(0, objson.length - 1);
                                    objson=objson+'}';
                                    var obj=JSON.parse(objson);
                                    //var obj = angular.fromJson(objson);
                                    layers[key].feature.properties=obj;
                                    geoOperation.bindPopup(layers[key]);
                                  }

                                }
                              });
                            }
                          });

                        }
                        function addCols(layerId){
                          tableRows={};
                          tableColsName=[];
                          var propsName;
                          $scope.selectTableColumn=[];
                          map.eachLayer(function (layer) {
                            if (layer._leaflet_id === layerId) {
                              var layers=layer._layers;
                              angular.forEach(layers, function(value, key){
                                try{
                                  var len=Object.keys(layers[key].feature.properties).length;
                                  if(len>0){

                                    propsName=layers[key].feature.properties;
                                    return false;
                                  }
                                }catch(err){

                                }
                              });
                              var i=0;
                              angular.forEach(propsName, function(value, key){
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
                                                    tableColsName[i]=key;
                                                    i++;
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
                              //console.log(tableColsName);
                              angular.forEach(layers, function(value, key){
                                try{
                                  var len=Object.keys(layers[key].feature.properties).length;
                                  //console.log(len);
                                  if(len==0){
                                    var objson='{';
                                    for(var i=0;i<tableColsName.length;i++){
                                      objson=objson+'"'+tableColsName[i]+'" :"",';
                                    }
                                    objson = objson.substring(0, objson.length - 1);
                                    objson=objson+'}';
                                    var obj=JSON.parse(objson);
                                    layers[key].feature.properties=obj;
                                    geoOperation.bindPopup(layers[key]);
                                  }
                                }catch(err){

                                }
                              });
                            }
                          });
                        }
                        function handleFileCSV(file){
                          filecsv=file;
                          $('#dialog-csv').dialog('open');
                        }
                        function handleZipFile(file) {
                          try{
                            var reader = new FileReader();
                            reader.readAsArrayBuffer(file);
                            reader.onloadend = function(event){
                              var d = reader.result;
                              var ext = file.name.split('.');
                              ext = ext[ext.length - 1];
                              var name=file.name.slice(0, (0 - (ext.length + 1)));
                              var type='';
                              var color=geoOperation.get_random_color();
                              var geo = L.geoJson({features:[]},{
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

                              shp(reader.result).catch(function(error) {
                                console.log("Problematic projection - ", error);
                              }).then(function(data){
                                if (!data) {
                                  //alert('error', 'Invalid projection or shapefile.', 2500);
                                }
                                try{
                                  var radio='';
                                  var geojson;

                                  angular.forEach(data.features, function(value, key){
                                    //data.features[key].properties.radius;
                                    if (data.features[key].properties.radius!= null){
                                      radio=data.features[key].properties.radius
                                    }
                                  });
                                  //console.log(radio);

                                  geo.addData(data);
                                  lc.addOverlay(geo.addTo(map), name);
                                  map.invalidateSize();
                                  map.fitBounds(geo.getBounds());

                                  var lastId = Object.keys(lc._layers)[Object.keys(lc._layers).length - 1];

                                  var typeG=geoOperation.getTypeGeometry(data);

                                  if(typeG=='FeatureCollection'){
                                    $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                  }else if(typeG=='Point'){
                                    $rootScope.capas.push({id:lastId,nombre:name,tipo:punto_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                  }else if(typeG=='LineString'){
                                    $rootScope.capas.push({id:lastId,nombre:name,tipo:linea_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                  }else if(typeG=='Polygon'){
                                    $rootScope.capas.push({id:lastId,nombre:name,tipo:poligono_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                  }else{
                                    $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                  }
                                  if(type=='Point'){
                                    for(var i=0;i<$rootScope.capas.length;i++){
                                      if(parseInt($rootScope.capas[i].id)==parseInt(lastId)){
                                        $rootScope.capas[i].espunto=1;
                                      }
                                    }
                                  }

                                  map.spin(false);

                                }catch(err){
                                  console.log(err);
                                }
                              });

                              //map.spin(false);
                            };
                            //send you binary data via $http or $resource or do anything else with it

                          }catch(err){
                            console.log(err);
                          }
                        }

                        $scope.showUbication = function() {
                          var latitude = 0;
                          var longitude = 0;
                          leafletData.getMap("mapabase").then(function(map) {
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition(function(position) {
                                latitude = position.coords.latitude;
                                longitude = position.coords.longitude;
                                //console.log(latitude+" "+longitude);
                                // this is just a marker placed in that position and add the marker as a new layer
                                var geojsonFeature = {
                                  "type": "Feature",
                                  "properties": {},
                                  "geometry": {
                                    "type": "Point",
                                    "coordinates": [longitude, latitude]
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
                                var name="Posicion actual "+$rootScope.currentPos;
                                $rootScope.clcontrol.addOverlay(geojson.addTo(map), name);
                                var lastId = Object.keys($rootScope.clcontrol._layers)[Object.keys($rootScope.clcontrol._layers).length - 1];
                                $rootScope.capas.push({id:lastId,nombre:name,tipo:punto_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:1,capa:$rootScope.clcontrol._layers[lastId].layer,enabled:true});
                                $rootScope.currentPos=$rootScope.currentPos+1;

                                map.invalidateSize();
                                map.fitBounds(geojson.getBounds());
                              });
                            }
                          });
                        };
                        function makeUp(div,handleFile) {
                          /*  var upButton = L.DomUtil.create('input', 'upStuff', div);
                          upButton.type = "file";
                          upButton.id = "input";
                          upButton.onchange = function() {
                          var file = document.getElementById("input").files[0];
                          handleFile(file);
                        };
                        return upButton;*/
                      }
                      function handleGpxFile(file){
                        var reader = new FileReader();
                        reader.onload = function(e) {
                          var ext;
                          if (reader.readyState !== 2 || reader.error) {
                            return;
                          }
                          else {
                            ext = file.name.split('.');
                            ext = ext[ext.length - 1];
                            var name=file.name.slice(0, (0 - (ext.length + 1)));
                            var color=geoOperation.get_random_color();
                            var contents = e.target.result;
                            var type='';
                            //console.log(contents);
                            var dom = (new DOMParser()).parseFromString(contents, 'text/xml');
                            //console.log(dom);
                            //omnivore.gpx(dom).addTo(map);
                            var fc=parseToGeoJSON.gpx(dom);//Convert kml to featurecollection
                            //console.log(fc);
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
                                }
                              });
                              lc.addOverlay(geojson.addTo(map), name);
                              map.invalidateSize();
                              map.fitBounds(geojson.getBounds());
                              map.spin(false);

                              var lastId = Object.keys(lc._layers)[Object.keys(lc._layers).length - 1];
                              var typeG=geoOperation.getTypeGeometryTopoJSON(fc);
                              if(typeG=='FeatureCollection'){
                                $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                              }else if(typeG=='Point'){
                                $rootScope.capas.push({id:lastId,nombre:name,tipo:punto_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                              }else if(typeG=='LineString'){
                                $rootScope.capas.push({id:lastId,nombre:name,tipo:linea_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                              }else if(typeG=='Polygon'){
                                $rootScope.capas.push({id:lastId,nombre:name,tipo:poligono_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                              }else{
                                $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                              }
                              if(type=='Point'){
                                for(var i=0;i<$rootScope.capas.length;i++){
                                  if(parseInt($rootScope.capas[i].id)==parseInt(lastId)){
                                    $rootScope.capas[i].espunto=1;
                                    var el=angular.element('#cl-'+lastId);
                                    el.css('right', '76px');
                                  }
                                }
                              }
                            }
                          };
                          reader.readAsText(file);
                        }
                        function handleKmlFile(file){
                          var reader = new FileReader();
                          reader.onload = function(e) {
                            var ext;
                            if (reader.readyState !== 2 || reader.error) {
                              return;
                            }
                            else {
                              ext = file.name.split('.');
                              ext = ext[ext.length - 1];
                              var name=file.name.slice(0, (0 - (ext.length + 1)));
                              var color=geoOperation.get_random_color();
                              var contents = e.target.result;
                              var type='';
                              var dom = (new DOMParser()).parseFromString(contents, 'text/xml');
                              //console.log(dom);
                              var fc=parseToGeoJSON.kml(dom);//Convert kml to featurecollection
                              //console.log(fc);
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
                                  }
                                });
                                lc.addOverlay(geojson.addTo(map), name);
                                map.invalidateSize();
                                map.fitBounds(geojson.getBounds());
                                map.spin(false);

                                var lastId = Object.keys(lc._layers)[Object.keys(lc._layers).length - 1];
                                var typeG=geoOperation.getTypeGeometryTopoJSON(fc);
                                if(typeG=='FeatureCollection'){
                                  $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                }else if(typeG=='Point'){
                                  $rootScope.capas.push({id:lastId,nombre:name,tipo:punto_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                }else if(typeG=='LineString'){
                                  $rootScope.capas.push({id:lastId,nombre:name,tipo:linea_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                }else if(typeG=='Polygon'){
                                  $rootScope.capas.push({id:lastId,nombre:name,tipo:poligono_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                }else{
                                  $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                }
                                if(type=='Point'){
                                  for(var i=0;i<$rootScope.capas.length;i++){
                                    if(parseInt($rootScope.capas[i].id)==parseInt(lastId)){
                                      $rootScope.capas[i].espunto=1;
                                      var el=angular.element('#cl-'+lastId);
                                      el.css('right', '76px');
                                    }
                                  }
                                }

                              }
                            };
                            reader.readAsText(file);
                          }
                          function handleFileTopoJson(file){
                            var reader = new FileReader();
                            reader.onload = function(e) {
                              var ext;
                              if (reader.readyState !== 2 || reader.error) {
                                return;
                              }
                              else {
                                ext = file.name.split('.');
                                ext = ext[ext.length - 1];
                                var name=file.name.slice(0, (0 - (ext.length + 1)));
                                var color=geoOperation.get_random_color();
                                var type='';
                                L.TopoJSON = L.GeoJSON.extend(
                                  {
                                    addData: function(jsonData)
                                    {
                                      if (jsonData.type === "Topology")
                                      {
                                        for (var key in jsonData.objects)
                                        {
                                          var geojson = topojson.feature(	jsonData,
                                            jsonData.objects[key]);
                                            L.GeoJSON.prototype.addData.call(this, geojson);
                                          }
                                        }
                                        else
                                        {
                                          L.GeoJSON.prototype.addData.call(this, jsonData);
                                        }
                                      }
                                    });
                                    var contents = e.target.result;
                                    var json = JSON.parse(JSON.stringify(eval("(" + contents + ")")));
                                    //var topoLayer = new L.TopoJSON();
                                    var topoLayer = new L.TopoJSON(null, {
                                      onEachFeature: function (feature, layer) {
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
                                            }else{
                                              if(feature.properties['stroke']!=null&&feature.properties['stroke-width']!=null&&feature.properties['stroke-opacity']!=null&&feature.properties['fill']!=null&&feature.properties['fill-opacity']!=null){

                                                layer.setStyle({color:feature.properties['stroke'],weight:feature.properties['stroke-width'],opacity:feature.properties['stroke-opacity'],fillOpacity:feature.properties['fill-opacity'],fillColor:feature.properties['fill']});

                                              }else if(feature.properties['stroke']!=null&&feature.properties['stroke-width']!=null&&feature.properties['stroke-opacity']!=null){
                                                if(feature.properties['line-stroke']!=null){
                                                  if(feature.properties['line-stroke']=='stroke1'){
                                                    layer.setStyle({stroke: true, color:feature.properties['stroke'], weight:feature.properties['stroke-width'], opacity:feature.properties['stroke-opacity'],dashArray:'1'});
                                                  }else if(feature.properties['line-stroke']=='stroke2'){
                                                    layer.setStyle({stroke: true, color:feature.properties['stroke'], weight:feature.properties['stroke-width'], opacity:feature.properties['stroke-opacity'],dashArray:'10,10'});
                                                  }else if(feature.properties['line-stroke']=='stroke3'){
                                                    layer.setStyle({stroke: true, color:feature.properties['stroke'], weight:feature.properties['stroke-width'], opacity:feature.properties['stroke-opacity'],dashArray:'15, 10, 1, 10'});
                                                  }

                                                }else{
                                                  layer.setStyle({stroke: true, color:feature.properties['stroke'], weight:feature.properties['stroke-width'], opacity:feature.properties['stroke-opacity']});
                                                }
                                              }else {
                                                layer.setStyle({stroke: true, color: '#000000', weight:2, fillOpacity: 1.0, fillColor: color});

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
                                          }else if (layer instanceof L.Circle) {
                                            type = 'Circle';
                                          }
                                        }
                                      });
                                      topoLayer.addData(json);
                                      lc.addOverlay(topoLayer.addTo(map), name);
                                      map.invalidateSize();
                                      map.fitBounds(topoLayer.getBounds());
                                      map.spin(false);

                                      var lastId = Object.keys(lc._layers)[Object.keys(lc._layers).length - 1];
                                      var typeG=geoOperation.getTypeGeometryTopoJSON(json);
                                      if(typeG=='GeometryCollection'){
                                        $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                      }else if(typeG=='Point'){
                                        $rootScope.capas.push({id:lastId,nombre:name,tipo:punto_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                      }else if(typeG=='LineString'){
                                        $rootScope.capas.push({id:lastId,nombre:name,tipo:linea_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                      }else if(typeG=='Polygon'){
                                        $rootScope.capas.push({id:lastId,nombre:name,tipo:poligono_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                      }else{
                                        $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                      }
                                      if(type=='Point'){
                                        for(var i=0;i<$rootScope.capas.length;i++){
                                          if(parseInt($rootScope.capas[i].id)==parseInt(lastId)){
                                            $rootScope.capas[i].espunto=1;
                                            var el=angular.element('#cl-'+lastId);
                                            el.css('right', '76px');
                                          }
                                        }
                                      }
                                    }
                                  };
                                  reader.readAsText(file);
                                }
                                function handleFile(file,handleFile) {

                                  map.spin(true);
                                  if (file.name.slice(-3) === 'zip') {
                                    return handleZipFile(file);
                                  }else if (file.name.slice(-3) === 'gpx') {
                                    return handleGpxFile(file);
                                  }else if(file.name.slice(-3)==='kml'){
                                    return handleKmlFile(file);
                                  }else if(file.name.slice(-3)==='csv'){
                                    return handleFileCSV(file);
                                  }else if(file.name.slice(-8)==='topojson'){
                                    return handleFileTopoJson(file);
                                  }
                                  var reader = new FileReader();
                                  var color=geoOperation.get_random_color();
                                  reader.onload = function(e) {
                                    var ext;
                                    if (reader.readyState !== 2 || reader.error) {
                                      return;
                                    }
                                    else {
                                      ext = file.name.split('.');
                                      ext = ext[ext.length - 1];

                                      //alert(reader.result);
                                      var contents = e.target.result;
                                      var json = JSON.parse(JSON.stringify(eval("(" + contents + ")")));
                                      var name=file.name.slice(0, (0 - (ext.length + 1)));
                                      var type='';
                                      var radio='';
                                      var geojson;
                                      var typeG=geoOperation.getTypeGeometry(json);
                                      //console.log("Type of feauture:"+typeG);

                                      angular.forEach(json.features, function(value, key){
                                        if (json.features[key].properties!=null){
                                          if (json.features[key].properties.radius!= null){
                                            radio=json.features[key].properties.radius
                                          }
                                        }else{
                                          json.features[key].properties="";
                                        }
                                      });


                                      geojson=L.geoJson( json, {
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
                                            }else if (layer instanceof L.Circle) {
                                              type = 'Circle';
                                            }

                                          }
                                        });

                                        lc.addOverlay(geojson.addTo(map), name);
                                        map.invalidateSize();
                                        map.fitBounds(geojson.getBounds());

                                        var lastId = Object.keys(lc._layers)[Object.keys(lc._layers).length - 1];

                                        if(typeG=='FeatureCollection'){
                                          $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                        }else if(typeG=='Point'){
                                          $rootScope.capas.push({id:lastId,nombre:name,tipo:punto_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                        }else if(typeG=='LineString'){
                                          $rootScope.capas.push({id:lastId,nombre:name,tipo:linea_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                        }else if(typeG=='Polygon'){
                                          $rootScope.capas.push({id:lastId,nombre:name,tipo:poligono_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                        }else{
                                          $rootScope.capas.push({id:lastId,nombre:name,tipo:fcollection_img,descripcion:'',usuario:$rootScope.username,empresa:$rootScope.company,espunto:0,capa:lc._layers[lastId].layer,enabled:true});
                                        }
                                        if(type=='Point'){
                                          for(var i=0;i<$rootScope.capas.length;i++){
                                            if(parseInt($rootScope.capas[i].id)==parseInt(lastId)){
                                              $rootScope.capas[i].espunto=1;
                                              var el=angular.element('#cl-'+lastId);
                                              el.css('right', '76px');
                                            }
                                          }
                                        }
                                        //console.log($rootScope.capas);
                                        //console.log(lc._layers[lastId].layer);
                                        map.spin(false);
                                      }
                                    };
                                    //reader.readAsArrayBuffer(file);
                                    reader.readAsText(file);
                                  }
                                  function makeDone(div, upButton) {

                                  }

                                  function addFunction(map) {
                                    // create the control container with a particular class name
                                    var div = makeDiv();
                                    var upButton = makeUp(div,handleFile);
                                    //setWorkerEvents()
                                    var doneButton = makeDone(div, upButton);
                                    var x=document.getElementsByClassName("sidebar-map");
                                    var dropbox = x[0];
                                    dropbox.addEventListener("dragenter", dragenter, false);
                                    dropbox.addEventListener("dragover", dragover, false);
                                    dropbox.addEventListener("drop", drop, false);
                                    dropbox.addEventListener("dragleave", function() {
                                      map.scrollWheelZoom.enable();
                                    }, false);

                                    function dragenter(e) {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      map.scrollWheelZoom.disable();
                                    }

                                    function dragover(e) {
                                      e.stopPropagation();
                                      e.preventDefault();
                                    }

                                    function drop(e) {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      map.scrollWheelZoom.enable();
                                      var dt = e.dataTransfer;
                                      var files = dt.files;

                                      var i = 0;
                                      var len = files.length;
                                      //alert(len);

                                      if (!len) {
                                        return
                                      }
                                      while (i < len) {
                                        handleFile(files[i]);
                                        i++;
                                      }
                                    }
                                    return div;
                                  }

                                });
                              }
                            })();
