/**
 * Created by glenn on 4/2/17.
 */

const _ = require('lodash');
const generator = require('yeoman-generator');

module.exports = generator.extend({
  constructor: function (args, opts) {
    generator.prototype.constructor(args, opts);

    this.argument('type', { type: String, required: false });
  },

  prompting() {
    let promptingAction = this._getPromptingActions()[this.options.type];

    if (!_.isFunction(promptingAction)) {
      promptingAction = _.noop;
    }

    return promptingAction.call(this);
  },

  _getPromptingActions() {
    return {
      manifest() {
        return this.prompt(
          [
            {
              type: 'input',
              name: 'appContextPath',
              message: 'Your app context path',
              default: 'helloworld'
            },
            {
              type: 'input',
              name: 'appName',
              message: 'Your app name',
              default: 'Hello world'
            }
          ])
          .then(answers => (this.answers = answers));
      }
    };
  },

  writing() {
    let writingAction = this._getWritingActions()[this.options.type];

    if (!_.isFunction(writingAction)) {
      writingAction = _.noop;
    }

    writingAction.call(this);
  },

  _getWritingActions() {
    return {
      manifest() {
        const { appContextPath, appName } = this.answers;

        this.fs.copyTpl(
          this.templatePath('cumulocity.json.ejs'),
          this.destinationPath('cumulocity.json'),
          {
            appName,
            appContextPath: _.kebabCase(appContextPath)
          }
        );
      },
    };
  }
});
