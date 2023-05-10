import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useRecoilState } from "recoil";
import { actionLists } from "@/store";
import { useCallback, useEffect, useState } from "react";
import { getAndSetActions } from "@/services/hooks";

const useProfits = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [allActions, setAllActions] = useRecoilState(actionLists);
  const [selectedAction, setSelectedAction] = useState({});
  const getActions = useCallback(async () => {
    await getAndSetActions(callApi, setAllActions);
  }, []);
  const onChangeSelectedAction = useCallback(async (e: any, value: any) => {
    setSelectedAction(value);
  }, []);
  useEffect(() => {
    getActions();
  }, []);

  return {
    allActions,
    selectedAction,
    onChangeSelectedAction,
    t,
  };
};

export { useProfits };
