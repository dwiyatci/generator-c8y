describe('c8y.pocs.hello: c8yHello component', function () {
  var $injector;
  var $rootScope;
  var $compile;
  var $componentController;

  beforeEach(function () {
    common.globalBeforeWithUI();
    module('c8y.pocs.hello');

    inject(function (
      _$injector_,
      _$rootScope_,
      _$compile_,
      _$componentController_
    ) {
      $injector = _$injector_;
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $componentController = _$componentController_;
    });
  });

  it('component should exist', function () {
    expect($injector.has('c8yHelloDirective'))
      .toEqual(true);
  });

  describe('displaying text', function () {
    var element;

    beforeEach(function () {

      //////////// stubbing dependencies
    });

    it('should display "hello, world" by default', function () {
      // given
      var textBinding;

      testDisplayingText(textBinding, 'hello, world');
    });

    it('should display text according to the text binding', function () {
      // given
      var textBinding = 'halo, dunia';

      testDisplayingText(textBinding, textBinding);
    });

    function testDisplayingText(textBinding, expectedText) {
      // when
      var controller = $componentController('c8yHello', undefined, { text: textBinding });
      controller.$onInit();

      // then
      expect(controller.text)
        .toEqual(expectedText);
    }

    it('you should compile the component instead if use case getting too complex', function () {
      // given
      var bindings = { world: 'world' };
      var template = '<c8y-hello world="world"></c8y-hello>';

      // when
      initComponent(template, bindings);

      // then
      expect(element.html())
        .toContain('hello');
      expect(element.controller('c8yHello').text)
        .toEqual('hello, world');
    });

    function initComponent(template, bindings) {
      var $scope = _.assign($rootScope.$new(), bindings);

      element = $compile(template)($scope);
      $scope.$digest();
    }
  });
});
