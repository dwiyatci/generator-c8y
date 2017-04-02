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
          type: 'input',
          name: 'providerName',
          message: 'Your provider name',
          default: 'example'
        }
      ])
      .then(answers => this.answers = answers);
  },

  writing() {
    const { moduleName, providerName } = this.answers;

    this.fs.copyTpl(
      this.templatePath('provider.js.ejs'),
      this.destinationPath(createDestFilename(providerName)),
      {
        moduleName,
        providerName
      }
    );
  }
});

function createDestFilename(providerName) {
  return _(providerName)
    .chain()
    .replace(/provider$/i, '')
    .words()
    .take(2)
    .kebabCase()
    .thru(name => `${name}.provider.js`)
    .value();
}
