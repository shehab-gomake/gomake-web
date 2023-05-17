import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  actionProfitLists,
  clientTypesState,
  machincesState,
  parametersState,
  productsState,
} from "@/store";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { profitsState } from "../../store/profits";

const useExceptions = ({ tableRows }: any) => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const profitsStateValue = useRecoilValue<any>(profitsState);
  const machincesStateValue = useRecoilValue<any>(machincesState);
  const productsStateValue = useRecoilValue<any>(productsState);
  const parametersStateValue = useRecoilValue<any>(parametersState);
  const clientTypesStateValue = useRecoilValue<any>(clientTypesState);
  const actionProfits = useRecoilValue<any>(actionProfitLists);
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

  const addedNewException = useCallback(async () => {
    let newState = { ...state };
    delete newState?.priceListParameter;
    delete newState?.typeOfException;
    delete newState?.machine;
    delete newState?.subProduct;
    delete newState?.clientType;

    const res = await callApi(
      "POST",
      `/v1/printhouse-config/profits/add-exception-profit`,
      {
        actionProfitId: actionProfits?.id,
        ...newState,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      profitsStateValue.onCloseAddExceptionModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [state]);
  return {
    state,
    istimeOut,
    _tableRows,
    machincesStateValue,
    productsStateValue,
    parametersStateValue,
    clientTypesStateValue,
    onChangeState,
    addedNewException,
    setState,
    t,
  };
};

export { useExceptions };
