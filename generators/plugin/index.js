/**
 * Created by glenn on 2/26/17.
 */

const _ = require('lodash');
const generator = require('yeoman-generator');

module.exports = generator.extend({
  constructor: function (args, opts) {
    generator.prototype.constructor(args, opts);

    this.argument('type', { type: String, required: false });
  },

  prompting() {
    var promptingAction = this._getPromptingActions()[this.options.type];

    if (!_.isFunction(promptingAction)) {
      promptingAction = _.noop;
    }

    return promptingAction();
  },

  _getPromptingActions() {
    return {
      widget() {
      },

      chart() {
      },

      translations() {
      }
    };
  },

  writing() {
    var writingAction = this._getWritingActions()[this.options.type];

    if (!_.isFunction(writingAction)) {
      writingAction = _.noop;
    }

    writingAction();
  },

  _getWritingActions() {
    return {
      widget() {
      },

      chart() {
      },

      translations() {
      }
    };
  }
});
