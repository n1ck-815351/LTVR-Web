import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Observable, firstValueFrom, map } from 'rxjs';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SchoolService } from '../schoolService/school.service';
import { OrganizationService } from '../organizationService/organization.service';
import { Owner } from 'app/models/Interfaces/userTypes/Owner';
import { Admin } from 'app/models/Interfaces/userTypes/Admin';
import { Moderator } from 'app/models/Interfaces/userTypes/Moderator';
import { Educator } from 'app/models/Interfaces/userTypes/Educator';
import { Enrollee } from 'app/models/Interfaces/userTypes/Enrollee';
import { School } from 'app/models/Interfaces/School';
import { Organization } from 'app/models/Interfaces/Organization';
import { PinService } from '../pin.service';
import { ModalService } from '../modal.service';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Classroom } from 'app/models/Interfaces/Classroom';
import { user } from 'app/models/Interfaces/Enrollment';
import { GlobalService } from '../globalService/global.service';

export type UserType = Owner | Admin | Moderator | Educator | Enrollee;

export enum userTypes {
  null = -1,
  Student,
  Teacher,
  Moderator,
  Administrator,
  Owner
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public DbCollection = `master/${this.global.outputCollection}/Users`;
  fsRef = collection(this.firestore.firestore, this.DbCollection);

  constructor(private fs: FirestoreService,
    private authService: AuthService,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private schoolService: SchoolService,
    private orgService: OrganizationService,
    private pinService: PinService,
    private global: GlobalService,
    private modalService: ModalService
  ) {
    this.auth.user.subscribe(u => this.currentFireUser = u);

    this.authService.authStatusListener().subscribe(res => {
      if (res && res.uid) {
        this.fbUser = res;
        this.getCurrentUserData().subscribe(user => {
          // alert("set your user!" + user.baseUser?.firstName);
          if (user) {
            this.user = user;
          }
          if (!user.baseUser?.pin || user.baseUser?.pin.length != 4) {
            let pin = this.pinService.generateCode();
            this.modalService.NewInfoModal("New Pin Generated", "Your account has been provided with a new pin, since you didn't already have one or it needed updated." +
              "\nTake note of this pin, you can find it in your profile at any time." +
              "\nUse this pin to log into the VR app: \n" + this.pinService.formatCode(pin));


            user.baseUser!.pin = pin;

            this.fs.firestore.collection(this.DbCollection).doc(user.id!).update({ 'baseUser.pin': pin });
          }
        });
      }
    });
  }

  public currentFireUser: any;

  public isAnonymous() {
    if (this.currentFireUser) {
      return this.currentFireUser.isAnonymous;
    }
    return true;
  }

  public user: UserType;

  public fbUser: any;
  public school: School;
  public organization: Organization;

  public getCurrentUserData(): Observable<UserType> {
    return new Observable<UserType>(observer => {
      this.auth.currentUser.then(me => {
        if (!me) { console.log("not logged in", me); observer.complete(); return; }
        this.fs.firestore.collection(this.DbCollection, ref => ref.where("baseUser.uid", "==", me!.uid).orderBy('baseUser.firstName'))
          .snapshotChanges()
          .pipe(map(changes => changes.map(c => (
            { id: c.payload.doc.id, ...c.payload.doc.data() as {} }
          ))))
          .subscribe(data => {
            this.user = (data[0] as UserType);
            if (this.user) {
              this.getOrgForUser(this.user.baseUser?.organizationId!);
              this.getSchoolForUser(this.user.baseUser?.schoolId!);
              observer.next(this.user);
              this.queryUsersInOrganization(this.user.baseUser?.organizationId!);
            }
            observer.complete();
          });
      });
    });
  }

  public queryCurrentUserData() {

    return this.fs.firestore.collection("master").doc(this.global.outputCollection).collection("Users", ref => ref.where("baseUser.uid", "==", this.authService.fbUser!.uid).orderBy('baseUser.firstName'))
      .snapshotChanges()
      .pipe(map(changes => changes.map(c => (
        { id: c.payload.doc.id, ...c.payload.doc.data() }
      ))));
  }
  public async queryUserByUid(uid: string) {
    const snapshot = await firstValueFrom(this.fs.firestore.collection<UserType>(this.DbCollection, ref => ref.where("baseUser.uid", "==", uid).orderBy("baseUser.uid")).snapshotChanges());
    console.log(snapshot[0].payload.doc.id)
    return snapshot[0].payload.doc.id;
  }
  public async queryUserObjectByUid<T>(uid: string) {
    // const snapshot = await firstValueFrom(this.fs.firestore.collection<T>(this.DbCollection, ref => ref.where("baseUser.uid", "==", uid)).snapshotChanges());
    const snapshot = await firstValueFrom(this.fs.firestore.collection<T>(this.DbCollection).doc(uid).snapshotChanges());
    console.log("snapshot", snapshot);
    if (snapshot) {
      const u: T = { ...snapshot.payload.data(), id: snapshot.payload.id } as T;
      console.log(u);
      console.log(snapshot.payload.data());
      return u;
    }
    else return undefined;
  }

