(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('aplicacion', {
            parent: 'entity',
            url: '/aplicacion',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'smallgisApp.aplicacion.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/aplicacion/aplicacions.html',
                    controller: 'AplicacionController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('aplicacion');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('aplicacion-detail', {
            parent: 'entity',
            url: '/aplicacion/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'smallgisApp.aplicacion.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/aplicacion/aplicacion-detail.html',
                    controller: 'AplicacionDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('aplicacion');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Aplicacion', function($stateParams, Aplicacion) {
                    return Aplicacion.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('aplicacion.new', {
            parent: 'aplicacion',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/aplicacion/aplicacion-dialog.html',
                    controller: 'AplicacionDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                titulo: null,
                                mapid: null,
                                empresa: null,
                                usuario: null,
                                descripcion: null,
                                tipoApp: null,
                                espublico: null,
                                fecha: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('aplicacion', null, { reload: true });
                }, function() {
                    $state.go('aplicacion');
                });
            }]
        })
        .state('aplicacion.edit', {
            parent: 'aplicacion',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/aplicacion/aplicacion-dialog.html',
                    controller: 'AplicacionDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Aplicacion', function(Aplicacion) {
                            return Aplicacion.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('aplicacion', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('aplicacion.delete', {
            parent: 'aplicacion',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/aplicacion/aplicacion-delete-dialog.html',
                    controller: 'AplicacionDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Aplicacion', function(Aplicacion) {
                            return Aplicacion.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('aplicacion', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
