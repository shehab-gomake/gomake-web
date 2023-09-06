import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { ShowEmployeeCard } from "@/pages/settings/employees/edit-employee";
import { DeactivateEmployee } from "@/pages/settings/employees/hide-employee";


// for select options
const getAndSetEmployees = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/employee/get-employees", data);
  return returnResult(result, setState);
};


// for employee card
const getAndSetEmployee = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/employee/get-employee", data);
  return returnResult(result, setState);
};


// for data table
const getAndSetAllEmployees = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/employees/get-all-employees", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((employee: any) => {
    const formattedCreationDate = new Date(employee.creationDate).toLocaleDateString();
    return {
      name: employee.firstname + ' ' + employee.lastname,
      phone: employee.phone,
      email: employee.email,
      creationDate: formattedCreationDate,
      role: <HorizontalRuleIcon/> ,
      hashTag: (
        <div style={{ display: "flex", justifyContent: 'flex-end', alignItems: "center" }} >
          <a>
          <ShowEmployeeCard item={employee}/>
          <DeactivateEmployee item={employee}/>
          </a>
        </div>
      ), };
  });
  if (setState) {
    setState(mapData);
  }
  return _data;
};

export { getAndSetEmployees , getAndSetAllEmployees , getAndSetEmployee };