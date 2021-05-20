  (function() {
    'use strict';

    angular
    .module('smallgisApp')
    .controller('RegisterController', RegisterController);


    RegisterController.$inject = ['$translate', '$timeout', 'Auth', 'LoginService','Empresa','Empresa1','Empresa2','User1'];

    function RegisterController ($translate, $timeout, Auth, LoginService, Empresa, Empresa1, Empresa2, User1) {
      var vm = this;
      vm.doNotMatch = null;
      vm.error = null;
      vm.errorUserExists = null;
      vm.login = LoginService.open;
      vm.register = register;
      vm.registerAccount = {};
      vm.success = null;
      var elem = document.getElementById('business');
      elem.style.height = "0px";
      elem.style.visibility = 'hidden';
      var elem1 = document.getElementById('chkadmin');
      elem1.style.visibility = 'hidden';
      var elem2 = document.getElementById('lbl-admin');
      elem2.style.visibility = 'hidden';
      var elem3=document.getElementById('business-content');
      elem3.style.height = "10px";
      var elem4 = document.getElementById('businessCode');
      elem4.style.height = "0px";
      elem4.style.visibility = 'hidden';
      var elem5 = document.getElementById('business-text');
      elem5.style.visibility = 'hidden';
      var elem6 = document.getElementById('basic-text');
      elem6.style.visibility = 'hidden';
      vm.registerAccount.businessType='Personal';//Company identificacion (NIT in spanish), ='Personal' for personal only
      vm.registerAccount.businessCode='FREE';//Indicates a free account for personal use only
      vm.registerAccount.chkbusiness=false;
      vm.registerAccount.chkbusiness_=false;
      vm.registerAccount.chkadmin=false;
      vm.registerAccount.countryCode='AR';
      var businessPlan='Exploracion';
      vm.registerAccount.userPlan=businessPlan;
      vm.submitted = false;

      $timeout(function (){angular.element('#login').focus();});

      function register () {
        vm.submitted = true;
        //console.log(vm.registerAccount);
        if (vm.registerAccount.password !== vm.confirmPassword) {
          vm.doNotMatch = 'ERROR';
        } else {
          vm.registerAccount.langKey = $translate.use();
          vm.doNotMatch = null;
          vm.error = null;
          vm.errorUserExists = null;
          vm.errorEmailExists = null;
          vm.errorCompanyId=null;
          vm.errorCompanyCode=null;
          vm.expiredAccount=null;
          vm.numberOfUsersBP=null;
          vm.numberOfUsers=null;
          vm.errorAdminExists=null;
          vm.errorCredentials=null;

          if(vm.registerAccount.userPlan=='Exploracion'){
            Auth.createAccount(vm.registerAccount).then(function () {
              vm.success = 'OK';
            }).catch(function (response) {
              vm.success = null;
              if (response.status === 400 && response.data === 'login already in use') {
                vm.errorUserExists = 'ERROR';
              } else if (response.status === 400 && response.data === 'e-mail address already in use') {
                vm.errorEmailExists = 'ERROR';
              } else {
                vm.error = 'ERROR';
              }
            });
          }else{
            if (vm.registerAccount.businessCode === '') {
              vm.error = 'ERROR';
            }else{
        
             if(vm.registerAccount.userPlan=='Basico'){
                Empresa1.get({empresacode:vm.registerAccount.businessCode},function(result){
                  var tipoPlan=result.tipoPlan;
                  if(tipoPlan=='BP'){
                    vm.registerAccount.businessType=result.empresaNit;
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
                    var dateTime=year+'-'+m+'-'+d+" "+h;
                    var fecha=result.fecha;
                    var fechaFinal = new Date(dateTime);
                    var fechaInicio = new Date(fecha);
                    var fechaResta = fechaFinal - fechaInicio;
                    var ndays=(((fechaResta / 1000) / 60) / 60) / 24;
                    if(ndays>30){
                       vm.expiredAccount = 'ERROR';
                    }else{
                      User1.get({companyCode:vm.registerAccount.businessType},function(d){
                        if(d!=null){
                          var n=d.length;
                          if(n==1){
                            vm.numberOfUsersBP = 'ERROR';
                          }else if(n==0){
                             Auth.createAccount(vm.registerAccount).then(function () {
                                vm.success = 'OK';
                             }).catch(function (response) {
                                vm.success = null;
                              if (response.status === 400 && response.data === 'login already in use') {
                                vm.errorUserExists = 'ERROR';
                              } else if (response.status === 400 && response.data === 'e-mail address already in use') {
                                vm.errorEmailExists = 'ERROR';
                              } else {
                                vm.error = 'ERROR';
                              }
                            });
                          }
                        }
                       },
                      function(){
                       
                      });
                    }
                  }else{
                    vm.errorCredentials='ERROR';
                  }
                },
                function(){
                  vm.errorCompanyCode = 'ERROR';
                });
            }else if(vm.registerAccount.userPlan=='Corporativo'){
              Empresa.get({empresanit:vm.registerAccount.businessType},function(){
                Empresa1.get({empresacode:vm.registerAccount.businessCode},function(){
                  Empresa2.get({empresanit:vm.registerAccount.businessType,empresacode:vm.registerAccount.businessCode},function(result){
                  var tipoPlan=result.tipoPlan;
                  if(tipoPlan=='CP'){
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
                    var dateTime=year+'-'+m+'-'+d+" "+h;
                    var fecha=result.fecha;
                    var fechaFinal = new Date(dateTime);
                    var fechaInicio = new Date(fecha);
                    var fechaResta = fechaFinal - fechaInicio;
                    var ndays=(((fechaResta / 1000) / 60) / 60) / 24;
                    if(ndays>30){
                        vm.expiredAccount = 'ERROR';
                    }else{
                      User1.get({companyCode:vm.registerAccount.businessType},function(d){
                        if(d!=null){
                          var n=d.length;
                          if(n>=1&&n<11){
                            if(vm.registerAccount.isAdmin){
                              var contAdmin=0;
                              for(var i=0;i<d.length;i++){
                                if(d[i].isAdmin){
                                  contAdmin=contAdmin+1;
                                }
                              }
                              if(contAdmin==0){
                                Auth.createAccount(vm.registerAccount).then(function () {
                                  vm.success = 'OK';
                                }).catch(function (response) {
                                  vm.success = null;
                                  if (response.status === 400 && response.data === 'login already in use') {
                                    vm.errorUserExists = 'ERROR';
                                  } else if (response.status === 400 && response.data === 'e-mail address already in use') {
                                    vm.errorEmailExists = 'ERROR';
                                  } else {
                                    vm.error = 'ERROR';
                                  }
                                });
                              }else{
                                  vm.errorAdminExists= 'ERROR';
                              }
                            }else{
                              Auth.createAccount(vm.registerAccount).then(function () {
                                vm.success = 'OK';
                              }).catch(function (response) {
                                vm.success = null;
                                if (response.status === 400 && response.data === 'login already in use') {
                                  vm.errorUserExists = 'ERROR';
                                } else if (response.status === 400 && response.data === 'e-mail address already in use') {
                                  vm.errorEmailExists = 'ERROR';
                                } else {
                                  vm.error = 'ERROR';
                                }
                              });
                            }
                           
                          }else if(n==0){
                            Auth.createAccount(vm.registerAccount).then(function () {
                              vm.success = 'OK';
                            }).catch(function (response) {
                              vm.success = null;
                              if (response.status === 400 && response.data === 'login already in use') {
                                vm.errorUserExists = 'ERROR';
                              } else if (response.status === 400 && response.data === 'e-mail address already in use') {
                                vm.errorEmailExists = 'ERROR';
                              } else {
                                vm.error = 'ERROR';
                              }
                            });
                          }else if(n==11){
                            vm.numberOfUsers = 'ERROR';
                          }
                        }
                       },
                      function(){
                     
                      });
                    }
                   }else{

                   }
                  },
                  function(){

                  });
                },
                function(){
                 vm.errorCompanyCode = 'ERROR';
               });
              },
              function(){
               vm.errorCompanyId = 'ERROR';
             });
            }
          }
        }   
      }
     }
      //Check if it is a business type plan
      vm.handleClick= function($event) {
          //alert($event);
          if($event){
            elem.style.height = "34px";
            elem.style.visibility = 'visible';
            elem1.style.visibility = 'visible';
            elem2.style.visibility = 'visible';
            elem3.style.height = "auto";
            elem4.style.height = "34px";
            elem4.style.visibility = 'visible';
            elem5.style.visibility = 'visible';
            elem6.style.visibility = 'hidden';
            vm.registerAccount.businessType='';
            vm.registerAccount.businessCode='';
            businessPlan='Corporativo';
            vm.registerAccount.chkbusiness_=false;
            $('#business-text').css('line-height','14px');
            $('#businessCode').css('margin-top','0px');
          }else{
            elem.style.height = "0px";
            elem.style.visibility = 'hidden';
            elem1.style.visibility = 'hidden';
            elem2.style.visibility = 'hidden';
            elem3.style.height = "10px";
            elem4.style.height = "0px";
            elem4.style.visibility = 'hidden';
            elem5.style.visibility = 'hidden';
            elem6.style.visibility = 'hidden';
            vm.registerAccount.businessType='Personal';
            vm.registerAccount.businessCode='FREE';//Indicates a free account for personal use only
            businessPlan='Exploracion';
            $('#businessCode').css('margin-top','0px');
          }
          vm.registerAccount.userPlan=businessPlan;
        }

        vm.handleClick_= function($event){
          if($event){
            elem.style.height = "0px";
            elem.style.visibility = 'hidden';
            elem1.style.visibility = 'hidden';
            elem2.style.visibility = 'hidden';
            elem3.style.height = "auto";
            elem4.style.height = "34px";
            elem4.style.visibility = 'visible';
            elem5.style.visibility = 'hidden';
            elem6.style.visibility = 'visible';
            vm.registerAccount.businessType='P';
            vm.registerAccount.businessCode='';
            businessPlan='Basico';
            vm.registerAccount.chkbusiness=false;
            $('#business-text').css('line-height','0px');
            $('#businessCode').css('margin-top','-20px');
          }else{
            elem.style.height = "0px";
            elem.style.visibility = 'hidden';
            elem1.style.visibility = 'hidden';
            elem2.style.visibility = 'hidden';
            elem3.style.height = "10px";
            elem4.style.height = "0px";
            elem4.style.visibility = 'hidden';
            elem5.style.visibility = 'hidden';
            elem6.style.visibility = 'hidden';
            vm.registerAccount.businessType='Personal';
            vm.registerAccount.businessCode='FREE';//Indicates a free account for personal use only
            businessPlan='Exploracion';
            $('#businessCode').css('margin-top','0px');
          }
          vm.registerAccount.userPlan=businessPlan;
        }

      //Check if it is an admin user after of acquiring a business plan
      vm.handleAdminClick= function($event) {
        if($event){
          vm.registerAccount.isAdmin=true;
        }else{
          vm.registerAccount.isAdmin=false;
        }
          //alert($event+" "+vm.registerAccount.isAdmin);
        }
      }
    })();
