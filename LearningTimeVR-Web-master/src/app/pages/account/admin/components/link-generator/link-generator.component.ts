import { Component } from '@angular/core';
import { DeleteHelperService } from 'app/services/firebase/delete-helper.service';
import { UserService } from 'app/services/firebase/user.service';
import { GlobalService } from 'app/services/globalService/global.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getDocs, orderBy, query, where } from '@angular/fire/firestore';
import { FirestoreService } from 'app/services/firebase/firestore.service';
import { Link } from 'app/models/Interfaces/Link';
import { LinkService } from 'app/services/firebase/link.service';
import { v4 as uuidv4 } from 'uuid';
import { OrganizationService } from 'app/services/organizationService/organization.service';
import { SchoolService } from 'app/services/schoolService/school.service';
import { School } from 'app/models/Interfaces/School';
import { Organization } from 'app/models/Interfaces/Organization';
import { map } from 'rxjs';

@Component({
  selector: 'app-link-generator',
  templateUrl: './link-generator.component.html',
  styleUrls: ['./link-generator.component.scss']
})
export class LinkGeneratorComponent {
  selectedOrg: number = 0;
  selectedSchool: number = 0;
  usesLimit: number = 1;
  selectedUserType: number = 0;
  schoolCollection: School[] | null;
  limitUses:boolean = false;
  expires:boolean = false;

  constructor(
    public linkService: LinkService,
    public global: GlobalService,
    public orgService: OrganizationService,
    public fs: FirestoreService,
    public schoolService: SchoolService
  ) { this.init(); }

  async init() {
    await this.linkService.getLinksCollection();
    this.schoolCollection = await this.schoolService.getCollectionInOrg(this.orgService.collection[0].id);
    try {
      this.fs.firestore.collection(this.orgService.DbCollection, ref => ref.orderBy('title')).snapshotChanges()
        .pipe(
          map(
            changes =>
              changes.map(c => ({
                id: c.payload.doc.id, ...c.payload.doc.data() as {}
              })))
        ).subscribe(async data => {
          this.orgService.collection = data as Organization[];
          await this.linkService.getLinksCollection();
          this.schoolCollection = await this.schoolService.getCollectionInOrg(this.orgService.collection[0].id);
          // this.collection = data;

          // return this.collection;
        });

    }
    catch (error) {
      console.error("error with init\n", error);
    }
    // await this.orgService.getCollection();
    // await this.getLinksCollection();
    // await this.getSchoolCollection(this.orgService.collection[0].id);
  }

  async generateLinks() {
    console.log("expires", this.expires, "limit uses", this.limitUses);
    if (this.schoolCollection == null) return;
    try {
      const now = new Date();
      const expirationDate = new Date(now.getTime() + 24 * 60 * 60 * 1000).toString();
      const myuuid = uuidv4();
      const newLinks: Link[] = Array.from({ length: this.linkService.linkCount }, (_, index) => ({
        url: `${this.global.currentUrl}/register?token=${myuuid}`,
        userType: this.selectedUserType,
        expirationDate,
        invalidated: false,
        uses: this.usesLimit,
        organization: this.orgService.collection[this.selectedOrg].id,
        school: this.schoolCollection![this.selectedSchool].id,
        expires: this.expires,
        limitUses: this.limitUses,
        token: myuuid
      } as Link));
      console.log(newLinks);

      for (let i = 0; i < newLinks.length; i++) {
        await this.linkService.PushLinkToDB(newLinks[i]);
      }
      await this.linkService.getLinksCollection();
      // this.links = newLinks.filter((link) => link.userType === this.selectedUserType) as Link[];
      // this.links = this.links.concat(newLinks.filter((link) => link.userType === this.selectedUserType));
    }
    catch (error) {
      console.error("error with generate links\n", error);
    }
  }

  limitChanged(event:any){
    console.log(event.target.checked);
    this.limitUses = event.target.checked;
  }
  expiresChanged(event:any){
    console.log(event.target.checked);
    this.expires = event.target.checked;
  }


  async onOrgChange() {
    try {
      this.schoolCollection = await this.schoolService.getCollectionInOrg(this.orgService.collection[this.selectedOrg].id);
      console.log("org changed, here are the new schools", this.schoolCollection);
    }
    catch (error) {
      console.error("error with onorgchange()\n", error);
    }
  }

  getSchool(link: Link) {
    // if (this.schoolCollection == null) {
    //   console.error("error with get school\n", "null");
    //   return;
    // }
    if (this.schoolCollection == undefined) return;
    try {
      for (let i = 0; i < this.schoolCollection!.length; i++) {
        if (this.schoolCollection![i].id == link.school) return this.schoolCollection![i].title;
      }
    }
    catch (error) {
      console.error("error with get school\n", error);
      return null;
    }
    return null;
  }

  selectedFilterUserType: number = -1;
  get filteredLinks(): Link[] {
    try {
      if (this.selectedFilterUserType === -1) {
        return this.linkService.collection;
      } else {
        return this.linkService.collection.filter(link => link.userType === this.selectedFilterUserType);
      }
    }
    catch (error) {
      console.error("error with filteredlinks()\n", error);
      return [];
    }
  }

}
