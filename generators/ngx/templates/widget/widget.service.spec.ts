import { TestBed } from '@angular/core/testing';
import { InventoryService } from '@c8y/client';
import { CoreModule } from '@c8y/ngx-components';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash-es';

import { HelloWidgetService } from './hello-widget.service';

describe('HelloWidgetModule: HelloWidgetService', () => {
  it('should get data for specific source', done => {
    const { helloWidgetService, inventoryService } = setup();

    // given
    const source = '42';

    // when
    inventoryService.detail = jest.fn(() =>
      Promise.resolve({
        id: '42',
        name: 'device x'
      })
    );

    helloWidgetService.getData(source).subscribe(data => {
      // then
      expect(data).toEqual({});

      expect(inventoryService.detail).toHaveBeenCalledWith('42');

      done();
    });
  });

  function setup(): any {
    const setupVariables = {};

    TestBed.configureTestingModule({
      imports: [CoreModule.forRoot()],
      providers: [
        HelloWidgetService,
        { provide: TranslateService, useValue: { instant: _.identity } },
        /**
         *
         * @see https://stackoverflow.com/a/57225503/2013891
         */
        {
          provide: '$injector',
          useValue: {
            get(serviceName?: string) {
              // console.log('looking for serviceName:', serviceName);
              return {}; // this will break things differently
            }
          }
        }
      ]
    });

    _.assign(setupVariables, {
      helloWidgetService: TestBed.get(HelloWidgetService),
      inventoryService: TestBed.get(InventoryService)
    });

    return setupVariables;
  }
});
