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
    return this.prompt(
      [
        {
          type: 'input',
          name: 'moduleName',
          message: 'Your module name',
          default: 'c8y.example'
        },
        {
          type: 'list',
          name: 'recipe',
          message: 'What recipe do you want to decorate?',
          choices: ['directive', 'service'],
          default: 'directive'
        },
        {
          type: 'input',
          name: 'recipeName',
          message: 'Your recipe name',
          default: 'example'
        }
      ])
      .then(answers => (this.answers = answers));
  },

  writing() {
    const { moduleName, recipe, recipeName } = this.answers;

    this.fs.copyTpl(
      this.templatePath(`${recipe}.decorator.js.ejs`),
      this.destinationPath(createDestFilename(recipeName)),
      {
        moduleName,
        recipeName
      }
    );
  }
});

function createDestFilename(recipeName) {
  return _(recipeName)
    .chain()
    .replace(/^.{1,5}(?=[A-Z])/g, '')
    .words()
    .take(2)
    .kebabCase()
    .thru(name => `${name}.decorator.js`)
    .value();
}
