'use strict';

describe('Directive: app2', function () {

  // load the directive's module and view
  beforeEach(module('cartophyNgApp'));
  beforeEach(module('app/account/apps/templates/app2/app2.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<app2></app2>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the app2 directive');
  }));
});
