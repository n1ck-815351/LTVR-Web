import { LessonContent } from './LessonContent';
import { metadata_location } from './metadata/metadata_location';
import { metadata_sprite } from './metadata/metadata_sprite';

export interface ClassroomLesson {
    id:string|null;
    subjectId:string|null;
    title: string | null;
    description: string | null;
    header: string | null;

    //transitions
    transitionFrom: number | null;
    transitionTo: number | null;

    content: LessonContent[];

    // meta data
    creatorName: string | null;
    tags: string | null;
    startingLocation: metadata_location | null;
    devDescription: string | null;
    previewSprite: metadata_sprite | null;
}