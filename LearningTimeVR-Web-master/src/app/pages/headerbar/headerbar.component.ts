import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LinkHelperModalComponent } from 'app/modals/link-helper-modal/link-helper-modal.component';
import { Classroom } from 'app/models/Interfaces/Classroom';
import { ClassroomService } from 'app/services/classroomService/classroom.service';
import { AuthService } from 'app/services/firebase/auth.service';
import { FirestoreService } from 'app/services/firebase/firestore.service';
import { UserService } from 'app/services/firebase/user.service';
import { GlobalService } from 'app/services/globalService/global.service';
import { NavigationService } from 'app/services/navigationService/navigation.service';

@Component({
  selector: 'app-headerbar',
  templateUrl: './headerbar.component.html',
  styleUrls: ['./headerbar.component.scss']
})
export class HeaderbarComponent implements OnInit {

  selectedClass: Classroom;
  headerbarText: string | null;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private classService: ClassroomService,
    public navigation: NavigationService,
    public global: GlobalService,
    public fs: FirestoreService,
    public authFA: AngularFireAuth,
    public modalService: NgbModal) {
    this.authFA.user.subscribe(event => this.isAnonymous = event?.isAnonymous ?? false);

  }

  ngOnInit(): void { }
  isAnonymous: boolean = false;
  createClassRequest() {
    this.classService.ShowCreateDialog();
  }

  openInviteModal() {
    const modalRef = this.modalService.open(LinkHelperModalComponent, { centered: true, size: 'lg' });
    $('#urlGeneratorModal').on('shown.bs.modal', function () {
      $(document).off('focusin.modal');
    });
  }
}