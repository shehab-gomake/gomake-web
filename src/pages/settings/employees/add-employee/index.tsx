import {  useState } from "react";
import { GomakePrimaryButton } from "@/components";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { useTranslation } from "react-i18next";
import { EmployeeCardWidget } from "../employee-widget";

const AddEmployeeButton = ({ item }: any) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [employee, setEmployee] = useState(null);


  return (
    <>
   <EmployeeCardWidget openModal={open} modalTitle={t("employees.modal.addTitle")} onClose={()=>setOpen(false)} employee={employee} setEmployee={setEmployee} flagAddButton={true}>
       </EmployeeCardWidget>
       <GomakePrimaryButton variant="contained" onClick={()=>setOpen(!open)} style={{width: convertWidthToVW(100),height: convertHeightToVH(50),marginRight: convertWidthToVW(10),backgroundColor: "#F135A3",}}>{t("employees.buttons.addEmployeee")}</GomakePrimaryButton>
       </>
  );
};
export { AddEmployeeButton };

