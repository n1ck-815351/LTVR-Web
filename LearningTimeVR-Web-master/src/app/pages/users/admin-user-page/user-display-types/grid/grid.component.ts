import { Component, Input } from '@angular/core';
import { UserService, UserType } from 'app/services/firebase/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserPreviewCardModalComponent } from 'app/modals/user-preview-card-modal/user-preview-card-modal.component';

@Component({
  selector: 'app-user-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {
  constructor(private modalService: NgbModal, public userService: UserService) { }

  @Input() user: UserType;
  @Input() size: number = 80;
  @Input() edit: boolean = true;

  showModal() {
    if (!this.edit) return;
    let modalRef = this.modalService.open(UserPreviewCardModalComponent, { centered: true, size: "md" });
    modalRef.componentInstance.user = this.user;
  }

  editUser(user: UserType) {
    // Implement edit user functionality
  }

  deleteUser(user: UserType) {
    // Implement delete user functionality
  }
}
