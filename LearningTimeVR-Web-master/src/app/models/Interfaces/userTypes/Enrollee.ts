import { BaseUser } from "./BaseUser";

export interface Enrollee {
    id:string|null;
    baseUser: BaseUser | null;
    classes: string[] | null;
    parentalControl: boolean | null;
}