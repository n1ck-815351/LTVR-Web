import { Injectable } from '@angular/core';
import { ContentService } from '../contentService/content.service';
import { LessonService } from '../lessonService/lesson.service';
import { SubjectService } from '../subjectService/subject.service';
import { ClassroomService } from '../classroomService/classroom.service';
import { FirestoreService } from './firestore.service';
import { Classroom } from 'app/models/Interfaces/Classroom';
import { ClassroomSubject } from 'app/models/Interfaces/ClassroomSubject';
import { ClassroomLesson } from 'app/models/Interfaces/ClassroomLesson';
import { LessonContent } from 'app/models/Interfaces/LessonContent';

@Injectable({
  providedIn: 'root'
})
export class EditHelperService {
  constructor(
    private fs: FirestoreService, 
    private classService: ClassroomService, 
    private subjectService: SubjectService, 
    private lessonService: LessonService, 
    private contentService: ContentService
    ) {}
    
  private classNodeTypes: number[] = [0];
  private subjectNodetypes: number[] = [0, 1];
  private lessonNodeTypes: number[] = [0, 1, 2];
  private contentNodeTypes: number[] = [0, 1, 2, 3];
  
  // classes
  
  public async editClassById(id:string|null, element:Classroom){
    if(id == null) return;
    
    await this.editElement(this.classService.DbCollection, id, element);
  }
  
  // subjects

  public async editSubjectById(id: string | null, element:ClassroomSubject) {
    if(id == null) return;
    await this.editElement(this.subjectService.DbCollection, id, element);
  }

  // lessons

  public async editLessonById(id: string | null, element:ClassroomLesson) {
    if(id == null) return;
    await this.editElement(this.lessonService.DbCollection, id, element);
  }

  // content
  public async editContentById(id: string | null, element:LessonContent) {
    if(id == null) return;
    await this.editElement(this.contentService.DbCollection, id, element);
  }
  
  private async editElement(collection:string, id:string|null, element:any){
    if(id == null) return;
    if(element == null) return;
    return await this.fs.firestore.collection(collection).doc(id).update(element).then((result) => {
      return result;
    });
  }
}
