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
      },
      {
        type: 'input',
        name: 'directiveName',
        message: 'Your directive name',
        default: 'c8yExample'
      }
    ]).then(answers => this.answers = answers);
  },

  writing() {
    const { moduleName, directiveName } = this.answers;

    this.fs.copyTpl(
      this.templatePath('directive.ejs'),
      this.destinationPath(this._getDestFilename(directiveName)),
      {
        moduleName,
        directiveName,
        prefixedDirectiveName: this._getPrefixedDirectiveName(directiveName)
      });
  },

  _getDestFilename(directiveName) {
    return _(directiveName)
      .chain()
      .replace(/^c8y/i, '')
      .words()
      .takeRight(2)
      .kebabCase()
      .concat('.directive.js')
      .join('')
      .value();
  },

  _getPrefixedDirectiveName(directiveName) {
    //return _(directiveName)
    //  .chain()
    //  .replace(/^c8y/i, '')
    //  .camelCase()
    //  .upperFirst()
    //  .thru(name => `c8y${name}`)
    //  .value();
    return directiveName;
  }
});
