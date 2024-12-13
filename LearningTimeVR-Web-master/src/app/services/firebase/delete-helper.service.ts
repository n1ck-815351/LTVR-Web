import { Injectable } from '@angular/core';
import { ClassroomService } from '../classroomService/classroom.service';
import { SubjectService } from '../subjectService/subject.service';
import { LessonService } from '../lessonService/lesson.service';
import { ContentService } from '../contentService/content.service';
import { Classroom } from 'app/models/Interfaces/Classroom';
import { FirestoreService } from './firestore.service';
import { ClassroomSubject } from 'app/models/Interfaces/ClassroomSubject';
import { ClassroomLesson } from 'app/models/Interfaces/ClassroomLesson';
import { LessonContent } from 'app/models/Interfaces/LessonContent';
import { Organization } from 'app/models/Interfaces/Organization';
import { School } from 'app/models/Interfaces/School';
import { OrganizationService } from '../organizationService/organization.service';
import { ClassLibraryService } from '../classLibraryService/class-library.service';
import { ClassroomLibrary } from 'app/models/Interfaces/ClassroomLibrary';
import * as firebase from 'firebase/app';
import { getStorage, ref, deleteObject } from '@angular/fire/storage';
import { GlobalService } from '../globalService/global.service';


@Injectable({
  providedIn: 'root'
})
export class DeleteHelperService {


  constructor(private fs: FirestoreService,
    private organizationService: OrganizationService,
    private classLibraryService: ClassLibraryService,
    private classService: ClassroomService,
    private subjectService: SubjectService,
    private lessonService: LessonService,
    private contentService: ContentService,
    private global:GlobalService
  ) {

  }

  // if the node type is less than or equal to the relevant node type, match found
  private firebaseApp: any = firebase.getApp();
  private organizationNodetype: number = 0;
  private classNodeType: number = 1;
  private classLibraryNodeType: number = 2;
  private subjectNodetype: number = 3;
  private lessonNodeType: number = 4;
  private contentNodeType: number = 5;

  private deleteLog: string = "";

  // public functions

  // classes
  public async deleteClass(id: string | null) {
    if (id == null) { console.log("invalid id"); return; }
    await this.deleteClassHandler(id, 0);
  }

  // subjects
  public async deleteAllSubjectsInClass(id: string | null) {
    if (id == null) { console.log("invalid id"); return; }
    await this.deleteSubjectHandler(id, 1);
  }
  public async deleteSubjectById(id: string | null) {
    await this.deleteLessonHandler(id, 1);
    await this.deleteDocument(this.subjectService.DbCollection, id);
  }

  // lessons
  public async deleteAllLessonsInSubject(id: string | null) {
    if (id == null) { console.log("invalid id"); return; }
    await this.deleteLessonHandler(id, 2);
  }
  public async deleteLessonById(id: string | null) {
    await this.deleteContentHandler(id);
    await this.deleteDocument(this.lessonService.DbCollection, id);
  }

  // content
  public async deleteAllContentInLesson(id: string | null) {
    if (id == null) { console.log("invalid id"); return; }
    await this.deleteContentHandler(id);
  }
  public async deleteContentById(id: string | null) {
    console.log("deleting content");
    if (id == null) { console.log("invalid id"); return; }
    let c: LessonContent = await this.contentService.getById(id);
    let _ref = c.ref;
    console.log("content", c);
    console.log("ref", _ref);

    let result = await this.deleteCloudStorageItem(_ref);
    if (result == true) {
      console.log("Deleted content successfully");
    }
    
    console.log("deleting document", id);
    let succ = await this.deleteDocument(this.contentService.DbCollection, id)
    console.log("finished deleting content", succ);
    // });

    // })

  }


  // handlers

  private async deleteOrganizationHandler(id: string, deletedElementType: number) {
    this.deleteLog = "";

    const _organization = await this.getOrganizationById(id);

    if ((deletedElementType) <= this.classNodeType) {
      await this.deleteClassHandler(id, deletedElementType);

      // < delete class >
      await this.deleteDocument(this.organizationService.DbCollection, id);
      console.log("\nDeleted organization: " + _organization.id);
    }
    console.log(this.deleteLog);
  }
  private async deleteClassHandler(id: string, deletedElementType: number) {
    this.deleteLog = "";

    const _class = await this.getClassById(id);

    if ((deletedElementType) <= this.subjectNodetype) {
      await this.deleteSubjectHandler(id, deletedElementType);

      // < delete class >
      await this.deleteDocument(this.classService.DbCollection, id);
      console.log("\nDeleted class: " + _class.id);
    }
    console.log(this.deleteLog);
  }

  private async deleteClassLibraryHandler(id: string, deletedElementType: number) {
    this.deleteLog = "";

    const _class = await this.getClassById(id);

    if ((deletedElementType) <= this.subjectNodetype) {
      await this.deleteSubjectHandler(id, deletedElementType);

      // < delete class >
      await this.deleteDocument(this.classService.DbCollection, id);
      console.log("\nDeleted class: " + _class.id);
    }
    console.log(this.deleteLog);
  }

