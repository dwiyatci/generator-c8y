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
          name: 'componentName',
          message: 'Your component name',
          default: 'c8yExample'
        }
      ])
      .then(answers => (this.answers = answers));
  }

  writing() {
    const { moduleName, componentName } = this.answers;

    this.fs.copyTpl(
      this.templatePath('component.js.ejs'),
      this.destinationPath(createDestFilename(componentName)),
      {
        moduleName,
        prefixedComponentName: createPrefixedComponentName(componentName)
      }
    );
  }
};

function createDestFilename(componentName) {
  return _(componentName)
    .chain()
    .replace(/^.{1,5}(?=[A-Z])/g, '')
    .words()
    .takeRight(2)
    .kebabCase()
    .thru(name => `${name}.component.js`)
    .value();
}

function createPrefixedComponentName(componentName) {
  //return _(componentName)
  //  .chain()
  //  .replace(/^c8y/i, '')
  //  .camelCase()
  //  .upperFirst()
  //  .thru(name => `c8y${name}`)
  //  .value();
  return componentName;
}
