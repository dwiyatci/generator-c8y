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
          name: 'filterName',
          message: 'Your filter name',
          default: 'example'
        }
      ])
      .then(answers => (this.answers = answers));
  }

  writing() {
    const { moduleName, filterName } = this.answers;

    _.forEach(['filter.js.ejs', 'filter.spec.js.ejs'], tplName => this.fs.copyTpl(
      this.templatePath(tplName),
      this.destinationPath(createDestFilename(filterName, tplName.match(/spec/i))),
      {
        moduleName,
        filterName
      }
    ));
  }
};

function createDestFilename(filterName, spec) {
  return _(filterName)
    .chain()
    .words()
    .take(2)
    .kebabCase()
    .thru(name => `${name}.filter${spec ? '.spec' : ''}.js`)
    .value();
}
