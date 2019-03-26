(() => {
  'use strict';

  angular.module('c8y.pocs.hello').run(runBlock);

  function runBlock(c8ySystem) {
    'ngInject';

    (async () => {
      const version = await c8ySystem.getUIVersion();

      console.log(version);

      // Put your fiddle code here.
      console.log('hello, world');
    })();
  }
})();
