import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'c8y-hello-widget-config',
  templateUrl: './hello-widget-config.component.html'
})
export class HelloWidgetConfigComponent implements AfterViewInit {
  config = {
    text: ''
  };

  @Input('config')
  set _config(config) {
    this.config = {
      ...this.config,
      ...cloneDeep(config)
    };
  }

  @ViewChild('configForm') configForm;

  ngAfterViewInit() {
    this.configForm.statusChanges.pipe(distinctUntilChanged()).subscribe(() => {
      console.log(this.configForm.valid);
      // this.ng1FormRef.$setValidity(this.configForm.valid);
    });
  }
}
