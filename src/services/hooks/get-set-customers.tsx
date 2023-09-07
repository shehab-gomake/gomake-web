import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";
import { ShowCustomerCard } from "@/pages/customers/edit-customer";
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

const getAndSetCustomers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/customers/get-customers",
    data
  );
  return returnResult(result, setState);
};

const getAndSetCustomer = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/customers/get-customer",
    data
  );
  return returnResult(result, setState);
};

//helper function
const customerMapFunction = (customer , onClick) => {
  return {
    customerCode: customer.code,
    name: customer.name,
    email: customer.mail ? customer.mail : <HorizontalRuleIcon/>,
    phone: customer.phone ? customer.phone : <HorizontalRuleIcon/>,
    status: customer.isActive ? "Active" : "Inactive",
    hashTag: (
      <div style={{ display: "flex", justifyContent: 'flex-end', alignItems: "center" }} >
        <a>
          <ShowCustomerCard onClick={onClick} item={customer} clientType={customer.clientType} />
        </a>
      </div>
    ),
  };
}
    
const getAndSetAllCustomers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any,
  onClick?:any,
) => {
  const result: any = await callApi("GET", "/v1/customers/get-all-customers", data);
  const _data = returnResult(result, undefined);

  const mapData = _data.data.map((customer: any) => customerMapFunction(customer , onClick));
  if (setState) {
    setState(mapData);
  }
  return _data.totalItems;
};

export {
  getAndSetCustomers,
  getAndSetCustomer,
  getAndSetAllCustomers,
  customerMapFunction
};
