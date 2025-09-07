import { returnResult } from "@/utils/helpers";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { FONT_FAMILY } from "@/utils/font-family";
import { MoreMenuWidget } from "@/widgets/customer-card-modal/more-circle";
import { ICallAndSetData, ICallApi } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ISetState } from "@/services/hooks/call-api.interface";
const GET_CUSTOMER_BY_ID_URL = "/v1/customers/get-customer";
const TOGGLE_CUSTOMER_STATUS_URL =
  "/v1/crm-service/customer/update-customer-status/";
const IMPORT_CLIENT_URL = "/v1/crm-service/customer/import-client";
// const EXPORT_CLIENT_URL = "/v1/crm-service/customer/export-client";
const GET_ALL_SIMILAR_CUSTOMER_URL = "/v1/customers/search-similar-clients";
const GET_CLIENT_CONTACTS_URL = "/v1/crm-service/customer/get-client-contacts";
const GET_CLIENT_BALANCE_URL = "/v1/crm-service/customer/get-client-balance/";
const VALIDATE_ADDRESS_URL =
  "/v1/crm-service/customer/validate-address-with-google";

const importClientApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    IMPORT_CLIENT_URL,
    setState,
    data
  );
};

//get by id
const getAndSetCustomerById: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_CUSTOMER_BY_ID_URL,
    setState,
    data
  );
};

//helper function
const customerMapFunction = (
  customer,
  onClick,
  onClickStatus,
  activeText,
  inActiveText
) => {
  return {
    createDate: customer.createDate?.split("T")[0],
    customerCode: customer.code,
    name: customer.name,
    email: customer.mail ? customer.mail : <HorizontalRuleIcon />,
    phone: customer.phone ? customer.phone : <HorizontalRuleIcon />,
    status: (
      <div>
        {customer?.isActive === false ? (
          <div
            style={{
              display: "inline-flex",
              ...FONT_FAMILY.Lexend(500, 14),
              color: "#D92C2C",
            }}
          >
            {inActiveText}
          </div>
        ) : (
          <div
            style={{
              display: "inline-flex",
              ...FONT_FAMILY.Lexend(500, 14),
              color: "#40CC4E",
            }}
          >
            {activeText}
          </div>
        )}
      </div>
    ),
    hashTag: (
      <MoreMenuWidget
        item={customer}
        onClickEdit={onClick}
        updatedStatus={onClickStatus}
      />
    ),
  };
};

// data table
const getAndSetCustomersPagination = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any,
  onClick?: any,
  onClickStatus?: any,
  activeText?: any,
  inActiveText?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/customers/get-customers-pagination",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.data?.map((customer: any) =>
    customerMapFunction(
      customer,
      onClick,
      onClickStatus,
      activeText,
      inActiveText
    )
  );
  if (setState) {
    setState(mapData);
  }
  return _data.totalItems;
};

const toggleCustomerStatus: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    TOGGLE_CUSTOMER_STATUS_URL,
    setState,
    data
  );
};

const getAllSimilarCustomerApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_ALL_SIMILAR_CUSTOMER_URL,
    setState,
    data
  );
};

const getClientContactsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_CLIENT_CONTACTS_URL,
    setState,
    data
  );
};

const getClientBalanceApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_CLIENT_BALANCE_URL + data,
    setState
  );
};

const validateAddressApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    VALIDATE_ADDRESS_URL,
    setState,
    data
  );
};

export {
  getAndSetCustomerById,
  getAndSetCustomersPagination,
  customerMapFunction,
  toggleCustomerStatus,
  importClientApi,
  getAllSimilarCustomerApi,
  getClientContactsApi,
  getClientBalanceApi,
  validateAddressApi,
};
