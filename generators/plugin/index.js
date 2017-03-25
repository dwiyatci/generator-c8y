/**
 * Created by glenn on 2/26/17.
 */

const { readdirSync } = require('fs');
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
      promptingAction = this._getPromptingActions().hello;
    }

    return promptingAction.call(this);
  },

  _getPromptingActions() {
    return {
      hello() {
      },

      widget() {
        return this.prompt(
          [
            {
              type: 'input',
              name: 'widgetName',
              message: 'Your widget name',
              default: 'hello world'
            },
            {
              type: 'input',
              name: 'widgetDesc',
              message: 'Your widget description',
              default: 'Displays „hello, world“ to the user'
            }
          ])
          .then(answers => this.prompt({
              type: 'input',
              name: 'moduleName',
              message: 'Your module name',
              default: createProbableModuleName(answers.widgetName)
            }).then(({ moduleName }) => _.assign(answers, { moduleName }))
          )
          .then(answers => this.answers = answers);
      },

      chart() {
      },

      translations() {
      }
    };
  },

  writing() {
    let writingAction = this._getWritingActions()[this.options.type];

    if (!_.isFunction(writingAction)) {
      writingAction = this._getWritingActions().hello;
    }

    writingAction.call(this);
  },

  _getWritingActions() {
    return {
      hello() {
        this.fs.copy(
          this.templatePath('hello'), this.destinationPath('hello'));
      },

      widget() {
        const {
          widgetName,
          widgetDesc,
          moduleName
        } = this.answers;

        const context = {
          widgetDesc,
          moduleName,
          pluginName: createPluginName(widgetName),
          camelCasedWidgetName: createCamelCasedWidgetName(widgetName),
          capitalizedWidgetName: createCapitalizedWidgetName(widgetName),
          widgetConstantsName: createWidgetConstantsName(widgetName),
          widgetFakeDataServiceName: createWidgetFakeDataServiceName(widgetName),
          widgetDataServiceName: createWidgetDataServiceName(widgetName),
          widgetComponentName: createWidgetComponentName(widgetName),
          widgetConfigComponentName: createWidgetConfigComponentName(widgetName),
          widgetHtmlTagName: createWidgetHtmlTagName(widgetName),
          widgetConfigHtmlTagName: createWidgetConfigHtmlTagName(widgetName),
          widgetCssClassName: createWidgetCssClassName(widgetName),
          widgetConfigCssClassName: createWidgetConfigCssClassName(widgetName),
        };

        _.forEach(readdirSync(this.templatePath('widget')), templateFilename =>
          this.fs.copyTpl(
            this.templatePath(`widget/${templateFilename}`),
            this.destinationPath(createDestFileName({ widgetName, templateFilename })),
            context
          )
        );
      },

      chart() {
      },

      translations() {
        this.fs.copy(
          this.templatePath('translations'), this.destinationPath('custom-translations'));
      }
    };
  }
});

////////////

function createDestFileName({ widgetName, templateFilename }) {
  return `${createPluginDirName(widgetName)}/${templateFilename.replace('.ejs', '')}`;
}

function createPluginDirName(widgetName) {
  return _.kebabCase(createPluginName(widgetName));
}

function createPluginName(widgetName) {
  return `${createCapitalizedWidgetName(widgetName)} widget`;
}

function createCapitalizedWidgetName(widgetName) {
  return _.capitalize(createTruncatedWidgetName(widgetName).join(' '));
}

function createProbableModuleName(widgetName) {
  return `c8y.pocs.${createCamelCasedWidgetName(widgetName)}Widget`;
}

function createWidgetConstantsName(widgetName) {
  return `${createCamelCasedWidgetName(widgetName)}Constants`;
}

function createWidgetFakeDataServiceName(widgetName) {
  return `fake${_.upperFirst(createCamelCasedWidgetName(widgetName))}DataService`;
}

function createWidgetDataServiceName(widgetName) {
  return `${createCamelCasedWidgetName(widgetName)}DataService`;
}

function createWidgetComponentName(widgetName) {
  return `c8y${_.upperFirst(createCamelCasedWidgetName(widgetName))}Widget`;
}

function createWidgetConfigComponentName(widgetName) {
  return `c8y${_.upperFirst(createCamelCasedWidgetName(widgetName))}WidgetConfig`;
}

function createCamelCasedWidgetName(widgetName) {
  return _.camelCase(createTruncatedWidgetName(widgetName));
}

function createWidgetHtmlTagName(widgetName) {
  return `c8y-${createKebabCasedWidgetName(widgetName)}-widget`;
}

function createWidgetConfigHtmlTagName(widgetName) {
  return `c8y-${createKebabCasedWidgetName(widgetName)}-widget-config`;
}

function createWidgetCssClassName(widgetName) {
  return `widget-${createKebabCasedWidgetName(widgetName)}`;
}

function createWidgetConfigCssClassName(widgetName) {
  return `widget-config-${createKebabCasedWidgetName(widgetName)}`;
}

function createKebabCasedWidgetName(widgetName) {
  return _.kebabCase(createTruncatedWidgetName(widgetName));
}

function createTruncatedWidgetName(widgetName) {
  return _(widgetName)
    .chain()
    .words()
    .take(3)
    .value();
}
