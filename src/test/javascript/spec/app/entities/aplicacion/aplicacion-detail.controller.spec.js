'use strict';

describe('Controller Tests', function() {

    describe('Aplicacion Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockAplicacion;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockAplicacion = jasmine.createSpy('MockAplicacion');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Aplicacion': MockAplicacion
            };
            createController = function() {
                $injector.get('$controller')("AplicacionDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'smallgisApp:aplicacionUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
