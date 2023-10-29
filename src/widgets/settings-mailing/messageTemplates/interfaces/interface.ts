import { SMSTemplatesEnum } from "../enums/enum";

export interface SMSTemplateGroup {
    id?: string;
    name: string;
}

export interface ISMSTemplate {
    id? : string,
    title: string,
    text: string,
    smsTemplatesGroupId: string,
    templateTypeId: SMSTemplatesEnum,
    templateType: string,
    attachment: string,
    sendFromAgent: boolean,
    mailReturnToAgent: boolean,
    sendFrom: string,
    emailPassword: string,
    sendMailCopy: boolean,
    sendMailCopyToAgent: boolean,
    bccMail: string,
}

