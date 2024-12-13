import { Component, Input } from '@angular/core';
import { UserService, UserType } from 'app/services/firebase/user.service';

@Component({
  selector: 'app-user-expanded-grid',
  templateUrl: './expanded-grid.component.html',
  styleUrls: ['./expanded-grid.component.scss']
})
export class ExpandedGridComponent {
  constructor(public userService: UserService){}
  @Input() user: UserType;
  editUser(user: UserType) {
    // Implement edit user functionality
  }

  deleteUser(user: UserType) {
    // Implement delete user functionality
  }
}
