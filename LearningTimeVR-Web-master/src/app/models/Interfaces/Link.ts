export interface Link {
    id:string;
    token:string;
    url: string;
    userType:number;
    expirationDate: string;
    organization: string;
    expires:boolean;
    limitUses:boolean;
    school: string;
    invalidated: boolean;
    uses: number;
}