import { Classroom } from "../Classroom";
import { ClassroomLesson } from "../ClassroomLesson";
import { ClassroomSubject } from "../ClassroomSubject";

export interface ContentClusterEvent {
    class:Classroom;
    lessonModule:ClassroomSubject;
    lessonModuleIndex:number;
    contentCluster:ClassroomLesson;
}