  private async deleteSubjectHandler(classId: string | null, deletedElementType: number) {
    const _subjects = await this.getElementFromParentId<ClassroomSubject>(this.subjectService.DbCollection, classId, "classId");
    if (_subjects == null) return;

    for (let subjectIndex = 0; subjectIndex < _subjects.length; subjectIndex++) {
      if ((deletedElementType) <= this.lessonNodeType) {
        await this.deleteLessonHandler(_subjects[subjectIndex].id, deletedElementType);

        // < delete subject >
        await this.deleteDocument(this.subjectService.DbCollection, _subjects[subjectIndex].id);
        console.log("\nDeleted subject: " + _subjects[subjectIndex].id);
      }
    }
  }
  private async deleteLessonHandler(subjectId: string | null, deletedElementType: number) {
    const _lessons = await this.getElementFromParentId<ClassroomLesson>(this.lessonService.DbCollection, subjectId, "subjectId");
    if (_lessons == null) return;

    for (let lessonIndex = 0; lessonIndex < _lessons.length; lessonIndex++) {


      if ((deletedElementType) <= this.contentNodeType) {
        // delete content
        await this.deleteContentHandler(_lessons[lessonIndex].id);


        // < delete lesson >
        await this.deleteDocument(this.lessonService.DbCollection, _lessons[lessonIndex].id);
        console.log("\nDeleted lesson: " + _lessons[lessonIndex].id);
      }
    }
  }
  private async deleteContentHandler(lessonId: string | null) {
    const _content = await this.getElementFromParentId<LessonContent>(this.contentService.DbCollection, lessonId, "lessonId");
    console.log("deleting", _content);
    if (_content == null) return;
    console.log("found content:", _content);
    for (let contentIndex = 0; contentIndex < _content.length; contentIndex++) {
      // < delete content >
      await this.deleteCloudStorageItem(_content[contentIndex].ref);
      await this.deleteDocument(this.contentService.DbCollection, _content[contentIndex].id);
      console.log("\nDeleted content: " + _content[contentIndex].id);
    }
  }

  public async deleteCloudStorageItem(_ref: string | null) {
    // const storage = getStorage(this.firebaseApp, "gs://learningtimevr-uploads")
    if (_ref == null) return;
    const stg = getStorage(this.firebaseApp, "gs://learningtimevr-uploads");
    const filesRef = ref(stg, _ref);
    console.log("deleting at ref", filesRef)

    return await deleteObject(filesRef).catch(err => { console.log("caught error:", err); return false; }).then(a => { return true; });

  }

  public async deleteDocument(collection: string | null, id: string | null) {
    if (id == null) return;
    if (collection == null) return;
    console.log("delete", collection, id);
    return await this.fs.firestore.collection(collection).doc(id).delete().then((result) => {
      return result;
    }).catch(err => { console.error("failed to delete document", err); });
  }

  private async getOrganizationById(id: string): Promise<Organization> {

    const docRef = this.fs.firestore.collection<Organization>(this.organizationService.DbCollection);

    let cDoc: Organization;

    return await docRef.doc(id).ref.get().then(async function (doc) {
      const _class: Organization = doc.data() as Organization;
      _class.id = doc.id;
      cDoc = _class;
      return cDoc;
    });

  }
  private async getSchoolById(id: string): Promise<School> {

    const docRef = this.fs.firestore.collection<School>(this.classService.DbCollection);
    let cDoc: School;

    return await docRef.doc(id).ref.get().then(async function (doc) {
      const _element: School = doc.data() as School;
      _element.id = doc.id;
      cDoc = _element;
      return cDoc;
    });

  }
  private async getClassLibraryById(id: string): Promise<ClassroomLibrary> {

    const docRef = this.fs.firestore.collection<ClassroomLibrary>(this.classLibraryService.DbCollection);
    let cDoc: ClassroomLibrary;

    return await docRef.doc(id).ref.get().then(async function (doc) {
      const _class: ClassroomLibrary = doc.data() as ClassroomLibrary;
      _class.id = doc.id;
      cDoc = _class;
      return cDoc;
    });

  }

  private async getClassById(id: string): Promise<Classroom> {

    const docRef = this.fs.firestore.collection(this.classService.DbCollection);
    let cDoc: Classroom;

    return await docRef.doc(id).ref.get().then(async function (doc) {
      const _class: Classroom = doc.data() as Classroom;
      _class.id = doc.id;
      cDoc = _class;
      return cDoc;
    });

  }
  private async getElementFromParentId<T>(collection: string, id: string | null, idField: string) {
    if (id == null) { console.log("invalid id."); return null; }

    const collectionRef = this.fs.firestore.collection<T>(collection);
    let elements = await collectionRef.ref.where(idField, "==", id).get().then((result) => {
      return result;
    });

    const _collection: T[] = elements.docs.map(doc => { let s = { ...doc.data(), id: doc.id }; return s; });
    console.log("Got collection:", _collection);
    return _collection;
  }
}
