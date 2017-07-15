describe('c8y.pocs.hello: c8yHello component', () => {
  let $injector;
  let $rootScope;
  let $compile;
  let $componentController;

  beforeEach(() => {
    common.globalBeforeWithUI();
    module('c8y.pocs.hello');

    inject(
      (
        _$injector_,
        _$rootScope_,
        _$compile_,
        _$componentController_
      ) => {
        $injector = _$injector_;
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $componentController = _$componentController_;
      }
    );
  });

  it('component should exist', () => {
    expect($injector.has('c8yHelloDirective'))
      .toEqual(true);
  });

  describe('displaying text', () => {
    beforeEach(() => {
      //////////// stubbing dependencies

    });

    it('should display "hello, world" by default', () => {
      // given
      const textBinding = undefined;

      testDisplayingText(textBinding, 'hello, world');
    });

    it('should display text according to the text binding', () => {
      // given
      const textBinding = 'halo, dunia';

      testDisplayingText(textBinding, textBinding);
    });

    function testDisplayingText(textBinding, expectedText) {
      // when
      const controller = $componentController('c8yHello', undefined, { text: textBinding });
      controller.$onInit();

      // then
      expect(controller.text)
        .toEqual(expectedText);
    }

    it('you should compile the component instead if use case getting too complex', () => {
      // given
      const bindings = { world: 'world' };
      const template = '<c8y-hello world="world"></c8y-hello>';

      // when
      const element = createComponent(template, bindings);

      // then
      expect(element.html())
        .toContain('hello');
      expect(element.controller('c8yHello').text)
        .toEqual('hello, world');
    });

    function createComponent(template, bindings) {
      const $scope = _.assign($rootScope.$new(), bindings);

      const element = $compile(template)($scope);
      $scope.$apply();

      return element;
    }
  });
});
