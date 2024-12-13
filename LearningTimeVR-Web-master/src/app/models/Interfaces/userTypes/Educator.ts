import { BaseUser } from "./BaseUser";

export interface Educator {
    id:string|null;
    baseUser: BaseUser;
    classes: string[] | null;
}