  public usersInOrganization: UserType[];
  public queryUsersInOrganization(id: string) {
    return this.fs.firestore.collection("master").doc(this.global.outputCollection).collection("Users", ref => ref.where("baseUser.organizationId", "==", id).orderBy('baseUser.firstName'))
      .snapshotChanges()
      .pipe(map(changes => changes.map(c => (
        { id: c.payload.doc.id, ...c.payload.doc.data() }
      )))).subscribe(data => {
        if (data && data.length > 0) this.usersInOrganization = data as UserType[];
      });
  }


  public async getOrgForUser(id: string) {
    const docRef = this.fs.firestore.collection<Organization>(this.orgService.DbCollection);
    let cDoc: Organization | null = null;

    await docRef.doc(id).ref.get().then(async function (doc) {
      const element: Organization = doc.data() as Organization;
      element.id = doc.id;
      cDoc = element;
    });
    if (cDoc)
      this.organization = cDoc;
  }

  private async getSchoolForUser(id: string) {
    const docRef = this.fs.firestore.collection<School>(this.schoolService.DbCollection);
    let cDoc: School | null = null;

    await docRef.doc(id).ref.get().then(async function (doc) {
      const _class: School = doc.data() as School;
      _class.id = doc.id;
      cDoc = _class;
    });
    if (cDoc)
      this.school = cDoc;
  }

  public currentUserOrganization: Organization[] | null;

  async getUsersOrganization(userId: string) {

    const q = query(this.fsRef,
      where('baseUser.uid', '==', userId),
    );

    const querySnapshot = (await getDocs(q));
    if (querySnapshot.empty) {
      console.log('EMPTY')
      return this.currentUserOrganization = [];
    } else {
      return this.currentUserOrganization = querySnapshot.docs.map(s => {
        const _data = JSON.parse(JSON.stringify(s.data())) as Organization;
        return _data;
      })
    }
  }

  public async deleteUser(uid: string) {
    if (uid == this.user.baseUser?.uid) {
      alert("You cannot delete your own user data.");
      return;
    }
    let user = await firstValueFrom(this.authService.authStatusListener());
    if (user) {
      const id = await this.queryUserByUid(user.uid);
      this.deleteDocument(this.DbCollection, id);
    }
    // if(this.auth.)
  }

  maxRecentlyVisitedClasses: number = 8;
  async setRecentlyVisitedClass(userId: string, classroom: Classroom) {
    const q = query(this.fsRef,
      where('baseUser.uid', '==', userId),
    );

    const querySnapshot = await getDocs(q);
    let recentClasses: Classroom[] = [];
    if (!querySnapshot.empty) {
      querySnapshot.docs.map(s => {
        const _userData = { id: s.id, ...s.data() } as UserType;

        if (_userData.baseUser?.recentlyVisitedClasses) {
          recentClasses = _userData.baseUser?.recentlyVisitedClasses;
        }

        if (classroom) {
          // Check if this classroom has already been visited recently
          // Remove old reference if it exists.
          const existingClassroomIndex = recentClasses.findIndex(c => c.id == classroom.id);
          if (existingClassroomIndex > -1) {
            recentClasses.splice(existingClassroomIndex, 1);
          }

          // If we have too many classes for our recent list, remove one.
          if (recentClasses && recentClasses.length >= this.maxRecentlyVisitedClasses) {
            recentClasses.pop();
          }

          // Add the newly visited class.
          recentClasses.unshift(classroom);
          if (_userData.baseUser) {
            _userData.baseUser.recentlyVisitedClasses = recentClasses;
            if (_userData.id) {
              this.fs.firestore.collection(this.DbCollection).doc(_userData.id).update(_userData);
            }
          }
        }
      })
    }
  }

