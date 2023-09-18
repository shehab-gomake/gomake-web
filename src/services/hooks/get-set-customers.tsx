import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { FONT_FAMILY } from "@/utils/font-family";
import { MoreMenuWidget } from "@/widgets/customer-card-modal/more-circle";
import { useTranslation } from "react-i18next";

//get by id
const getAndSetCustomerById = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/customers/get-customer", data);
  return returnResult(result, setState);
};

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
  const mapData = _data.data.map((customer: any) =>
    customerMapFunction(customer, onClick, onClickStatus , activeText , inActiveText)
  );
  if (setState) {
    setState(mapData);
  }
  return _data.totalItems;
};

export {
  getAndSetCustomerById,
  getAndSetCustomersPagination,
  customerMapFunction,
};
