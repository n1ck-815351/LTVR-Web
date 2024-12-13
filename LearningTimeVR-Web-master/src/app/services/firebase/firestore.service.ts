import { Injectable, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { Classroom } from 'app/models/Interfaces/Classroom';
import { map } from 'rxjs';
import { AuthService } from './auth.service';
import { ClassroomSubject } from 'app/models/Interfaces/ClassroomSubject';
import { ClassroomLesson } from 'app/models/Interfaces/ClassroomLesson';
import { LessonContent } from 'app/models/Interfaces/LessonContent';
import { CreatorDialog } from 'app/models/Interfaces/events/creator-dialog';
import { NavigationService } from '../navigationService/navigation.service';
import { Organization } from 'app/models/Interfaces/Organization';
import { Educator } from 'app/models/Interfaces/userTypes/Educator';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService implements OnInit {
  collection_classes: AngularFirestoreCollection<Classroom>;
  collection_organizations: AngularFirestoreCollection<Organization>;
  classes?: Classroom[];
  organizations: Organization[];
  selectedClass: Classroom;
  currentUserClasses?: Classroom[] | null;
  snapshot: any;

  constructor(public firestore: AngularFirestore, public authService: AuthService, public navigation: NavigationService) {
    this.collection_classes = this.firestore.collection('classes', ref => ref.orderBy('title'));
    this.collection_organizations = this.firestore.collection('Organization', ref => ref.orderBy('name'));
    this.waitForClasses();
    this.getOrganizations();
  }

  ngOnInit(): void {

  }

  async searchForClassByName(name: string) {
      this.snapshot = this.firestore.collection('classes', ref => ref.orderBy('title').startAt(name)).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() as {} })))).subscribe(data => {
            this.classes = data as Classroom[];
            localStorage.setItem('classList', JSON.stringify(this.classes));
            this.setSelectedFromStorage();
            return this.classes;
          });
  }

  async getOrganizations() {
    this.snapshot = this.firestore.collection('Organization', ref => ref.orderBy('name')).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() as {} })))
      ).subscribe(data => {
        this.organizations = data as Organization[];
        for (let i = 0; i < this.organizations.length; i++) {
          this.getTeachers(this.organizations[i].id)
          // TODO: Need to populate users based on IDs.
          //this.organizations[i].users = this.teachers;
        }
        return this.organizations;
      });
  }

  teachers: Educator[];
  async getTeachers(orgId: string) {
    this.snapshot = this.firestore.collection(`Organization/${orgId}/teachers`, ref => ref.orderBy('lastName')).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() as {} })))
      ).subscribe(data => {
        this.teachers = data as Educator[];
        // this.setSelectedFromStorage();
        return this.teachers;
      });
  }


  async waitForClasses() {
    // await this.getClasses();
    // let docRef = this.firestore.doc("classes/gtcGu7YNW1IHE74ZQOS1").ref;
    // let snap = await getDoc(docRef);
    // let _cls:element_class|undefined = snap.data() as element_class;
    // console.log('WAITFORCLASSES')
    this.snapshot = this.firestore.collection('classes', ref => ref.orderBy('title')).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() as {} })))).subscribe(data => {
            this.classes = data as Classroom[];
            this.setSelectedFromStorage();
            return this.classes;
          });
  }

  setSelectedFromStorage() {
    // if (this.currentUserClasses)
    //   this.navigation.setSelectedClass(this.currentUserClasses[0]);
    // if (localStorage.getItem("selectedClass")) {
    //   if (this.classes) {
    //     let success = false;
    //     for (let i = 0; i < this.classes.length; i++) {
    //       if (this.classes[i].id == localStorage.getItem("selectedClass")) {
    //         success = true;
    //         console.log("loading saved class selection");
    //         this.navigation.setSelectedClass(this.classes[i]);
    //         this.selectedClass = this.classes[i];
    //       }
    //     }
    //     if (!success && this.classes.length > 0) {
    //       this.navigation.setSelectedClass(this.classes[0]);
    //       this.selectedClass = this.classes[0];
    //     }
    //   }
    //   else console.log("classes list was undefined.");
    // } else console.log("selected class storage item was null");
  }

  // async updateClass(_class: element_class) {
  //   console.log("go");
  //   if (this.classes == undefined || _class == undefined) { console.log("Classes or class was undefined.\n", this.classes, _class); return; }

  //   _class.jsonRepresentation = "";
  //   _class.jsonRepresentation = JSON.stringify(_class);

  //   for (let i = 0; i < this.classes.length; i++) {
  //     if (this.classes[i].id == _class.id) {
  //       console.log("Match found for edit");
  //       this.classes[i] = _class;

  //       let id: string | undefined;
  //       if (_class.id != null)
  //         id = _class.id;
  //       if (id != undefined)
  //         await this.collection_classes.doc(id).update(_class);
  //       else console.log("ID not found, ", id);
  //     }
  //   }
  // }

  getClass(fieldID: string | null) {
    // this.getClasses();
    if (this.classes == null || this.classes == undefined) return null;
    for (let i = 0; i < this.classes.length; i++) {
      if (this.classes[i].id == fieldID) return this.classes[i];
    }
    return null;
  }

  getClassesForCurrentUser() {

    this.snapshot = this.firestore.collection('classes', ref => ref.where('uid', '==', this.authService.fbUser.uid).orderBy('title')).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() as {} })))).subscribe(data => {
            this.currentUserClasses = data as Classroom[];
            // console.log(data);
          });
  }

  addClass(c: Classroom) {
    let title = c.title;
    this.collection_classes.add(c).then(_ => alert('Successfully added class ' + title));
  }

  // async deleteClass(fieldID: string | null) {
  //   if (fieldID == null) { console.log("Field ID was null."); return; }
  //   const ref = this.firestore.collection('classes');
  //   await ref.doc(fieldID).delete();
  //   console.log("Deleted class with id:", fieldID);
  //   // this.getClasses();
  // }

  async deleteLessonModule(fieldID: string | null, classDoc: Classroom, lmIndex: number) {
    if (fieldID == null) { console.log("Field ID was null."); return; }
    const ref = this.firestore.collection('classes');
    if (classDoc.lessonModules == undefined) { console.log("Lesson modules list was undefined in class,", classDoc.title); return; }

    let lm: ClassroomSubject = classDoc.lessonModules[lmIndex];
    if (classDoc.lessonModules[lmIndex] == null) { console.log("Lesson module", lmIndex, "in class", classDoc.title, "is null."); return; }
    let title = classDoc.lessonModules[lmIndex].title;


    classDoc.lessonModules.splice(lmIndex, 1);
    classDoc.jsonRepresentation = "";
    classDoc.jsonRepresentation = JSON.stringify(classDoc);
    await ref.doc(fieldID).set(classDoc);

    console.log("Deleted lesson module:", title, "in class", classDoc.title, "\n", classDoc);
    // this.getClasses();
  }

  async deleteContentCluster(fieldID: string | null, classDoc: Classroom, lmIndex: number, ccIndex: number) {
    if (fieldID == null) { console.log("Field ID was null."); return; }
    const ref = this.firestore.collection('classes');
    if (classDoc == undefined) { console.log("Class was undefined."); return; }

    if (classDoc.lessonModules == undefined) { console.log("Lesson modules list was undefined in class,", classDoc.title); return; }
    let lessonModules = classDoc.lessonModules;

    if (lessonModules == undefined) { console.log("Lesson module was undefined in class,", classDoc.title); return; }
    let contentClusters = classDoc.lessonModules[lmIndex].contentClusters;

    if (contentClusters == undefined) { console.log("ContentClusters list was undefined in class,", classDoc.title); return; }

    let ccTitle = contentClusters[ccIndex].title;

    contentClusters.splice(ccIndex, 1);
    classDoc.lessonModules[lmIndex].contentClusters = contentClusters;
    let lmTitle = classDoc.lessonModules[lmIndex].title;

    classDoc.jsonRepresentation = "";
    classDoc.jsonRepresentation = JSON.stringify(classDoc);
    await ref.doc(fieldID).set(classDoc);
    console.log("Deleted Content Cluster:", ccTitle, "in lesson module", lmTitle, "in class", classDoc.title);
    // this.getClasses();
  }
  async deleteContent(fieldID: string | null, classDoc: Classroom, lmIndex: number, ccIndex: number, cIndex: number) {
    if (fieldID == null) { console.log("Field ID was null."); return; }
    const ref = this.firestore.collection('classes');
    if (classDoc == undefined) { console.log("Class was undefined."); return; }

    if (classDoc.lessonModules == undefined) { console.log("Lesson modules list was undefined in class,", classDoc.title); return; }

    let lessonModules = classDoc.lessonModules;
    if (lessonModules == undefined) { console.log("Lesson module was undefined in class,", classDoc.title); return; }

    let contentClusters = classDoc.lessonModules[lmIndex].contentClusters;
    if (contentClusters == undefined) { console.log("ContentClusters list was undefined in class,", classDoc.title); return; }

    let contentCluster = contentClusters[ccIndex];
    if (contentCluster == undefined) { console.log("ContentCluster was undefined in class,", classDoc.title); return; }
    if (contentCluster.content == undefined) { console.log("Content list was undefined in class,", classDoc.title); return; }

    let contentList = contentCluster.content;
    let contentTitle = contentList[cIndex].title;
    let lmTitle = classDoc.lessonModules[lmIndex].title;


    // splice and overwrite
    contentList.splice(cIndex, 1);

    let _lmList = classDoc.lessonModules;
    let _ccList = _lmList[lmIndex].contentClusters;
    if (_ccList == null) { console.log("content cluster list was null."); return; }
    _ccList[ccIndex].content = contentList;
    _lmList[lmIndex].contentClusters = _ccList;
    classDoc.lessonModules = _lmList;



    classDoc.jsonRepresentation = "";
    classDoc.jsonRepresentation = JSON.stringify(classDoc);
    await ref.doc(fieldID).set(classDoc);
    console.log("Deleted Content:", contentTitle, "in lesson module", lmTitle, "in class", classDoc.title);

    // this.getClasses();
  }

  async CreateClass(input: CreatorDialog) {
    let c: Classroom = { title: input.title, description: input.description, tags: input.tags } as Classroom;
    c.jsonRepresentation = "";
    c.jsonRepresentation = JSON.stringify(c);
    this.collection_classes.add(c).then(_ => console.log("Added class successfully."));
  }
  async CreateLessonModuleInClass(fieldID: string | null, input: CreatorDialog) {
    if (fieldID == null) { console.log("Invalid field id,", fieldID); return; }
    const classDocRef = this.firestore.collection('classes');
    await classDocRef.doc(fieldID).ref.get().then(async function (doc) {
      const _class: Classroom = doc.data() as Classroom;

      console.log("Class:", fieldID, "\n", _class.title, "\n", _class);


      if (_class.lessonModules == undefined || _class.lessonModules == null || _class.lessonModules.length == 0) {
        _class.lessonModules = [] as ClassroomSubject[]; // make sure lesson modules list is not null
      }
      let newLessonModule: ClassroomSubject = { title: input.title, description: input.description, tags: input.tags } as ClassroomSubject;
      _class.lessonModules.push(newLessonModule);

      _class.jsonRepresentation = "";
      _class.jsonRepresentation = JSON.stringify(_class); // update json


      await classDocRef.doc(fieldID).set(_class); // push to firebase as an overwrite operation

      console.log("Updated class with the new lesson module,", _class);

    });

    // this.getClasses();
  }
  async CreateContentClusterInClass(fieldID: string | null, lmIndex: number, input: CreatorDialog) {
    if (fieldID == null || fieldID == undefined) { console.log("Invalid field id,", fieldID); return; }

    const classDocRef = this.firestore.collection('classes');
    await classDocRef.doc(fieldID).ref.get().then(async function (doc) {
      const _class: Classroom = doc.data() as Classroom;

      console.log("Class:", fieldID, "\n", _class.title, "\n", _class);
      if (_class == undefined) console.log("class couldn't be found.", _class)

      if (_class.lessonModules == undefined || _class.lessonModules == null || _class.lessonModules.length == 0) { console.log("Invalid lesson modules list,", _class.lessonModules); return; }

      const _lm = _class.lessonModules[lmIndex];
      if (_lm == null || _lm == undefined) { console.log("lesson module null in class,", _class, "\n", _lm, "\n", lmIndex, _class.lessonModules.length); return; }

      if (_lm.contentClusters == undefined || _lm.contentClusters == null || _lm.contentClusters.length == 0) {
        _lm.contentClusters = [] as ClassroomLesson[]; // make sure content clusters list is not null
      }



      let newContentCluster: ClassroomLesson = { title: input.title, description: input.description, tags: input.tags } as ClassroomLesson;
      _lm.contentClusters.push(newContentCluster);
      _class.lessonModules[lmIndex] = _lm;
      _class.jsonRepresentation = "";

      let c: Classroom = _class;
      _class.jsonRepresentation = JSON.stringify(c); // update json

      await classDocRef.doc(fieldID).set(_class); // push to firebase as an overwrite operation
      console.log("Updated class with the new content cluster,", input.title, "for lesson module", _class.lessonModules[lmIndex].title);
    });
  }

  async CreateContentInClass(fieldID: string | null, lmIndex: number, ccIndex: number, input: CreatorDialog) {
    if (fieldID == null || fieldID == undefined) { console.log("Invalid field id,", fieldID); return; }

    const classDocRef = this.firestore.collection('classes');
    await classDocRef.doc(fieldID).ref.get().then(async function (doc) {
      const _class: Classroom = doc.data() as Classroom;
      if (_class == undefined || _class == null) { console.log("class couldn't be found.", _class); return; }

      if (_class.lessonModules == undefined || _class.lessonModules == null || _class.lessonModules.length == 0) { console.log("Invalid lesson modules list,", _class.lessonModules); return; }

      const _lm = _class.lessonModules[lmIndex];
      if (_lm == null || _lm == undefined) { console.log("lesson module null in class,", _class, "\n", _lm, "\n", lmIndex, _class.lessonModules.length); return; }

      if (_lm.contentClusters == undefined || _lm.contentClusters == null || _lm.contentClusters.length == 0) { console.log("Invalid content clusters list,", _lm.contentClusters); return; }

      const cc = _lm.contentClusters[ccIndex];
      if (cc == null || cc == undefined) { console.log("content cluster null in class,", _class, "\n", cc, "\n", ccIndex); return; }


      if (cc.content == undefined || cc.content == null || cc.content.length == 0) {
        cc.content = [] as LessonContent[]; // make sure content clusters list is not null
      }

      let newContent: LessonContent = { title: input.title, description: input.description, tags: input.tags, getURL: input.optionalArgs.url, contentType: input.optionalArgs.contentType, contentFormatType: input.optionalArgs.contentFormatType, isStereoscopic:input.optionalArgs.isStereoscopic } as LessonContent;
      cc.content.push(newContent);
      newContent.indexInList = cc.content.indexOf(newContent);

      let c: Classroom = _class;
      c.jsonRepresentation = "";
      _class.jsonRepresentation = JSON.stringify(c); // update json

      await classDocRef.doc(fieldID).set(_class); // push to firebase as an overwrite operation
      console.log("Updated class with the content,", input.title);

    });
  }
}
