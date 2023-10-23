import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";
import { SMSTemplateGroup } from "@/widgets/settings-mailing/messageTemplates/interfaces/interface";

////////////////////////////////////// old /////////////////////////////////////
const GET_ALL_TEMPLATES_URL = '/v1/crm-service/roles/get-all-mailing';
const ADD_NEW_SMS_TEMPLATE_GROUP_URL = '/v1/crm-service/sms-templates-groups/add-SMSTemplatesGroup';
const GET_ALL_SMS_TEMPLATES_GROUPS_URL = '/v1/crm-service/roles/get-all-sms-templates';

////////////////////////////////////// new /////////////////////////////////////
const GET_ALL_SMS_TEMPLATES_URL = '/v1/communication-service/sms-templates/get-all-smsTemplates';
const GET_SMS_TEMPLATE_BY_ID_URL = '/v1/communication-service/sms-templates/get-smsTemplate-by-id';
const UPDATE_SMS_TEMPLATE_URL = '/v1/communication-service/sms-templates/update-smsTemplate';
const ADD_SMS_TEMPLATES_GROUP_URL = '/v1/communication-service/sms-templates-groups/add-smsTemplates-group';

////////////////////////////////////// old /////////////////////////////////////
const getAllTemplatesApi: ICallAndSetData = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_TEMPLATES_URL, setState)
}

const addNewSmsTemplateGroup: ICallAndSetData = async (callApi, setState, templateGroup: SMSTemplateGroup) => {
    return await getSetApiData(callApi, EHttpMethod.POST, ADD_NEW_SMS_TEMPLATE_GROUP_URL, setState, templateGroup);
}

const getAllGroupTemplatesApi: ICallAndSetData = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_SMS_TEMPLATES_GROUPS_URL, setState)
}

////////////////////////////////////// new /////////////////////////////////////
const getAllSMSTemplatesApi: ICallAndSetData = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_SMS_TEMPLATES_URL, setState)
}

const getSMSTemplateApi: ICallAndSetData = async (callApi, setState,id: string) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_SMS_TEMPLATE_BY_ID_URL + id, setState);
}

const updateSMSTemplateApi: ICallAndSetData = async (callApi, setState, SmsTemplate) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_SMS_TEMPLATE_URL, setState, SmsTemplate);
}

const addSMSTemplateGroup: ICallAndSetData = async (callApi, setState, templateGroup: SMSTemplateGroup) => {
    return await getSetApiData(callApi, EHttpMethod.POST, ADD_SMS_TEMPLATES_GROUP_URL, setState, templateGroup);
}


export {getAllTemplatesApi , addNewSmsTemplateGroup , getAllGroupTemplatesApi , updateSMSTemplateApi};