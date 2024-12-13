import { Component } from '@angular/core';
import { DeleteHelperService } from 'app/services/firebase/delete-helper.service';
import { UserService } from 'app/services/firebase/user.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';
import { NavigationService } from 'app/services/navigationService/navigation.service';
import { FirestoreService } from 'app/services/firebase/firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { OrganizationService } from 'app/services/organizationService/organization.service';
import { SchoolService } from 'app/services/schoolService/school.service';
import { GlobalService } from 'app/services/globalService/global.service';
import { map } from 'rxjs';
import { Organization } from 'app/models/Interfaces/Organization';

@Component({
  selector: 'app-organization-manager',
  templateUrl: './organization-manager.component.html',
  styleUrls: ['./organization-manager.component.scss']
})
export class OrganizationManagerComponent {
  constructor(
    public userService: UserService,
    public deleteHelper: DeleteHelperService,
    public clipboard: Clipboard,
    public _router: Router,
    public navigation: NavigationService,
    public fs: FirestoreService,
    private firestore: AngularFirestore,
    public orgService: OrganizationService,
    public schoolService: SchoolService,
    private global: GlobalService
  ) {
    this.addSchool();
    this.init();
  }
  async init() {
    try {
      this.fs.firestore.collection(this.orgService.DbCollection, ref => ref.orderBy('title')).snapshotChanges()
        .pipe(map(changes => changes.map(c => ({
          id: c.payload.doc.id, ...c.payload.doc.data() as {}
        })))).subscribe(async data => {
          this.orgService.collection = data as Organization[];
        });
    }
    catch (error) {
      console.error("error with init\n", error);
    }
  }

  orgTitle: string;
  orgDesc: string;

  schools: { name: string }[] = [];

  orgToEdit?:Organization;

  startEditOrg(org:Organization){
    this.orgToEdit = org;
  }
  saveEditOrg(org:Organization){
    this.orgToEdit = undefined;
  }


  addSchool() {
    this.schools.push({ name: "" });
  }

  removeSchool(index: number) {
    try {
      this.schools.splice(index, 1);
    }
    catch (error) {
      console.error("error with remove school\n", error);
    }
  }

  updateSchoolName(index: number, event: any) {
    try {
      this.schools[index].name = event.target.value;
    }
    catch (error) {
      console.error("error with update school name\n", error);
    }
  }

  async pushOrgToDB() {
    try {
      let _schools: string[] = [];
      for (let i = 0; i < this.schools.length; i++) {
        _schools.push(this.schools[i].name);
      }

      let element: Organization = {
        title: this.orgTitle,
        description: this.orgDesc,
        schools: _schools

      } as Organization;

      let _org = await this.orgService.CreateElement(element);

      let _sids: string[] = [] as string[];

      for (let i = 0; i < this.schools.length; i++) {
        let e = { title: this.schools[i].name, description: "Default description", organizationId: _org.id };
        let r = await this.schoolService.CreateElement(e);
        _sids.push(r.id);
      }

      element.schools = _sids;

      this.schools = [];
      this.addSchool();
      this.orgTitle = "";
      this.orgDesc = "";
    }
    catch (error) {
      console.error("error with push org to db\n", error);
    }
  }



  validateOrgCreator() {
    try {
      if (this.orgTitle == "" || this.orgDesc == "") return true;
      for (let i = 0; i < this.schools.length; i++) {
        if (this.schools[i].name == "") return true;
      }
    }
    catch (error) {
      console.error("error with org validator\n", error);
    }
    return false;
  }
}
