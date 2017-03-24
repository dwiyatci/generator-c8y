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

  function Controller() {
    var vm = this;

    vm.$onInit = onInit;

    ////////////

    function onInit() {
      vm.text = vm.text || 'hello, world';
    }
  }
}());
