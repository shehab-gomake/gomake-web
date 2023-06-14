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


  const onClickEditEmployee = useCallback(async () => {
    setOpen(!open);
    await getAndSetEmployee(callApi, setEmployee, {
      employeeId: item.id,
    });
  }, [callApi, item.id, open]);

 
  
  return (
    <>
      <IconButton>
        <EditIcon onClick={onClickEditEmployee}  ></EditIcon>
      </IconButton>
      {employee && <EmployeeCardWidget  openModal={open} modalTitle={ t("employees.modal.editTitle")} onClose={() => setOpen(false)} employee={employee} ></EmployeeCardWidget>}
    </>
  );
};
export { ShowEmployeeCard };

