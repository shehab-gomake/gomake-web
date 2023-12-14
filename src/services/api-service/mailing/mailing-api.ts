import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";
import { SMSTemplateGroup } from "@/widgets/settings-mailing/messageTemplates/interfaces/interface";


////////////////////////////////////// new /////////////////////////////////////
const GET_ALL_SMS_TEMPLATES_URL = '/v1/communication-service/sms-templates/get-all-smsTemplates';
const GET_SMS_TEMPLATE_BY_ID_URL = '/v1/communication-service/sms-templates/get-smsTemplate-by-id';
const UPDATE_SMS_TEMPLATE_URL = '/v1/communication-service/sms-templates/update-smsTemplate';
const ADD_SMS_TEMPLATES_GROUP_URL = '/v1/communication-service/sms-templates-groups/add-smsTemplates-group';
const GET_ALL_SMS_TEMPLATES_GROUPS_URL = '/v1/communication-service/sms-templates-groups/get-all-smsTemplates-groups';
const GET_ALL_TEMPLATE_VARIABLES_URL = '/v1/communication-service/template-variables/get-all-template-variables';
const GET_ALL_TEMPLATE_TYPES_URL = '/v1/enum/get-enums/SMSTemplate';


const getAllSMSTemplatesApi: ICallAndSetData<any, any> = async (callApi, setState, data) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.GET, GET_ALL_SMS_TEMPLATES_URL , setState , data)
}

//get by id 
const getSMSTemplateApi: ICallAndSetData<any, any> = async (callApi, setState , data: { id: string, lang : string}) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.GET, GET_SMS_TEMPLATE_BY_ID_URL , setState , data)
}

const updateSMSTemplateApi: ICallAndSetData<any, any> = async (callApi, setState, SmsTemplate) => {
    return await getSetApiData<any>(callApi, EHttpMethod.PUT, UPDATE_SMS_TEMPLATE_URL, setState, SmsTemplate);
}

const addSMSTemplateGroup: ICallAndSetData<any, any> = async (callApi, setState, templateGroup: SMSTemplateGroup) => {
    return await getSetApiData<any>(callApi, EHttpMethod.POST, ADD_SMS_TEMPLATES_GROUP_URL, setState, templateGroup);
}

const getAllSMSTemplatesGroupsApi: ICallAndSetData<any, any> = async (callApi, setState) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.GET, GET_ALL_SMS_TEMPLATES_GROUPS_URL, setState)
}

const getAllTemplateVariablesApi: ICallAndSetData<any, any> = async (callApi, setState) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.GET, GET_ALL_TEMPLATE_VARIABLES_URL, setState)
}

const getAllTemplateTypesApi: ICallAndSetData<any, any> = async (callApi, setState) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.GET, GET_ALL_TEMPLATE_TYPES_URL, setState)
}

export { updateSMSTemplateApi , getAllSMSTemplatesApi , addSMSTemplateGroup  , getAllSMSTemplatesGroupsApi , getAllTemplateVariablesApi , getAllTemplateTypesApi , getSMSTemplateApi};