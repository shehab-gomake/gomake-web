import { useRouter } from "next/router";
import { getBoardsMissionsStations } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios } from "@/hooks";
import { useEffect } from "react";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import {
  boardMissionsStationsState,
  boardMissionsSubWorkFlowsState,
  isOrderCompletedState,
  isReadyBoardMissionsState,
  relatedOrderItemsComponentState,
  stationGeneralInformationProductionFloorState,
  stationGeneralInformationState,
} from "@/widgets/production-floor/views/board-missions-view/stations/state";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { useTranslation } from "react-i18next";
import { getOutsourcingSuppliersListApi } from "@/services/api-service/suppliers/suppliers-endpoints";
import { outsourceSuppliersState } from "@/widgets/product-pricing-widget/state";

const useBoardMissionsStations = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const { query, replace, pathname } = useRouter();
  const { boardMissionsId, step, productType } = query;
  const setOutSuppliers = useSetRecoilState(outsourceSuppliersState);
  const [stations, setStations] = useRecoilState(boardMissionsStationsState);
  const [, setInformation] = useRecoilState(stationGeneralInformationState);
  const [, setInformationProductionFloor] = useRecoilState(
    stationGeneralInformationProductionFloorState
  );
  const [, setRelatedOrderItems] = useRecoilState(relatedOrderItemsComponentState);

  const [subWorkFlows, setSubWorkFlows] = useRecoilState(
    boardMissionsSubWorkFlowsState
  );
  const [, setIsReady] = useRecoilState(isReadyBoardMissionsState);
  const [boardMissions] = useRecoilState(boardMissionsDetailsState);
  const initStations = useResetRecoilState(boardMissionsStationsState);
  const [, setIsOrderCompleted] = useRecoilState(isOrderCompletedState);

  const getStations = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setStations(res?.data?.workFlow?.actions);
        setSubWorkFlows(res?.data?.workFlow?.subWorkFlows);
        setInformation(res?.data?.generalInformations);
        setInformationProductionFloor(
          res?.data?.generalInformationProductionFloor
        );
        setRelatedOrderItems(res?.data?.relatedOrderItems);
        setIsReady(res?.data?.isReady);
        setIsOrderCompleted(res?.data?.isOrderCompleted);
      }
    };
    await getBoardsMissionsStations(callApi, callBack, {
      boardMissionsId: boardMissionsId,
      productType: productType ? productType : "",
    });
  };

  const onClickAllJob = () => {
    replace(
      { pathname: pathname, query: { ...query, productType: "" } },
      undefined,
      { shallow: true }
    ).then();
  };

  useEffect(() => {
    if (!!boardMissionsId && step === "stations") {
      getStations().then();
    }
    return () => {
      initStations();
    };
  }, [boardMissionsId, step, productType]);

  const getOutSourcingSuppliers = () => {
    const callBack = (res) => {
      if (res.success) {
        setOutSuppliers(res.data);
      }
    };
    getOutsourcingSuppliersListApi(callApi, callBack, {}).then();
  };
  useEffect(() => {
    getOutSourcingSuppliers();
  }, []);

  return {
    stations,
    setStations,
    subWorkFlows,
    boardMissions,
    onClickAllJob,
    t,
    isRTL,
    getStations,
  };
};

export { useBoardMissionsStations };
