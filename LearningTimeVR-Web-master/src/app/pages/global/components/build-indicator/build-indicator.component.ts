import { Component } from '@angular/core';
import { GlobalService } from 'app/services/globalService/global.service';

@Component({
  selector: 'app-build-indicator',
  templateUrl: './build-indicator.component.html',
  styleUrls: ['./build-indicator.component.scss']
})
export class BuildIndicatorComponent {
  constructor(public global: GlobalService) { }

}
