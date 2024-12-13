import { Injectable } from '@angular/core';
import { error } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class ErrorUtilityService {

  constructor() { }

  public throw(source: string, errors: string[]) {
    errors.forEach(e => {
      throw Error(`${source}: ${e}`);
    })
  }
}
