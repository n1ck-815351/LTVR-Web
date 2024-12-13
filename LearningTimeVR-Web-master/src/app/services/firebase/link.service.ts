import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirestoreService } from './firestore.service';
import { DeleteHelperService } from './delete-helper.service';
import { UserService } from './user.service';
import { collection } from 'firebase/firestore';
import { Link } from 'app/models/Interfaces/Link';
import { Clipboard } from '@angular/cdk/clipboard';
import { OrganizationService } from '../organizationService/organization.service';
import { GlobalService } from '../globalService/global.service';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  public userTypes: string[] = ["Student", "Teacher", "Moderator", "Administrator", "Owner"];
  DbCollection = `master/${this.global.outputCollection}/links`;
  linksRef = collection(this.firestore.firestore, this.DbCollection);
  collection: Link[] = [];
  linkCount: number = 1;

  constructor(
    public userService: UserService,
    public orgService: OrganizationService,
    public deleteHelper: DeleteHelperService,
    public clipboard: Clipboard,
    public fs: FirestoreService,
    private firestore: AngularFirestore,
    private global: GlobalService
  ) { }



  async PushLinkToDB(input: any) {
    try {
      const element: Link = {
        ...input
      } as Link;

      this.fs.firestore.collection(this.DbCollection).add(element)
      return element;
    }
    catch (error) {
      console.error("error with push link to db\n", error);
      return undefined;
    }
  }

  async getLinksCollection() {
    try {
      console.log("getting links");

      this.fs.firestore.collection(this.DbCollection).snapshotChanges().subscribe(a => {
        this.collection = a.map(c => {
          let x: Link = { id: c.payload.doc.id, ...c.payload.doc.data() as {} } as Link;
          return x;
        })
      });

    }
    catch (error) {
      console.error("error with get links\n", error);
    }
  }

  async getLinkById(id: string) {
    try {
      const linksRef = this.fs.firestore.collection(this.DbCollection);

      await linksRef.doc(id).ref.get().then(async function (doc) {
        const link: Link = doc.data() as Link;
        if (link) link.id = doc.id;
        if (!doc) { console.log(id, "link could not be found"); }
      });

    }
    catch (error) {
      console.error("error with get link by id\n", error);
    }
  }
  getOrg(link: Link) {
    try {
      for (let i = 0; i < this.orgService.collection.length; i++) {
        if (this.orgService.collection[i].id == link.organization) return this.orgService.collection[i].title;
      }
    }
    catch (error) {
      console.error("error with getorg()\n", error);
      return null;
    }
    return null;
  }
  copyLink(link: Link) {
    this.clipboard.copy(link.url);
  }
  async deleteLink(link: Link) {
    try {
      await this.deleteHelper.deleteDocument(this.DbCollection, link.id);
    }
    catch (error) {
      console.error("error with delete link\n", error);
    }
  }

  getTimeUntilExpiration(expirationDate: string): string {
    try {
      const now = new Date();
      const expiration = new Date(expirationDate);
      const diff = expiration.getTime() - now.getTime();
      const seconds = Math.round(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      const timeString = [
        { value: days, unit: 'd' },
        { value: hours % 24, unit: 'h' },
        { value: minutes % 60, unit: 'm' },
        { value: seconds % 60, unit: 's' },
      ]
        .filter(time => time.value > 0)
        .map(time => `${time.value}${time.unit}${time.value > 1 ? '' : ''}`)
        .join(':');


      return timeString;
    }
    catch (error) {
      console.error("error with gettimeuntilexpiration\n", error);
      return "";
    }
  }
  getCurrentDateTime(): number {
    return new Date().getTime();
  }

  getDate24HoursFromNow() {
    const date = new Date();
    date.setHours(date.getHours() + 24);
    const expirationDate = date.toString();
    return expirationDate;
  }
  getTimeExpired(link: Link) {
    if (!link.expires) return false;
    let time = (new Date(link.expirationDate).getTime() - new Date().getTime());
    if (time <= 0) {
      return true;
    } else return false;
  }


}
