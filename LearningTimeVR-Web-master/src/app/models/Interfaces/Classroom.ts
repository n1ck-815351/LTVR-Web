import { Reference } from "@angular/fire/compat/firestore";
import { Enrollee } from './userTypes/Enrollee';
import { Educator } from "./userTypes/Educator";
import { metadata_location } from "./metadata/metadata_location";
import { metadata_sprite } from "./metadata/metadata_sprite";
import { ClassroomSubject } from "./ClassroomSubject";

export interface Classroom {
    
    id: string | null;
    classLibraryId: string | null;
    title: string | null;
    searchTerm: string | null;
    description: string | null;
    lessonModules: ClassroomSubject[]|null;
    
    students: Reference<Enrollee>[] | null;
    teachers: Reference<Educator>[] | null;
    
    tags:string;
    previewSprites: Reference<metadata_sprite>[] | null;
    header: string | null;
    locationID: metadata_location | null;
    createdBy: string | null;
    dateCreated: string | null;
    dateVisited: string | null;
    lastUpdatedBy: string | null;
    dateUpdated: string | null;
    organizationId: string | null;
    schoolId: string | null;
    author: string | null;
    uid: string | null;
    jsonRepresentation: string;

    // Only utilized for testing modules.
    subjects: ClassroomSubject[];
}