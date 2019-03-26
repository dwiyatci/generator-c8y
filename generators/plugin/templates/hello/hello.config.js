(() => {
  'use strict';

  angular.module('c8y.pocs.hello').config(configure);

  function configure(c8yNavigatorProvider, c8yViewsProvider) {
    'ngInject';

    c8yNavigatorProvider.addNavigation({
      name: 'hello',
      icon: 'cube',
      priority: 100000,
      path: 'hello'
    });

    c8yViewsProvider.when('/hello', {
      templateUrl: ':::PLUGIN_PATH:::/main.html'
    });
  }
})();
