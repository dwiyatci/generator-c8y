(function () {
  'use strict';

  angular
    .module('c8y.pocs.hello')
    .run(runBlock);

  /* @ngInject */
  function runBlock(
    c8ySystem
  ) {
    c8ySystem.getUIVersion()
      .then((version) => console.log(version));

    // Put your fiddle code here.
    console.log('hello, world');
  }
}());
