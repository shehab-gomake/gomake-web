import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useGomakeAxios } from "./use-gomake-axios";
import { getPrintHouseActions } from "@/services/api-service/production-floor/production-floor-endpoints";
import { actionsListState } from "@/widgets/production-floor/state/actions-list";

const usePrintHouseActionsList = () => {
  const { callApi } = useGomakeAxios();
  const [actions, setActions] = useRecoilState(actionsListState);

  const getActions = async () => {
    const callBack = (res) => {
      if (res.success) {
        setActions(res?.data);
      }
    };
    await getPrintHouseActions(callApi, callBack, {
      isFromEmployeeForm: true,
      isFromDashboard: false,
    });
  };

  useEffect(() => {
    getActions();
  }, []);

  return {
    actions,
    setActions,
    getActions,
  };
};

export { usePrintHouseActionsList };