  async getUsersByUserType(organizationIds: string[], userType: number, orderByField: string = 'lastName', direction: string = 'asc') {
    // const orderDirection: OrderByDirection = direction as OrderByDirection;

    console.log('GetUSers', organizationIds, userType)
    let q = query(this.fsRef,
      where('baseUser.organizationId', 'in', organizationIds),
    );

    q = query(q, where('baseUser.userType', '==', userType))

    const querySnapshot = (await getDocs(q));

    let userCollection: any[] = [];
    if (!querySnapshot.empty) {
      querySnapshot.docs.map(doc => {
        const _userData = { id: doc.id, ...doc.data() } as user;
        userCollection.push(_userData);
      })
    }
    console.log('UserCollection', userCollection)
    return userCollection;
  }
  async getDefinedUsersByUserType<T>(organizationIds: string[], userType: number, orderByField: string = 'lastName', direction: string = 'asc') {
    // const orderDirection: OrderByDirection = direction as OrderByDirection;

    console.log('GetUSers', organizationIds, userType)
    let q = query(this.fsRef,
      where('baseUser.organizationId', 'in', organizationIds),
    );

    q = query(q, where('baseUser.userType', '==', userType))

    const querySnapshot = (await getDocs(q));
    
    let userCollection: T[] = [];
    if (!querySnapshot.empty) {
      querySnapshot.docs.map(doc => {
        const _userData = { id: doc.id, ...doc.data() } as T;
        userCollection.push(_userData);
      })
    }
    console.log('UserCollection', userCollection)
    return userCollection;
  }
  async getDefinedUsersInClasses<T>(classIds: string[], userType: number, orderByField: string = 'lastName', direction: string = 'asc') {
    console.log('GetUsers', classIds, userType);
    let q = query(this.fsRef, where('baseUser.classIds', 'array-contains-any', classIds));

    q = query(q, where('baseUser.userType', '==', userType));

    const querySnapshot = await getDocs(q);
    const userCollection: T[] = [];

    if (!querySnapshot.empty) {
      querySnapshot.docs.forEach(doc => {
        const _userData = { id: doc.id, ...doc.data() } as T;
        userCollection.push(_userData);
      });
    }

    console.log('UserCollection', userCollection);
    return userCollection;
  }

  async removeRecentlyVisitedClass(userId: string, classroom: Classroom) {
    const q = query(this.fsRef,
      where('baseUser.uid', '==', userId),
    );

    const querySnapshot = await getDocs(q);
    let recentClasses: Classroom[] = [];
    if (!querySnapshot.empty) {
      querySnapshot.docs.map(s => {
        const _userData = { id: s.id, ...s.data() } as UserType;

        if (_userData.baseUser?.recentlyVisitedClasses) {
          recentClasses = _userData.baseUser?.recentlyVisitedClasses;
        }

        if (classroom) {
          // Check if this classroom has already been visited recently
          // Remove old reference if it exists.
          const existingClassroomIndex = recentClasses.findIndex(c => c.id == classroom.id);
          if (existingClassroomIndex > -1) {
            recentClasses.splice(existingClassroomIndex, 1);
          }
          if (_userData.baseUser) {
            _userData.baseUser.recentlyVisitedClasses = recentClasses;
            if (_userData.id) {
              this.fs.firestore.collection(this.DbCollection).doc(_userData.id).update(_userData);
            }
          }
        }
      })
    }
  }

  public async updateUsers<T>(users: any[]) {
    let batch = this.fs.firestore.firestore.batch();
    users.forEach(user => {
      const ref = this.fs.firestore.collection<T>(this.DbCollection).doc(user.id).ref;
      batch.update(ref, user.data);
    });
    await batch.commit();
  }

  public async deleteDocument(collection: string | null, id: string | null) {
    if (id == null) return;
    if (collection == null) return;
    console.log("delete", collection, id);
    return await this.fs.firestore.collection(collection).doc(id).delete().then((result) => {
      return result;
    }).catch(err => { console.error("failed to delete document", err); });
  }

  /**
   * 
   * @param url string "url.glb" 
   * @returns string "url.png"
   */
  public parseAvatarUrl(url: string) {
    return url.replace('.glb', '.png');
  }

  getTeacherObjectFromUser(user: UserType) {
    return user as Educator;
  }

  getStudentObjectFromUser(user: UserType) {
    return user as Enrollee;
  }



}
