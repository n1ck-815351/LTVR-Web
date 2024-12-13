import { Component } from '@angular/core';
import { UserService } from 'app/services/firebase/user.service';

@Component({
  selector: 'app-link-helper-modal',
  templateUrl: './link-helper-modal.component.html',
  styleUrls: ['./link-helper-modal.component.scss']
})
export class LinkHelperModalComponent {
  constructor(public userService: UserService) { }
}
