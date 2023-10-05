import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";
import { SMSTemplateGroup } from "@/widgets/settings-mailing/messageTemplates/interfaces/interface";
const GET_ALL_TEMPLATES_URL = '';
const ADD_NEW_SMS_TEMPLATE_GROUP_URL = '/v1/crm-service/sms-templates-groups/add-SMSTemplatesGroup';

const getAllTemplatesApi: ICallAndSetData = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_TEMPLATES_URL, setState)
}

const addNewSmsTemplateGroup: ICallAndSetData = async (callApi, setState, templateGroup: SMSTemplateGroup) => {
    return await getSetApiData(callApi, EHttpMethod.POST, ADD_NEW_SMS_TEMPLATE_GROUP_URL, setState, templateGroup);
}

export {getAllTemplatesApi , addNewSmsTemplateGroup};