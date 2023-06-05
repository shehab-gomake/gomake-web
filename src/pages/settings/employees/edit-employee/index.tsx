import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks";
import { useTranslation } from "react-i18next";
import { EmployeeCardWidget } from "../employee-widget";
import { getAndSetEmployee } from "@/services/hooks";

const ShowEmployeeCard = ({ item }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [employee, setEmployee] = useState(null);
  const [open, setOpen] = useState(false);

  const getEmployee = useCallback(async () => {
    const data = await getAndSetEmployee(callApi, setEmployee, {
      employeeId: item.id ,
    });
    return data;
  }, [item]);

  useEffect(() => {
    getEmployee();
  }, [item]);
  
  
  return (
    <>
      <IconButton>
        <EditIcon onClick={()=>setOpen(!open)}  ></EditIcon>
      </IconButton>
      {employee && <EmployeeCardWidget  openModal={open} modalTitle={ t("employees.modal.editTitle")} onClose={() => setOpen(false)} employee={employee} showUpdateButton={true}></EmployeeCardWidget>}
    </>
  );
};
export { ShowEmployeeCard };

