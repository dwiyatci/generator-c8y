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
        default: 'c8y.exampleModule'
      }
    ]).then(answers => this.answers = answers);
  },

  writing() {
    const { moduleName } = this.answers;

    this.fs.copyTpl(
      this.templatePath('module.ejs'),
      this.destinationPath(this._getDestFilename(moduleName)),
      { moduleName });
  },

  _getDestFilename(moduleName) {
    return _(moduleName)
      .chain()
      .replace(/module$/i, '')
      .split('.')
      .last()
      .words()
      .take(2)
      .kebabCase()
      .concat('.module.js')
      .join('')
      .value();
  }
});
