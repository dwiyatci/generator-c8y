import { Injectable } from '@angular/core';
import { InventoryService } from '@c8y/client';
import { from, Observable, of } from 'rxjs';
import { catchError, switchMapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HelloWidgetService {
  constructor(private inventoryService: InventoryService) {}

  getData(source = '42'): Observable<any> {
    const data = {};

    return from(this.inventoryService.detail(source)).pipe(
      switchMapTo(of(data)),
      catchError(_ => of(data))
    );
  }
}
