/**
 * Created by glenn on 27.02.17.
 */

const _ = require('lodash');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  prompting() {
    return this.prompt(
      [
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
      ])
      .then(answers => (this.answers = answers));
  }

  writing() {
    const { moduleName, serviceName } = this.answers;

    _.forEach(['service.js.ejs', 'service.spec.js.ejs'], tplName => this.fs.copyTpl(
      this.templatePath(tplName),
      this.destinationPath(createDestFilename(serviceName, tplName.match(/spec/i))),
      {
        moduleName,
        serviceName
      }
    ));
  }
};

function createDestFilename(serviceName, spec) {
  return _(serviceName)
    .chain()
    .replace(/service$/i, '')
    .words()
    .take(2)
    .kebabCase()
    .thru(name => `${name}.service${spec ? '.spec' : ''}.js`)
    .value();
}
