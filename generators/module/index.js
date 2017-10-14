/**
 * Created by glenn on 2/27/17.
 */

const _ = require('lodash');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'moduleName',
        message: 'Your module name',
        default: 'c8y.example'
      }
    ]).then(answers => (this.answers = answers));
  }

  writing() {
    const { moduleName } = this.answers;

    this.fs.copyTpl(
      this.templatePath('module.js.ejs'),
      this.destinationPath(createDestFilename(moduleName)),
      { moduleName }
    );
  }
};

function createDestFilename(moduleName) {
  return _(moduleName)
    .chain()
    .replace(/module$/i, '')
    .split('.')
    .last()
    .words()
    .take(2)
    .kebabCase()
    .thru(name => `${name}.module.js`)
    .value();
}
