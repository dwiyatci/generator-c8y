/**
 * Created by glenn on 16.10.19.
 */

'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('type', { type: String, required: false });
  }

  prompting() {
    return this._doAction('PROMPTING');
  }

  writing() {
    return this._doAction('WRITING');
  }

  _doAction(priorityType) {
    const actionsGeneratorsByPriorityTypes = {
      PROMPTING: this._getPromptingActions,
      WRITING: this._getWritingActions
    };

    const actionsGenerator = actionsGeneratorsByPriorityTypes[priorityType];

    if (_.isFunction(actionsGenerator)) {
      const action = actionsGenerator()[this.options.type];

      if (_.isFunction(action)) {
        return action.call(this);
      }

      return actionsGenerator().widget.call(this);
    }
  }

  _getPromptingActions() {
    return {
      widget() {
        return this.prompt([
          {
            type: 'input',
            name: 'widgetName',
            message: 'Your widget name',
            default: 'hello'
          },
          {
            type: 'input',
            name: 'widgetDesc',
            message: 'Your widget description',
            default: 'Displays that classic "hello, world" string'
          }
        ]).then(answers => {
          this.answers = answers;
        });
      }
    };
  }

  _getWritingActions() {
    return {
      widget() {
        const context = getWidgetContext(this.answers);
        const { kebabCasedWidgetName } = context;

        const templateFilenames = fs.readdirSync(this.templatePath('widget'));
        const renamedTemplateFilenames = _.map(templateFilenames, filename =>
          filename.replace('widget', `${kebabCasedWidgetName}-widget`)
        );

        const templatePaths = _.map(templateFilenames, filename =>
          this.templatePath(path.join('widget', filename))
        );
        const destinationPaths = _.map(renamedTemplateFilenames, filename =>
          this.destinationPath(
            path.join(`${kebabCasedWidgetName}-widget`, filename.replace('.ejs', ''))
          )
        );

        _.zip(templatePaths, destinationPaths).forEach(([templatePath, destinationPath]) => {
          this.fs.copyTpl(templatePath, destinationPath, context);
        });
      }
    };
  }
};

function getWidgetContext({ widgetName, widgetDesc }) {
  return {
    widgetDesc,
    kebabCasedWidgetName: getKebabCaseWidgetName(widgetName),
    camelCasedWidgetName: getCamelCaseWidgetName(widgetName),
    pascalCasedWidgetName: getPascalCaseWidgetName(widgetName),
    capitalizedWidgetName: getCapitalizeWidgetName(widgetName)
  };
}

function getKebabCaseWidgetName(widgetName) {
  return _.flow([getTruncatedWidgetName, _.kebabCase])(widgetName);
}

function getCamelCaseWidgetName(widgetName) {
  return _.flow([getTruncatedWidgetName, _.camelCase])(widgetName);
}

function getPascalCaseWidgetName(widgetName) {
  return _.flow([getTruncatedWidgetName, _.camelCase, _.upperFirst])(widgetName);
}

function getCapitalizeWidgetName(widgetName) {
  return _.flow([getTruncatedWidgetName, _.capitalize])(widgetName);
}

function getTruncatedWidgetName(widgetName) {
  return _(widgetName)
    .chain()
    .words()
    .take(3)
    .join(' ')
    .value();
}
