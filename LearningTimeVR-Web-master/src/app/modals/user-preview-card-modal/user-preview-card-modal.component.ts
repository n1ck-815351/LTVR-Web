import { Component } from '@angular/core';
import { UserService, UserType } from 'app/services/firebase/user.service';

@Component({
  selector: 'app-user-preview-card-modal',
  templateUrl: './user-preview-card-modal.component.html',
  styleUrls: ['./user-preview-card-modal.component.scss']
})
export class UserPreviewCardModalComponent {
  constructor(public userService:UserService){}
  public user: UserType;
  editUser(user: UserType) {
    // Implement edit user functionality
  }

  deleteUser(user: UserType) {
    // Implement delete user functionality
  }
}
