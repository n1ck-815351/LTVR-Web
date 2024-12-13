import { BaseUser } from "./BaseUser";

export interface Owner {
    id: string | null;
    baseUser: BaseUser;
}
