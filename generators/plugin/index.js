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
              default: 'Displays \"hello, world\" to the user'
            }
          ])
          .then(answers => this.prompt({
              type: 'input',
              name: 'moduleName',
              message: 'Your module name',
              default: getProbableModuleNameFor(answers.widgetName)
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
          pluginName: getPluginNameFor(widgetName),
          camelCasedWidgetName: getCamelCasedWidgetNameFor(widgetName),
          capitalizedWidgetName: getCapitalizedWidgetNameFor(widgetName),
          widgetConstantsName: getWidgetConstantsNameFor(widgetName),
          widgetFakeDataServiceName: getWidgetFakeDataServiceNameFor(widgetName),
          widgetDataServiceName: getWidgetDataServiceNameFor(widgetName),
          widgetComponentName: getWidgetComponentNameFor(widgetName),
          widgetConfigComponentName: getWidgetConfigComponentNameFor(widgetName),
          widgetHtmlTagName: getWidgetHtmlTagNameFor(widgetName),
          widgetConfigHtmlTagName: getWidgetConfigHtmlTagNameFor(widgetName),
          widgetCssClassName: getWidgetCssClassNameFor(widgetName),
          widgetConfigCssClassName: getWidgetConfigCssClassNameFor(widgetName),
        };

        _.forEach(readdirSync(this.templatePath('widget')), templateFilename =>
          this.fs.copyTpl(
            this.templatePath(`widget/${templateFilename}`),
            this.destinationPath(getDestFileNameFor({ widgetName, templateFilename })),
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

function getDestFileNameFor({ widgetName, templateFilename }) {
  return `${getPluginDirNameFor(widgetName)}/${templateFilename.replace('.ejs', '')}`;
}

function getPluginDirNameFor(widgetName) {
  return _.kebabCase(getPluginNameFor(widgetName));
}

function getPluginNameFor(widgetName) {
  return `${getCapitalizedWidgetNameFor(widgetName)} widget`;
}

function getCapitalizedWidgetNameFor(widgetName) {
  return _.capitalize(getTruncatedWidgetNameFor(widgetName).join(' '));
}

function getProbableModuleNameFor(widgetName) {
  return `c8y.pocs.${getCamelCasedWidgetNameFor(widgetName)}Widget`;
}

function getWidgetConstantsNameFor(widgetName) {
  return `${getCamelCasedWidgetNameFor(widgetName)}Constants`;
}

function getWidgetFakeDataServiceNameFor(widgetName) {
  return `fake${_.upperFirst(getCamelCasedWidgetNameFor(widgetName))}DataService`;
}

function getWidgetDataServiceNameFor(widgetName) {
  return `${getCamelCasedWidgetNameFor(widgetName)}DataService`;
}

function getWidgetComponentNameFor(widgetName) {
  return `c8y${_.upperFirst(getCamelCasedWidgetNameFor(widgetName))}Widget`;
}

function getWidgetConfigComponentNameFor(widgetName) {
  return `c8y${_.upperFirst(getCamelCasedWidgetNameFor(widgetName))}WidgetConfig`;
}

function getCamelCasedWidgetNameFor(widgetName) {
  return _.camelCase(getTruncatedWidgetNameFor(widgetName));
}

function getWidgetHtmlTagNameFor(widgetName) {
  return `c8y-${getKebabCasedWidgetNameFor(widgetName)}-widget`;
}

function getWidgetConfigHtmlTagNameFor(widgetName) {
  return `c8y-${getKebabCasedWidgetNameFor(widgetName)}-widget-config`;
}

function getWidgetCssClassNameFor(widgetName) {
  return `widget-${getKebabCasedWidgetNameFor(widgetName)}`;
}

function getWidgetConfigCssClassNameFor(widgetName) {
  return `widget-config-${getKebabCasedWidgetNameFor(widgetName)}`;
}

function getKebabCasedWidgetNameFor(widgetName) {
  return _.kebabCase(getTruncatedWidgetNameFor(widgetName));
}

function getTruncatedWidgetNameFor(widgetName) {
  return _(widgetName)
    .chain()
    .words()
    .take(3)
    .value();
}
