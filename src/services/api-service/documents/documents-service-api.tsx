import { returnResult } from "@/utils/helpers";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { FONT_FAMILY } from "@/utils/font-family";
import { MoreMenuWidget } from "@/widgets/customer-card-modal/more-circle";
import {ICallAndSetData, ICallApi} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import { ISetState } from "@/services/hooks/call-api.interface";
const GET_DOCUMENT_CONTACTS_BY_ID_URL = '/v1/documents-service/get-document-contacts/';

const getDocumentContactsApi: ICallAndSetData = async (callApi, setState, id) => {
  return await getSetApiData(callApi, EHttpMethod.GET, GET_DOCUMENT_CONTACTS_BY_ID_URL + id, setState);
}


export {
  getDocumentContactsApi,
};
