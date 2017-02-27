/**
 * Created by glenn on 2/26/17.
 */

const generator = require('yeoman-generator');

module.exports = generator.extend({
  constructor: function (args, opts) {
    generator.prototype.constructor(args, opts);
    this.option('gingerale');
  },

  initializing() {
    this.log('init');
  },

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'widgetName',
        message: 'Your widget name',
        default: 'myWidget'
      }
    ]).then(answers => this.answers = answers);
  },

  configuring() {
    //this.config.save();
  },

  writing() {
    //this.fs.copyTpl(
    //  this.templatePath('hello.ejs'),
    //  this.destinationPath('hello.js'),
    //  { hello: 'hello' }
    //);
  },

  paths() {
    this.log(this.contextRoot);
    this.log(this.destinationRoot());
    this.log(this.sourceRoot());
  },

  method1() {
    this.log('method 1 just ran');
  },

  method2() {
    this.log('method 2 just ran');
    this.log(this.options.gingerale);
  },

  _privateMethod() {
    this.log('hi')
  }
});
