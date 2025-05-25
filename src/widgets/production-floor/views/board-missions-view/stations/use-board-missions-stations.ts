import router, { useRouter } from "next/router";
import { getBoardsMissionsStations } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios } from "@/hooks";
import { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import {
  abortControllerStationState,
  boardMissionsStationsState,
  boardMissionsSubWorkFlowsState,
  isOrderCompletedState,
  isReadyBoardMissionsState,
  productionFloorSectionsState,
  productWorksTypesState,
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
  const [, setRelatedOrderItems] = useRecoilState(
    relatedOrderItemsComponentState
  );

  const [subWorkFlows, setSubWorkFlows] = useRecoilState(
    boardMissionsSubWorkFlowsState
  );
  const [, setIsReady] = useRecoilState(isReadyBoardMissionsState);
  const [boardMissions] = useRecoilState(boardMissionsDetailsState);
  const initStations = useResetRecoilState(boardMissionsStationsState);
  const [, setIsOrderCompleted] = useRecoilState(isOrderCompletedState);
  const initProductionInformation = useResetRecoilState(
    stationGeneralInformationProductionFloorState
  );
  const initGeneralInformation = useResetRecoilState(
    stationGeneralInformationState
  );

  const [productDetails, setProductDetails] = useRecoilState(
    productionFloorSectionsState
  );
  const [productWorksTypes, setProductWorksTypes] = useRecoilState(
    productWorksTypesState
  );

  const resetProductDetails = useResetRecoilState(productionFloorSectionsState);
  const [abortControllerStation, setAbortControllerStation] = useRecoilState(abortControllerStationState);
  const getStations = async () => {
    if (abortControllerStation) {
      abortControllerStation.abort();
    }
    const newRequestAbortController = new AbortController();
    setAbortControllerStation(newRequestAbortController);
    initGeneralInformation();
    initProductionInformation();
    const callBack = (res) => {
      if (res?.success) {
       if (res.data?.boardMissionId !== query.boardMissionsId) {
          return;
        }
        setStations(res?.data?.workFlow?.actions);
        setSubWorkFlows(res?.data?.workFlow?.subWorkFlows);
        setInformation(res?.data?.generalInformations);
        setInformationProductionFloor(
          res?.data?.generalInformationProductionFloor
        );
        setRelatedOrderItems(res?.data?.relatedOrderItems);
        setIsReady(res?.data?.isReady);
        setIsOrderCompleted(res?.data?.isOrderCompleted);
        setProductDetails(res?.data?.productionFlooeSections);
        setProductWorksTypes(res?.data?.workTypes);
      }
    };
    await getBoardsMissionsStations(callApi, callBack, {
      boardMissionsId: boardMissionsId,
      productType: productType ? productType : "",
    },
      false,
      newRequestAbortController
    );
  };

  const onClickAllJob = () => {
    replace(
      { pathname: pathname, query: { ...query, productType: "" } },
      undefined,
      { shallow: true }
    ).then();
  };

  useEffect(() => {
    if(!router.isReady){
      return;
    }
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
    productDetails,
    resetProductDetails,
    productWorksTypes,
  };
};

export { useBoardMissionsStations };
