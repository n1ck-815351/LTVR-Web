import { ClassroomLesson } from "./ClassroomLesson";
import { metadata_location } from "./metadata/metadata_location";
import { metadata_sprite } from "./metadata/metadata_sprite";

export interface ClassroomSubject {
    id:string|null;
    classId:string|null;
    title: string | null;
    description: string | null;
    
    contentClusters: ClassroomLesson[] | null;
    
    // meta data
    creatorName: string | null;
    dateCreated: string | null;
    dateUpdated: string | null;
    header: string | null;
    tags: string | null;
    startingLocation: metadata_location | null;
    previewSprite: metadata_sprite | null;
    devDescription: string | null;

    // Only utilized for testing modules.
    lessons: ClassroomLesson[];
}