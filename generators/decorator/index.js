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
        type: 'list',
        name: 'recipe',
        message: 'What recipe do you want to decorate?',
        choices: ['service', 'directive'],
        default: 'service'
      },
      {
        type: 'input',
        name: 'recipeName',
        message: 'Your recipe name',
        default: 'example'
      }
    ]).then(answers => this.answers = answers);
  },

  writing() {
    const { moduleName, recipe, recipeName } = this.answers;

    this.fs.copyTpl(
      this.templatePath(`${recipe}.decorator.ejs`),
      this.destinationPath(this._getDestFilename(recipeName)),
      {
        moduleName,
        recipeName
      });
  },

  _getDestFilename(recipeName, spec) {
    return _(recipeName)
      .chain()
      .words()
      .take(2)
      .kebabCase()
      .concat('.decorator.js')
      .join('')
      .value();
  }
});
