import { Component, Input } from '@angular/core';
import { UserService, UserType } from 'app/services/firebase/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  constructor(public userService: UserService) { }
  @Input() users: UserType[];
  editUser(user: UserType) {
    // Implement edit user functionality
  }

  deleteUser(user: UserType) {
    // Implement delete user functionality
  }
}
