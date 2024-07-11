import { useEffect, useState } from "react";
import { useGomakeAxios } from "./use-gomake-axios";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";

const useEmployeeList = () => {
  const { callApi } = useGomakeAxios();
  const [employeesCategories, setEmployeesCategories] = useState<[]>();
  const [employee, setEmployee] = useState<{ label: string; id: string } | null>();
  const handleEmployeeChange = (e: any, value: any) => {
    setEmployee(value);
  };

  const getEmployeeCategories = async () => {
    const callBack = (res) => {
      if (res.success) {
        const employeeNames = res.data.map((employee) => ({
          label: employee.text,
          id: employee.value,
        }));
        setEmployeesCategories(employeeNames);
      }
    };
    await getAndSetEmployees2(callApi, callBack, { isEmployee: null });
  };

  useEffect(() => {
    getEmployeeCategories();
  }, []);

  return {
    employee,
    setEmployee,
    employeesCategories,
    handleEmployeeChange,
    getEmployeeCategories
  };
};

export { useEmployeeList };
