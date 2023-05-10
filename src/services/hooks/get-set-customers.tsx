import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';


// need to change the endpoints of all the http request

const getAndSetCustomers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/suppliers/get-suppliers",
    data
  );
  return returnResult(result, setState);
};


// not final
const getAndSetAllCustomers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/customers/get-all-customers", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((customer: any) => {
    return {
      customerCode: customer.code,
      name: customer.name,
      email: customer.mail,
      phone: customer.phone,
      status: customer.isActive,
      hashTag: (
        <BusinessCenterIcon />
      ),
    };
  });
  if (setState) {
    setState(mapData);
  }
  return _data;
};

export {
  getAndSetCustomers,
  getAndSetAllCustomers,
};
