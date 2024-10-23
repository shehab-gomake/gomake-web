import { useGomakeAxios } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { getAllPrintHouseActions } from "@/services/hooks";
import { actionLists } from "@/store";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";

interface EAction {
  id: string;
  actionId: string;
  name: string;
  isInternal: boolean;
  isOutsource: boolean;
  isActive: boolean;
  index: number | null; // index can be a number or null
}
const useCopyAction = () => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCationId, setSelectedActionId] = useState<EAction>()
  const handleMoreOptionIconClick = (event) => {
    getActions()
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
  const { callApi } = useGomakeAxios();
  const CopyActionProfitsToOtherActionApi = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/printhouse-config/profits/copy-action-profits-to-other-action`,
      {
        sourceActionId: selectedCationId?.actionId ,
        destinationActionId: router.query.actionId,
        isOutSource: router.query.isOutSource ? true : false
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

  return {
  router,
  anchorEl,
  openModal,
  allActions,
  setSelectedActionId,
  handleMoreOptionIconClick,
  onOpenModal,
  CopyActionProfitsToOtherActionApi,
  handleCloseMenu,
  onCloseModal
  };
};

export { useCopyAction };
