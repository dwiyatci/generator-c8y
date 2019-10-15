import { gettext } from '@c8y/ngx-components';

import { HelloWidgetConfigComponent } from './hello-widget-config.component';
import { HelloWidgetComponent } from './hello-widget.component';

export const helloWidgetDefinition = {
  id: 'hello',
  label: gettext('Hello'),
  description: gettext('Displays that classic "hello, world" string'),
  component: HelloWidgetComponent,
  configComponent: HelloWidgetConfigComponent,
  data: {
    ng1: {
      options: {
        noDeviceTarget: true,
        noNewWidgets: false,
        deviceTargetNotRequired: false,
        groupsSelectable: false
      }
    }
  }
};
