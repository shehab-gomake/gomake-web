import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";
import { ShowCustomerCard } from "@/pages/customers/edit-customer";


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
      email: customer.mail ? customer.mail : "----",
      phone: customer.phone,
      status: customer.isActive ? "Active" : "Inactive",
      hashTag: (
        <div style={{ display: "flex", justifyContent: 'flex-end', alignItems: "center" }} >
          <a>
            <ShowCustomerCard item={customer} />
          </a>
        </div>
      ),
    };
  });
  if (setState) {
    setState(mapData);
  }
  return _data;
};

export {
  getAndSetCustomer,
  getAndSetAllCustomers,
};
