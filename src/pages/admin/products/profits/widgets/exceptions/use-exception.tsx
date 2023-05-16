import { useGomakeAxios } from "@/hooks";
import {
  clientTypesState,
  machincesState,
  parametersState,
  productsState,
} from "@/store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

const useExceptions = ({ tableRows }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const machincesStateValue = useRecoilValue<any>(machincesState);
  const productsStateValue = useRecoilValue<any>(productsState);
  const parametersStateValue = useRecoilValue<any>(parametersState);
  const clientTypesStateValue = useRecoilValue<any>(clientTypesState);

  const [state, setState] = useState<any>({});
  const onChangeState = (key: any, value: any) => {
    setState((prevState: any) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  };
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
    state,
    istimeOut,
    _tableRows,
    machincesStateValue,
    productsStateValue,
    parametersStateValue,
    clientTypesStateValue,
    onChangeState,
    setState,
    t,
  };
};

export { useExceptions };
