import { LessonContent } from "app/models/Interfaces/LessonContent";

export interface UploadRequestTemplate {
    id:string;
    fileName:string;
    file:any;
    fullPath:any;
    contentData:LessonContent;
    lessonId:string;
    DbCollection:string;
    uploading:boolean;
    uploadComplete:boolean;
}
