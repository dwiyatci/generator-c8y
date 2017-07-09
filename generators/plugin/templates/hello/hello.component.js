(function () {
  'use strict';

  angular
    .module('c8y.pocs.hello')
    .component('c8yHello', {
      templateUrl: ':::PLUGIN_PATH:::/hello.html',
      bindings: {
        text: '@'
      },
      controller: Controller,
      controllerAs: 'vm'
    });

  /* @ngInject */
  function Controller() {
    const vm = this;

    _.assign(vm, { $onInit });

    ////////////

    function $onInit() {
      vm.text = vm.text || 'hello, world';
    }
  }
}());
