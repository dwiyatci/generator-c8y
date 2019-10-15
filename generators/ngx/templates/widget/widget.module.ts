import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HelloWidgetConfigComponent } from './hello-widget-config.component';
import { HelloWidgetComponent } from './hello-widget.component';

@NgModule({
  imports: [SharedModule],
  declarations: [HelloWidgetConfigComponent, HelloWidgetComponent],
  entryComponents: [HelloWidgetConfigComponent, HelloWidgetComponent],
  exports: []
})
export class HelloWidgetModule {}
