export interface AllowedIP {
    ip: string;
    isActive: boolean;
    description: string;
}

export interface Employee {
    id?: string;
    agentCode: string | null;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    isActive: boolean;
    isWorkingOnCommonBoard: boolean | null;
    isHaveFullKanbanPermission: boolean;
    pinCode: string | null;
    isAgent: boolean;
    isGraphicArtist: boolean | null;
    isCourier: boolean | null;
    mailService: string;
    mailServicePassword: string;
    creationDate: Date;
    printHouseId?: string;
    mailProviderId: string | null;
    smsTemplatesGroupId: string | null;
    quoteLimitationType: string | null;
    quotePriceLimit: number | null;
    mailProvider: string | null;
    pinCodeForLoginWithApplication: string | null;
    actionIds:string[] | null
}

export interface IUserData {
    id?: string;
    username: string;
    password: string;
    roleID: string;
    isCanLoginWithCode: boolean;
    allowedIPs: AllowedIP[];
    employee: Employee;
    email: string;
}