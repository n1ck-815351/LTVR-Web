import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserService } from 'app/services/firebase/user.service';
import { GlobalService, appdata } from 'app/services/globalService/global.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [DatePipe]
})



export class AdminComponent {
  isExpanded: boolean = false;
  ascentOrg: string = this.global.ascent_OrgID;

  constructor(public userService: UserService, public global: GlobalService) {
    this.isExpanded = false;
    console.log(userService.user);
  }
}
