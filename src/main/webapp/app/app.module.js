(function() {
    'use strict';

    angular
        .module('smallgisApp', [
            'ngStorage',
            'tmh.dynamicLocale',
            'pascalprecht.translate',
            'ngResource',
            'ngCookies',
            'ngAria',
            'ngCacheBuster',
            'ngFileUpload',
            'ngTouch',
            'ui.bootstrap',
            'ui.bootstrap.datetimepicker',
            'ui.router',
            'infinite-scroll',
            'nemLogging',
            'ui-leaflet',
            'eehNavigation',
            'ng-mfb',
            'angularCircularNavigation',
            'ngMaterial',
            'ngMessages',
            'dndLists',
            'sasrio.angular-material-sidenav',
            'angular-accordion',
            'angularAwesomeSlider',
            'ngjsColorPicker',
            'ui.colorpicker',
            'bgDirectives',
            'data-table',
            'ui.layout',
            'ui.grid',
            'ui.grid.autoResize',
            'ui.grid.resizeColumns',
            'ui.grid.edit',
            'ui.grid.moveColumns',
            'ui.grid.selection',
            'ui.grid.exporter',
            'ngAnimate',
            'ngPopover',
            'angularModalService',
                        // jhipster-needle-angularjs-add-module JHipster will add new module here
            'angular-loading-bar',
            //'angulartics',
            //'angulartics.google.analytics'
        ])
        .run(run);

    run.$inject = ['stateHandler', 'translationHandler'];

    function run(stateHandler, translationHandler) {
        stateHandler.initialize();
        translationHandler.initialize();
    }
})();
