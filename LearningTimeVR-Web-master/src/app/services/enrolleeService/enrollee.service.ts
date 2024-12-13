import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Classroom } from 'app/models/Interfaces/Classroom';
import { Enrollment, user } from 'app/models/Interfaces/Enrollment';
import { FirestoreService } from 'app/services/firebase/firestore.service';
import { UserService, userTypes } from 'app/services/firebase/user.service';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { GlobalService } from '../globalService/global.service';

@Injectable({
  providedIn: 'root'
})
export class EnrolleeService {

  // Name of the collection being queried in db storage.
  public DbCollection = `master/${this.global.outputCollection}/ClassroomEnrollment`;
  fsRef = collection(this.firestore.firestore, this.DbCollection);

  constructor(
    private firestore:AngularFirestore,
    private fs:FirestoreService,
    private userService:UserService, 
    private global:GlobalService, 
  ) { }

  public getStudentsByOrgId(organizationIds: string[]) {
    return this.userService.getUsersByUserType(organizationIds, userTypes.Student);
  }

  enrollmentCollection: Enrollment[] = [];
  public async getStudentsByClassroomId(organizationIds: string[], classroomId: string) {
    const q = query(this.fsRef,
      where('organizationId', 'in', organizationIds),
      where('classroom.id', '==', classroomId),
      orderBy('user.lastName')
    );
    
    try {
      const querySnapshot = (await getDocs(q));
      
      if (!querySnapshot.empty) {
        querySnapshot.docs.map(doc => {
        const _data = {...doc.data()} as Enrollment;
        this.enrollmentCollection.push(_data);
      })
    }}
    catch(ex) {
      throw(ex);
    }
    return this.enrollmentCollection;
  }

  public async getClassroomEnrollment(organizationIds: string[], classroomId: string, userId: string) {
    const q = query(this.fsRef,
      where('organizationId', 'in', organizationIds),
      where('classroom.id', '==', classroomId),
      where('user.id', '==', userId),
    );
    
    let _enrollmentCollection: Enrollment[] = [];

    try {
      const querySnapshot = (await getDocs(q));
      
      if (!querySnapshot.empty) {
        querySnapshot.docs.map(doc => {
        const _data = {id: doc.id, ...doc.data()} as Enrollment;
        _enrollmentCollection.push(_data);
      })
    }}
    catch(ex) {
      throw(ex);
    }
    return _enrollmentCollection;
  }

  public async deleteEnrolleeFromClassroom(organizationIds: string[], classroomId: string, userId: string) {
    await this.getClassroomEnrollment(organizationIds, classroomId, userId).then((result)=>{
      result.forEach((doc) => {
        if (doc.id) {
          this.fs.firestore.collection(this.DbCollection).doc(doc.id).delete();
        }
      })
    })
  }

  public async addEnrolleeToClassroom(organizationId: string, classroom: Classroom, userToEnroll: user) {
    if (!organizationId
      || !classroom || !classroom.id
      || !userToEnroll || !userToEnroll.id) {
      return;
    }

    const dateCreated = Date.now().toString();
    const enrollment: Enrollment = {
      user: userToEnroll,
      organizationId: organizationId,
      classroom: classroom,
      dateCreated: dateCreated,
      dateUpdated: dateCreated
    } as Enrollment;
    
    await this.fs.firestore.collection(this.DbCollection).add(enrollment).then(function (docRef) {
      enrollment.id = docRef.id;
    })

    return enrollment;
  }

  // public getStudentsBySearchTerm(organizationId: string, searchTerm: string = '') {
  //   throw error('Not yet implemented.');
  // }

  public async getClassroomsByEnrolleeId(organizationIds: string, userId: string) {
    const q = query(this.fsRef,
      where('organizationId', '==', organizationIds),
      where('user.id', '==', userId),
    );
    
    let _enrollmentCollection: Enrollment[] = [];

    try {
      const querySnapshot = (await getDocs(q));
      
      if (!querySnapshot.empty) {
        querySnapshot.docs.map(doc => {
        const _data = {id: doc.id, ...doc.data()} as Enrollment;
        _enrollmentCollection.push(_data);
      })
    }}
    catch(ex) {
      throw(ex);
    }
    return _enrollmentCollection;
  }
}
