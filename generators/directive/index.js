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
          name: 'directiveName',
          message: 'Your directive name',
          default: 'c8yExample'
        }
      ])
      .then(answers => (this.answers = answers));
  }

  writing() {
    const { moduleName, directiveName } = this.answers;

    this.fs.copyTpl(
      this.templatePath('directive.js.ejs'),
      this.destinationPath(createDestFilename(directiveName)),
      {
        moduleName,
        directiveName,
        prefixedDirectiveName: createPrefixedDirectiveName(directiveName)
      }
    );
  }
};

function createDestFilename(directiveName) {
  return _(directiveName)
    .chain()
    .replace(/^.{1,5}(?=[A-Z])/g, '')
    .words()
    .takeRight(2)
    .kebabCase()
    .thru(name => `${name}.directive.js`)
    .value();
}

function createPrefixedDirectiveName(directiveName) {
  //return _(directiveName)
  //  .chain()
  //  .replace(/^c8y/i, '')
  //  .camelCase()
  //  .upperFirst()
  //  .thru(name => `c8y${name}`)
  //  .value();
  return directiveName;
}
