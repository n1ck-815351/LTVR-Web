import { Classroom } from "../Classroom";
import { LessonContent } from "../LessonContent";
import { ClassroomLesson } from "../ClassroomLesson";
import { ClassroomSubject } from "../ClassroomSubject";

export interface ContentEvent {
    
    class:Classroom;
    lessonModuleIndex:number;
    contentClusterIndex:number;
    content:LessonContent;
}
