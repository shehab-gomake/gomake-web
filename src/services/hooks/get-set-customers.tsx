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


///  instead this i used getAndSetAllCustomers an return _data.totalItems;
const getCustomerCount = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/customers/get-all-customers", data);
  const _data = returnResult(result, undefined);
  return _data.totalItems;
};

    
const getAndSetAllCustomers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/customers/get-all-customers", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.data.map((customer: any) => {
    return {
      customerCode: customer.code,
      name: customer.name,
      email: customer.mail ? customer.mail : <HorizontalRuleIcon/>,
      phone: customer.phone ? customer.phone : <HorizontalRuleIcon/>,
      status: customer.isActive ? "Active" : "Inactive",
      hashTag: (
        <div style={{ display: "flex", justifyContent: 'flex-end', alignItems: "center" }} >
          <a>
            <ShowCustomerCard item={customer} clientType={data.clientType} />
          </a>
        </div>
      ),
    };
  });
  if (setState) {
    setState(mapData);
  }
  return _data.totalItems;
};

export {
  getAndSetCustomers,
  getAndSetCustomer,
  getAndSetAllCustomers,
};
