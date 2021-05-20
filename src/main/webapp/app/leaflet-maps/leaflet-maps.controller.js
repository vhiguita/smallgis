(function() {
    'use strict';

    angular
      .module('smallgisApp')
      .controller('LeafletMapsController', LeafletMapsController);

    LeafletMapsController.$inject = ['$scope', 'leafletData', '$mdDialog', '$timeout', '$mdSidenav', '$mdDialog'];

    function LeafletMapsController($scope, leafletData, $mdDialog, $timeout, $mdSidenav, $mdIconProvider) {
      angular.extend($scope, {

        center: {
          autoDiscover: true
        },
        overlays: {
          zoomControl:false,
          search: {
            name: 'search',
            type: 'group',
            visible: false,
            layerParams: {
              showOnSelector: false
            }
          }
        }
      });

      leafletData.getLayers().then(function(baselayers) {
        console.log(baselayers.overlays.search);
        angular.extend($scope.controls, {
          search: {
            layer: baselayers.overlays.search
          }
        });
      });

      leafletData.getMap().then(function(map) {
        map.removeControl(map.zoomControl);
      /*  map.addControl(new L.Control.Search({
          url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
          jsonpParam: 'json_callback',
          propertyName: 'display_name',
          propertyLoc: ['lat', 'lon'],
          circleLocation: true,
          markerLocation: true,
          autoType: false,
          autoCollapse: true,
          minLength: 2,
          zoomControl: false,
          zoom: 20
        }));*/
      });

/*Opciones controlar SideNavs 0 1 2
$scope.openSideNav0 = function() {
    $mdSidenav('left0').toggle();
  };
$scope.openSideNav1 = function() {
      $mdSidenav('left1').toggle();
    };
$scope.openSideNav2 = function() {
        $mdSidenav('left2').toggle();
      };*/
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

/* Gestión de la lista de capas*/
/* Toggle between adding and removing the "active" and "show" classes when the user clicks on one of the "Section" buttons. The "active" class is used to add a background color to the current button when its belonging panel is open. The "show" class is used to open the specific accordion panel */
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].onclick = function(){
        this.classList.toggle("active");
        this.nextElementSibling.classList.toggle("show");
    }
}

var linea_img = 'content/images/line.svg';
var poligono_img = 'content/images/polygon.svg';
var punto_img = 'content/images/punto.svg';
var fcollection_img = 'content/images/fcollection.svg';
var configurar = 'content/images/SVG/controls.svg';
$scope.capas = [
  {
    tipo : linea_img,
    nombre: 'Capa1 arreglada',
    descripcion: 'Descripción de la capa1 y sus componentes',
    correo: 'john@example.com',
    empresa: " Empresa"
  },
  {
    tipo : poligono_img,
    nombre: 'Capa2',
    descripcion: 'Descripción de la capa2 y sus componentes',
    correo: 'john@example.com',
    empresa: " Empresa"
  },
  {
    tipo : punto_img,
    nombre: 'Capa3',
    descripcion: 'Descripción de la capa3 y sus componentes',
    correo: 'john@example.com',
    empresa: " Empresa"
  },
  {
    tipo : fcollection_img,
    nombre: 'Capa4',
    descripcion: 'Descripción de la capa4 y sus componentes',
    correo: 'john@example.com',
    empresa: " Empresa"
  },
  {
    tipo : linea_img,
    nombre: 'Capa5',
    descripcion: 'Descripción de la capa5 y sus componentes',
    correo: 'john@example.com',
    empresa: " Empresa"
  },
  {
    tipo : linea_img,
    nombre: 'Capa6',
    descripcion: 'Descripción de la capa6 y sus componentes',
    correo: 'john@example.com',
    empresa: " Empresa"
  },
  {
    tipo : linea_img,
    nombre: 'Capa7',
    descripcion: 'Descripción de la capa7 y sus componentes',
    correo: 'john@example.com',
    empresa: " Empresa"
  },
  {
    tipo : linea_img,
    nombre: 'Capa8',
    descripcion: 'Descripción de la capa8 y sus componentes',
    correo: 'john@example.com',
    empresa: " Empresa"
  },
  {
    tipo : linea_img,
    nombre: 'Capa9',
    descripcion: 'Descripción de la capa9 y sus componentes',
    correo: 'john@example.com',
    empresa: " Empresa"
  },
  {
    tipo : linea_img,
    nombre: 'Capa10',
    descripcion: 'Descripción de la capa10 y sus componentes',
    correo: 'john@example.com',
    empresa: " Empresa"
  },
  {
    tipo : linea_img,
    nombre: 'Capa11',
    descripcion: 'Descripción de la capa11 y sus componentes',
    correo: 'john@example.com',
    empresa: " Empresa"
  },
];

// Gestión de tabla de atributos
var $table = $('table.scroll'),
    $bodyCells = $table.find('tbody tr:first').children(),
    colWidth;

// Adjust the width of thead cells when window resizes
$(window).resize(function() {
    // Get the tbody columns width array
    colWidth = $bodyCells.map(function() {
        return $(this).width();
    }).get();

    // Set the width of thead columns
    $table.find('thead tr').children().each(function(i, v) {
        $(v).width(colWidth[i]);
    });
}).resize(); // Trigger resize handler



    }
  })();
