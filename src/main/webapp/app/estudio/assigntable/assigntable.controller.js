(function() {
'use strict';
angular
    .module('smallgisApp')
    .controller('assigntableController', assigntableController);

assigntableController.$inject = ['$scope', '$element','close','geoOperation','Requirement','leafletData','$timeout','$rootScope'];

function assigntableController($scope, $element,close,geoOperation,Requirement,leafletData,$timeout,$rootScope){

 //  This close function doesn't need to use jQuery or bootstrap, because
 //  the button has the 'data-dismiss' attribute.
 $scope.gridReqOptions = {
     enableColumnResizing: true,
     data: 'dataInfo',
     enableSorting: true,
     columnDefs: [
      {
            name:'Nombre',
            field : 'Nombre'
      },
      {
            name:'Dispositivo',
            field : 'Dispositivo'
      },
      {
            name:'Capa',
            field : 'Capa'
      },
      {
            name:'Hora_asignacion',
            field : 'Hora_asignacion'
      },
      {
            name:'Hora_cierre',
            field : 'Hora_cierre'
      },
      {
            name:'Estado',
            field : 'Estado'
      }
    ]
  };
  $rootScope.arrAssignedRequirements=[];//Array of assigned requirements
  init();  
  function init(){
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
          var val=returnOb[i].id;
          var reqid=returnOb[i].reqid;
          var company=returnOb[i].companyid;
          var reqDate=returnOb[i].fecha;
          var jsonPts=jQuery.parseJSON(JSON.stringify(eval("(" + returnOb[i].features + ")")));
          for(var j=0;j<jsonPts.points.length;j++){
            var status=jsonPts.points[j].point.status;//Requirement status
            if(status=='asignado' || status=='cerrado'){
                var nombre=jsonPts.points[j].point.nombre;//Requirement name
                var device=jsonPts.points[j].point.client_id;//Device name 
                var aH=jsonPts.points[j].point.hora_asignacion;//Assigned time
                var cH=jsonPts.points[j].point.hora_cierre;//Closed time
                $rootScope.arrAssignedRequirements.push({Nombre:nombre,Dispositivo:device,Capa:reqid,Hora_asignacion:aH,Hora_cierre:cH,Estado:status});
            }
          }
         } 
        }
      },error: function(xhr) {
        console.log(xhr);
        //console.clear();
      }
    });
    $rootScope.columInfo=[];
    $rootScope.columInfo.push({name:'Nombre',field:'Nombre',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false});
    $rootScope.columInfo.push({name:'Dispositivo',field:'Dispositivo',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false});
    $rootScope.columInfo.push({name:'Capa',field:'Capa',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false});
    $rootScope.columInfo.push({name:'Hora_asignacion',field:'Hora_asignacion',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false});
    $rootScope.columInfo.push({name:'Hora_cierre',field:'Hora_cierre',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false});
    $rootScope.columInfo.push({name:'Estado',field:'Estado',enableSorting: false,enableFullRowSelection: true,enableRowSelection: true, enableRowHeaderSelection: false, cellEditableCondition:false});
    $scope.gridReqOptions.columnDefs=$rootScope.columInfo;
    $scope.dataInfo = $rootScope.arrAssignedRequirements;
    $scope.gridReqOptions.data.concat($rootScope.arrAssignedRequirements);
  }
  $scope.close = function(result) {
   close(result, 500); // close, but give 500ms for bootstrap to animate
  };
  //Execute assignment requirement
  $scope.process = function(result) {
    $element.modal('hide');
    close(result, 500); // close, but give 500ms for bootstrap to animate
  };
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
