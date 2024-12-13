import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from 'app/services/firebase/user.service';
import { GlobalService } from 'app/services/globalService/global.service';

@Component({
  selector: 'app-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.scss']
})
export class ContentCardComponent {

  @Input() title: string | null = '';
  @Input() description: string | null = '';
  @Input() lastVisited: any | null = '';
  @Input() orgId: string | null = '';
  @Input() displayElementControls: boolean = true;

  
  @Output() actionClickEvent = new EventEmitter();
  @Output() editClickEvent = new EventEmitter();
  @Output() deleteClickEvent = new EventEmitter();

  constructor(
    private globalService: GlobalService,
    private userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.getCanUseControls();
  }

  public displayLTVRDemoBadge(){
    // console.log(this.orgId, this.globalService.demoOrgId)
    const isDemoOrg = this.orgId == this.globalService.demoOrgId
    const userId = this.userService.user!.baseUser?.uid
    return isDemoOrg;
  }

  canUseControls: boolean = false

  public getCanUseControls() {
    const orgId = this.userService.user!.baseUser?.organizationId;
    const userOwnsCard = this.orgId == orgId;
    this.canUseControls = userOwnsCard;
    return this.canUseControls;
  }

  public onActionClick() {
    this.actionClickEvent.emit();
  }

  public onEditClick() {
    this.editClickEvent.emit();
  }

  public onDeleteClick() {
    this.deleteClickEvent.emit();
  }
}
