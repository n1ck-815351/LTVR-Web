import { Classroom } from "./Classroom";

export class Enrollment {
    id: string | null;
    classroom: Classroom | null;
    organizationId: string | null;
    user: user;
    dateCreated: string;
    dateUpdated: string;
}

export class user {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    displayName: string | null;
}