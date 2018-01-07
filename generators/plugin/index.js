/**
 * Created by glenn on 2/26/17.
 */

const { readdirSync } = require('fs');
const _ = require('lodash');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('type', { type: String, required: false });
    this.option('experimental', { description: 'Use experimental features', alias: 'x' });
    this.option('typescript', { description: 'Use TypeScript', alias: 'ts' });
    this.option('typescript-nomods', { description: 'Use TypeScript (no import/export syntax)', alias: 'tsnm' });
  }

  prompting() {
    let promptingAction = this._getPromptingActions()[this.options.type];

    if (!_.isFunction(promptingAction)) {
      promptingAction = this._getPromptingActions().hello;
    }

    return promptingAction.call(this);
  }

  _getPromptingActions() {
    return {
      manifest() {
        return this.prompt(
          [
            {
              type: 'input',
              name: 'pluginName',
              message: 'Your plugin name',
              default: 'Hello world'
            },
            {
              type: 'input',
              name: 'pluginDesc',
              message: 'Your plugin description',
              default: 'A simple hello world plugin'
            },
            {
              type: 'input',
              name: 'pluginCategory',
              message: 'Your plugin category',
              default: 'PoC'
            }
          ])
          .then(answers => (this.answers = answers));
      },

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
          .then(answers => (this.answers = answers));
      },

      chart() {
        return this.prompt(
          [
            {
              type: 'input',
              name: 'widgetName',
              message: 'Your widget name',
              default: 'home temperature'
            },
            {
              type: 'input',
              name: 'widgetDesc',
              message: 'Your chart description',
              default: 'Vertical bar chart that displays temperature measurement of a room'
            }
          ])
          .then(answers => this.prompt({
              type: 'input',
              name: 'moduleName',
              message: 'Your module name',
              default: createProbableModuleName(answers.widgetName)
            }).then(({ moduleName }) => _.assign(answers, { moduleName }))
          )
          .then(answers => (this.answers = answers));
      },

      translations() {
      }
    };
  }

  writing() {
    let writingAction = this._getWritingActions()[this.options.type];

    if (!_.isFunction(writingAction)) {
      writingAction = this._getWritingActions().hello;
    }

    writingAction.call(this, this.options);
  }

  _getWritingActions() {
    return {
      manifest() {
        this.fs.copyTpl(
          this.templatePath('cumulocity.json.ejs'),
          this.destinationPath('cumulocity.json'),
          this.answers
        );
      },

      hello() {
        this.fs.copy(
          this.templatePath('hello'), this.destinationPath('hello'));
      },

      widget({ experimental, typescript, ...opts }) {
        const typescriptNoModules = opts['typescript-nomods'];
        const tsEnabled = (typescript || typescriptNoModules);
        const parentDir = typescript ? 'widget-modules' : 'widget';

        writeWidgetFiles.call(this, {
          answers: this.answers,
          templateFilenames: _(readdirSync(this.templatePath(parentDir)))
            .reject(filename => filename.match(tsEnabled ? /\.js\.ejs$/i : /\.ts\.ejs$/i))
            .reject(experimental ? (filename => filename.match(/^(main|config)\.html\.ejs$/i)) : _.noop)
            .value()
          ,
          parentDir,
          experimental
        });
      },

      chart() {
        const answers = this.answers;

        writeWidgetFiles.call(this, {
          answers,
          templateFilenames: _.reject(
            readdirSync(this.templatePath('widget')), _.curry(_.includes)(_, 'component')),
          parentDir: 'widget'
        });

        writeWidgetFiles.call(this, {
          answers,
          templateFilenames: readdirSync(this.templatePath('chart')),
          parentDir: 'chart'
        });
      },

      translations() {
        this.fs.copy(
          this.templatePath('translations'), this.destinationPath('custom-translations'));
      }
    };
  }
};

////////////

function writeWidgetFiles({ answers, templateFilenames, parentDir, experimental }) {
  const context = createWidgetContext(answers, experimental);

  _.forEach(templateFilenames, templateFilename =>
    this.fs.copyTpl(
      this.templatePath(`${parentDir}/${templateFilename}`),
      this.destinationPath(createDestFileName({
        widgetName: answers.widgetName,
        templateFilename
      })),
      context
    )
  );
}

function createWidgetContext({ widgetName, widgetDesc, moduleName }, experimental) {
  return {
    experimental,
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
    widgetConfigFormName: createWidgetConfigFormName(widgetName),
    widgetHtmlTagName: createWidgetHtmlTagName(widgetName),
    widgetConfigHtmlTagName: createWidgetConfigHtmlTagName(widgetName),
    widgetCssClassName: createWidgetCssClassName(widgetName),
    widgetConfigCssClassName: createWidgetConfigCssClassName(widgetName),
    widgetChartFactoryName: createWidgetChartFactoryName(widgetName),
  };
}

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
  return `fake${_.upperFirst(createCamelCasedWidgetName(widgetName))}Service`;
}

function createWidgetDataServiceName(widgetName) {
  return `${createCamelCasedWidgetName(widgetName)}Service`;
}

function createWidgetComponentName(widgetName) {
  return `c8y${_.upperFirst(createCamelCasedWidgetName(widgetName))}Widget`;
}

function createWidgetConfigFormName(widgetName) {
  return `${createCamelCasedWidgetName(widgetName)}WidgetConfigForm`;
}

function createWidgetConfigComponentName(widgetName) {
  return `c8y${_.upperFirst(createCamelCasedWidgetName(widgetName))}WidgetConfig`;
}

function createWidgetChartFactoryName(widgetName) {
  return `${createCamelCasedWidgetName(widgetName)}ChartFactory`;
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
