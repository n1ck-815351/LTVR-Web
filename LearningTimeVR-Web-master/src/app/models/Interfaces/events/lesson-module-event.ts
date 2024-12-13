import { Classroom } from "../Classroom";
import { ClassroomSubject } from "../ClassroomSubject";

export interface LessonModuleEvent {
    class:Classroom;
    lessonModule:ClassroomSubject;
}
