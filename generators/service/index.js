/**
 * Created by glenn on 2/27/17.
 */

const _ = require('lodash');
const generator = require('yeoman-generator');

module.exports = generator.extend({
  constructor: function (args, opts) {
    generator.prototype.constructor(args, opts);
  },

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'moduleName',
        message: 'Your module name',
        default: 'c8y.example'
      },
      {
        type: 'input',
        name: 'serviceName',
        message: 'Your service name',
        default: 'example'
      }
    ]).then(answers => this.answers = answers);
  },

  writing() {
    const { moduleName, serviceName } = this.answers;

    _.forEach(['service.ejs', 'service.spec.ejs'], tplName => this.fs.copyTpl(
      this.templatePath(tplName),
      this.destinationPath(this._getDestFilename(serviceName, !!tplName.match(/spec/i))),
      {
        moduleName,
        serviceName
      }
    ));
  },

  _getDestFilename(serviceName, spec) {
    return _(serviceName)
      .chain()
      .replace(/service$/i, '')
      .words()
      .take(2)
      .kebabCase()
      .thru(name => `${name}.service${spec ? '.spec' : ''}.js`)
      .value();
  }
});
