(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('mapa', {
            parent: 'entity',
            url: '/mapa',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'smallgisApp.mapa.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/mapa/mapas.html',
                    controller: 'MapaController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('mapa');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('mapa-detail', {
            parent: 'entity',
            url: '/mapa/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'smallgisApp.mapa.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/mapa/mapa-detail.html',
                    controller: 'MapaDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('mapa');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Mapa', function($stateParams, Mapa) {
                    return Mapa.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('mapa.new', {
            parent: 'mapa',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/mapa/mapa-dialog.html',
                    controller: 'MapaDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                titulo: null,
                                empresa: null,
                                usuario: null,
                                descripcion:null,
                                capas: null,
                                esprivado:false,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('mapa', null, { reload: true });
                }, function() {
                    $state.go('mapa');
                });
            }]
        })
        .state('mapa.edit', {
            parent: 'mapa',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/mapa/mapa-dialog.html',
                    controller: 'MapaDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Mapa', function(Mapa) {
                            return Mapa.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('mapa', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('mapa.delete', {
            parent: 'mapa',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/mapa/mapa-delete-dialog.html',
                    controller: 'MapaDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Mapa', function(Mapa) {
                            return Mapa.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('mapa', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
