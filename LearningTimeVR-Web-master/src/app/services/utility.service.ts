import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  trim(input: string | null, limit:number = 25) {
    if (input != null) {
      if (input.length > limit)
        return input.slice(0, limit).trim() + "...";
      else return input;
    }
    else return input;
  }

  toPascalCase(input: string) {
    return `${input}`
      .toLowerCase()
      .replace(new RegExp(/[-_]+/, 'g'), ' ')
      .replace(new RegExp(/\w\s]/, 'g'), '')
      .replace(
        new RegExp(/\s+(.)([a-zA-Z]*)/, 'g'),
        ($1, $2, $3) => ` ${$2.toUpperCase() + $3}`
      )
      .replace(new RegExp(/\w/), s => s.toUpperCase());
  }

  isDevMode() {
    return localStorage['dev']=='true'
  }

  getDate(jDate: string | null){
    if (jDate) {
      return new Date(Number(jDate)).toLocaleDateString('en-us', { day: "2-digit", year:"numeric", month:"short"});
    }
    return null;
  }
}
