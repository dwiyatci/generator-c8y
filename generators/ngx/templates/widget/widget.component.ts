import { Component, Input, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash-es';

import { HelloWidgetService } from './hello-widget.service';

@Component({
  selector: 'c8y-hello-widget',
  templateUrl: './hello-widget.component.html',
  styles: [require('!raw-loader!less-loader!./styles.less')]
})
export class HelloWidgetComponent implements OnInit {
  config = {};

  @Input('config')
  set _config(config) {
    this.config = cloneDeep(config);
  }

  constructor(private helloService: HelloWidgetService) {}

  ngOnInit() {
    this.helloService.getData().subscribe(console.log);
  }
}
