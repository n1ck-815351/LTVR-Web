import { Classroom } from "../Classroom";

export interface BaseUser {
    uid: string | null;
    pin: string | null;
    administrator: boolean | null;
    userType: number | null;
    organizationId: string | null;
    schoolId: string | null;
    phoneNumber: string | null;
    recentlyVisitedClasses: Classroom[] | null;

    displayName: string | null;
    title: string | null;
    firstName: string | null;
    lastName: string | null;
    profilePhotoUrl: string | null;
    avatarDataUrl: string | null;
    rpmAvatarPreviewUrl: string | null;

    // firebase user handled by firebase auth
}
