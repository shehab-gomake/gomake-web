import { returnResult } from "@/utils/helpers";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { FONT_FAMILY } from "@/utils/font-family";
import { MoreMenuWidget } from "@/widgets/customer-card-modal/more-circle";
import {ICallAndSetData, ICallApi} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import { ISetState } from "@/services/hooks/call-api.interface";
const GET_CUSTOMER_BY_ID_URL = '/v1/customers/get-customer';
const TOGGLE_CUSTOMER_STATUS_URL = '/v1/crm-service/customer/update-customer-status/';
//const ADD_NEW_CUSTOMER_URL = '/v1/customers/add-customer';
//const UPDATE_CUSTOMER_URL = '';

//get by id
const getAndSetCustomerById: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(callApi, EHttpMethod.GET, GET_CUSTOMER_BY_ID_URL, setState, data); 
}

//helper function
const customerMapFunction = (customer, onClick, onClickStatus , activeText , inActiveText) => {
  return {
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
  activeText? : any,
  inActiveText? :any,
) => {
  const result: any = await callApi(
    "GET",
    "/v1/customers/get-customers-pagination",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.data?.map((customer: any) =>
    customerMapFunction(customer, onClick, onClickStatus , activeText , inActiveText)
  );
  if (setState) {
    setState(mapData);
  }
  return _data.totalItems;
};

const toggleCustomerStatus: ICallAndSetData = async (callApi, setState, data ) => {
  return await getSetApiData(callApi, EHttpMethod.PUT, TOGGLE_CUSTOMER_STATUS_URL , setState , data );
}

// const addNewCustomerTest: ICallAndSetData = async (callApi, setState, data) => {
//   return await getSetApiData(callApi, EHttpMethod.POST, ADD_NEW_CUSTOMER_URL, setState, data);
// }

// const updateCustomer: ICallAndSetData = async (callApi, setState, employee: Employee) => {
//   return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_CUSTOMER_URL, setState, employee);
// }

export {
  getAndSetCustomerById,
  getAndSetCustomersPagination,
  customerMapFunction,
  toggleCustomerStatus
};
