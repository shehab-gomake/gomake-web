import {
  clientTypesState,
  machincesState,
  parametersState,
  productsState,
} from "@/store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { profitsState } from "../../store/profits";

const useExceptions = ({ tableRows }: any) => {
  const { t } = useTranslation();
  const profitsStateValue = useRecoilValue<any>(profitsState);
  const machincesStateValue = useRecoilValue<any>(machincesState);
  const productsStateValue = useRecoilValue<any>(productsState);
  const parametersStateValue = useRecoilValue<any>(parametersState);
  const clientTypesStateValue = useRecoilValue<any>(clientTypesState);
  const [_tableRows, setTableRows] = useState(tableRows);
  const [istimeOut, setIsTimeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeOut(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    setTableRows(tableRows);
  }, [tableRows]);

  return {
    istimeOut,
    _tableRows,
    machincesStateValue,
    productsStateValue,
    parametersStateValue,
    clientTypesStateValue,
    profitsStateValue,
    t,
  };
};

export { useExceptions };
