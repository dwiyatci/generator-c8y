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
        name: 'componentName',
        message: 'Your component name',
        default: 'c8yExample'
      }
    ]).then(answers => this.answers = answers);
  },

  writing() {
    const { moduleName, componentName } = this.answers;

    this.fs.copyTpl(
      this.templatePath('component.ejs'),
      this.destinationPath(this._getDestFilename(componentName)),
      {
        moduleName,
        prefixedComponentName: this._getPrefixedComponentName(componentName)
      }
    );
  },

  _getDestFilename(componentName) {
    return _(componentName)
      .chain()
      .replace(/^c8y/i, '')
      .words()
      .takeRight(2)
      .kebabCase()
      .thru(name => `${name}.component.js`)
      .value();
  },

  _getPrefixedComponentName(componentName) {
    //return _(componentName)
    //  .chain()
    //  .replace(/^c8y/i, '')
    //  .camelCase()
    //  .upperFirst()
    //  .thru(name => `c8y${name}`)
    //  .value();
    return componentName;
  }
});
