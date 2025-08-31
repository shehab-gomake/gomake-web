import { useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { getAllPrintHouseActions, getAndSetAllCustomers } from "@/services/hooks";
import { actionLists } from "@/store";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { ETypeException } from "../../enums/profites-enum";

interface EAction {
  id: string;
  actionId: string;
  name: string;
  isInternal: boolean;
  isOutsource: boolean;
  isActive: boolean;
  index: number | null; // index can be a number or null
}
const useCopyAction = ({ getAllActionProfitRowsByActionId,selectedPricingTableItems,getProfitsPricingTables }) => {

  const router = useRouter();
  const { callApi } = useGomakeAxios();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCationId, setSelectedActionId] = useState<EAction>();
  const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();

  const [selectedSupplier, setSelectedSupplier] = useState(null)

  const handleMoreOptionIconClick = (event) => {
    getActions();
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const onCloseModal = () => {
    setOpenModal(false);
  };
  const onOpenModal = () => {
    setOpenModal(true);
  };

  const CopyActionProfitsToOtherActionApi = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/printhouse-config/profits/copy-action-profits-to-other-action`,
      {
        sourceActionId: selectedCationId?.actionId,
        destinationActionId: router.query.actionId,
        isOutSource: router.query.isOutSource ? true : false,
      }
    );
    if (res?.success) {
      onCloseModal();
    } else {
      // Handle error response here
    }
  }, [router, selectedCationId]);

  const [allActions, setAllActions] = useRecoilState(actionLists);
  const getActions = useCallback(async () => {
    await getAllPrintHouseActions(callApi, setAllActions);
  }, []);

  const [percentageProfit, setPercentageProfit] = useState("");
  const [openProfitModal, setOpenProfitModal] = useState(false);
  const onCloseProfitModal = () => {
    setOpenProfitModal(false);
    setPercentageProfit("");
  };
  const onOpenProfitModal = () => {
    setOpenProfitModal(true);
  };

  const AddNewProfitForActionProfitsApi = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/printHouse-config/profits/add-new-profit-for-action-profit-by-action-id`,
      {
        actionProductId: router.query.actionId,
        profit: percentageProfit,
        isOutSource: router.query.isOutSource ? true : false,
      }
    );
    if (res?.success) {
      onCloseProfitModal();
      //?
      getAllActionProfitRowsByActionId();
    } else {
      alertFaultUpdate();
    }
  }, [percentageProfit]);

  const getAllSupplierList = useCallback(async (SearchTerm?) => {
    await getAndSetAllCustomers(callApi, setSupplierList, {
      clientType: "S",
      searchTerm: SearchTerm,
      onlyCreateOrderClients: false,
    });
  }, []);
  const [supplierList, setSupplierList] = useState([]);
  useEffect(() => {
    if (router.query.isOutSource) {
      getAllSupplierList();
    }
  }, []);

  const updateOutSourceActionSupplier = useCallback(async (supplierId) => {
    const requestData = {
      actionId: router.query.actionId || router.query.productId,
      supplierId,
      ...(selectedPricingTableItems?.exceptionType !== ETypeException.DEFAULT && {
          exceptionId: selectedPricingTableItems?.id
      })
  };
    const res = await callApi(
      "PUT",
      `/v1/printhouse-config/profits/update-out-source-action-supplier`,
      requestData
    );
    if (res?.success) {
      alertSuccessUpdate();
      getProfitsPricingTables()
    } else {
      alertFaultUpdate();
    }
  }, [router.query.actionId,selectedPricingTableItems]);

  return {
    router,
    anchorEl,
    openModal,
    allActions,
    selectedCationId,
    setSelectedActionId,
    handleMoreOptionIconClick,
    onOpenModal,
    CopyActionProfitsToOtherActionApi,
    handleCloseMenu,
    onCloseModal,
    setPercentageProfit,
    percentageProfit,
    openProfitModal,
    onCloseProfitModal,
    onOpenProfitModal,
    AddNewProfitForActionProfitsApi,
    supplierList,
    updateOutSourceActionSupplier,
    selectedSupplier, 
    setSelectedSupplier
  };
};

export { useCopyAction };
