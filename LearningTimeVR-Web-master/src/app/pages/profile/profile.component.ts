import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'app/services/firebase/auth.service';
import { FirestoreService } from 'app/services/firebase/firestore.service';
import { UserService } from 'app/services/firebase/user.service';
import { userTypes } from 'app/services/firebase/user.service';
import { PinService } from 'app/services/pin.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { GlobalModalsService } from 'app/services/globalService/global-modals.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  constructor(public auth: AngularFireAuth, public authService: AuthService,
    public fs: FirestoreService,
    public userService: UserService,
    public pinService: PinService,
    private clipboard: Clipboard,
    private modals: GlobalModalsService
  ) { }
  ngOnInit() {

    // this.onRpmData.subscribe(a => { if (a) { this.rpmDataUrl = a; } });
  }

  onRpmData(event: any) {
    this.rpmDataUrl = event;
    
    this.modals.CreateGenericConfirmationModal("Avatar Ready", "Your avatar is ready! Confirm your avatar by clicking the \"Save\" button!", "Got it!", "").subscribe(a=>{});
  }
  rpmDataUrl: string;

  canSave() {
    if (this.rpmDataUrl && this.rpmDataUrl.includes('.glb')) return true;
    return false;
  }
  save() {
    if (!this.userService.user) return;
    this.userService.user.baseUser!.avatarDataUrl = this.rpmDataUrl;
    const users = this.fs.firestore.collection(this.userService.DbCollection).doc(this.userService.user.id!);
    users.update(this.userService.user).then(a => { console.log("Saved user"); this.showRpmCreator = false; });
  }


  // avatarUrl: string | undefined = this.userService.user.baseUser?.avatarDataUrl?.replace(".glb", ".png");
  public showRpmCreator: boolean = false;

  changeAvatarBtn() {
    this.showRpmCreator = true;
    // this.modalService.open(RpmCreatorComponent, { windowClass:'avatar-creator-modal'});
    // this.modalService.open(RpmCreatorComponent, { centered: true });

  }
  cancel() {
    this.showRpmCreator = false;
  }

  public get UserTypes(): typeof userTypes { return userTypes; }

  public copyToClipboard(text: string) {
    this.clipboard.copy(text);
  }
  logout(){
    this.authService.Logout();
  }

}
