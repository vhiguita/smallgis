(function() {
    'use strict';

    angular
        .module('smallgisApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('capa', {
            parent: 'entity',
            url: '/capa',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'smallgisApp.capa.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/capa/capas.html',
                    controller: 'CapaController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('capa');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('capa-detail', {
            parent: 'entity',
            url: '/capa/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'smallgisApp.capa.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/capa/capa-detail.html',
                    controller: 'CapaDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('capa');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Capa', function($stateParams, Capa) {
                    return Capa.get({id : $stateParams.id}).$promise;
                }]
            }
        })
        .state('capa.new', {
            parent: 'capa',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/capa/capa-dialog.html',
                    controller: 'CapaDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                features:null,
                                descripcion:null,
                                type: null,
                                nombre: null,
                                empresa: null,
                                usuario: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('capa', null, { reload: true });
                }, function() {
                    $state.go('capa');
                });
            }]
        })
        .state('capa.edit', {
            parent: 'capa',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/capa/capa-dialog.html',
                    controller: 'CapaDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Capa', function(Capa) {
                            return Capa.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('capa', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('capa.delete', {
            parent: 'capa',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/capa/capa-delete-dialog.html',
                    controller: 'CapaDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Capa', function(Capa) {
                            return Capa.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('capa', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
