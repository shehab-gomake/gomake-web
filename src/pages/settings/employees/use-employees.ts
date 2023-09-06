import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useTranslation } from "react-i18next";
import { getAndSetAllEmployees , getAndSetEmployees } from "@/services/hooks";


const useEmployees = (pageNumber) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [allEmployees, setAllEmployees] = useState([]);
  const [isAgent, setIsAgent] = useState(null);
  const [pagesCount, setPagesCount] = useState(0);
  const pageSize = 10;


  const [name, setName] = useState("");
  const onChangeName = useCallback(async (e: any, value: any) => {
    setName(e.target.value);
  }, []);
  

  const [isActive, setIsActive] = useState(false);
  const onChangStatus = useCallback(async (e: any, value: any) => {
    setIsActive(e.target.checked);
  }, []);


  const tabelHeaders = useMemo(
    () => [
      t("employees.name"),
      t("employees.phone"),
      t("employees.email"),
      t("employees.creationDate"),
      t("employees.role"),
      t("employees.hashtag"),
    ],
    []
  );

  /////////////////////////  number of employees //////////////////////////////
  const getEmployeeNumber = useCallback(async () => {
    const data = await getAndSetEmployees( callApi  );
    setPagesCount(data.length/pageSize);

  }, []);

  useEffect(() => {
    getEmployeeNumber();
  }, []);

  /////////////////////////  table data //////////////////////////////

  const getAllEmployees = useCallback(async () => {
    const data = await getAndSetAllEmployees(callApi, setAllEmployees, {
      pageNumber,
      pageSize,
      name,
      isActive: !isActive,
      isAgent
    });

    return data;
  }, [pageNumber, name, isActive, isAgent]);

  useEffect(() => {
    getAllEmployees();
  }, [pageNumber, name, isActive, isAgent]);

  return {
    tabelHeaders,
    onChangeName,
    onChangStatus,
    isActive,
    allEmployees,
    getAllEmployees,
    pagesCount,
};
};
export { useEmployees };
