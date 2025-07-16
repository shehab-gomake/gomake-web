import { getBoardMissionsById } from "@/services/api-service/production-floor/production-floor-endpoints";
import { useGomakeAxios } from "@/hooks";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { addBoardMissionsToFileUploaderApi } from "@/services/api-service/board-missions/board-missions-table";
import { useRouter } from "next/router";
import {
  fileUploaderConnectionIdState,
  openFileUploaderList,
  pinFileUploaderState,
} from "@/store/file-uploader-state";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useBoardMissionsStations } from "./stations/use-board-missions-stations";
import { useStyle } from "./style";
import { Skeleton } from "@mui/material";
import { printHouseProfile } from "@/store/print-house-profile";
import { useBoardMissionsNotes } from "./stations/notes/use-board-missions-notes";
import {
  getBoardMissionsByIdState,
  relatedOrderItemsComponentState,
} from "./stations/state";
import { useIsMobile } from "@/hooks/use-responsive";

const useBoardMissions = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { query } = router;
  const isMobileScreen = useIsMobile();
  const { notes } = useBoardMissionsNotes();
  const { callApi } = useGomakeAxios();
  const [boardMissionsDetails, setBoardMissionsDetails] = useRecoilState(
    boardMissionsDetailsState
  );
  const resetDetails = useResetRecoilState(boardMissionsDetailsState);
  const [companyProfile] = useRecoilState(printHouseProfile);
  const ProductDetailsSectionRef = useRef(null);
  const [typesConHeight, setTypesConHeight] = useState("auto");
  const [openAddNoteModal, setOpenAddNoteModal] = useState<boolean>(false);
  const [connectionId] = useRecoilState(fileUploaderConnectionIdState);
  const [, setOpenFileUploader] = useRecoilState(openFileUploaderList);
  const [, setShowFileUploader] = useRecoilState(pinFileUploaderState);
  const {
    stations,
    subWorkFlows,
    boardMissions,
    getStations,
    productDetails,
    resetProductDetails,
    productWorksTypes,
  } = useBoardMissionsStations();

  const relatedOrderItems = useRecoilValue(relatedOrderItemsComponentState);

  const { classes } = useStyle(
    notes,
    productWorksTypes,
    relatedOrderItems,
    isMobileScreen
  );
  const isLoadingStations = stations?.length === 0;
  const isLoading = !boardMissionsDetails?.boardMissionId; // Check if boardMissionId exists
  const [
    abortControllergetBoardMissionsById,
    setAbortControllergetBoardMissionsById,
  ] = useRecoilState(getBoardMissionsByIdState);
  const initStates = () => {
    resetDetails();
    resetProductDetails();
  };

  const getBoardMissions = async (id: string, productType: string) => {
    if (abortControllergetBoardMissionsById) {
      abortControllergetBoardMissionsById.abort();
    }
    const newRequestAbortController = new AbortController();
    setAbortControllergetBoardMissionsById(newRequestAbortController);
    const callBack = async (res) => {
      if (res.success) {
        if (res.data?.boardMissionId !== query.boardMissionsId) {
          return;
        }
        setBoardMissionsDetails(res.data);
      }
    };
    await getBoardMissionsById(
      callApi,
      callBack,
      {
        id,
        productType,
      },
      false,
      newRequestAbortController
    );
  };

  const onClickUploadFile = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setOpenFileUploader(true);
        setShowFileUploader(true);
      } else {
      }
    };
    await addBoardMissionsToFileUploaderApi(callApi, callBack, {
      boardMissionsId: query.boardMissionsId,
      connectionId: connectionId,
    });
  };

  const handleOpenNotesModal = () => {
    setOpenAddNoteModal(true);
  };

  const handleCloseNotesModal = () => {
    setOpenAddNoteModal(false);
  };

  const renderSkeletons = () => (
    <>
      <div style={classes.ColumnOne}>
        {[...Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width="100%"
            height="100%"
            style={{ borderRadius: "8px" }}
          />
        ))}
      </div>
      <div style={classes.ColumnTwo}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          style={{ borderRadius: "8px" }}
        />
        <div style={classes.NestedGrid}>
          {[...Array(2)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width="100%"
              height="100%"
              style={{ borderRadius: "8px" }}
            />
          ))}
        </div>
      </div>
    </>
  );

  const renderMobileSkeletons = () => (
    <Skeleton
      variant="rectangular"
      width="100%"
      height="15vh"
      style={{ borderRadius: "8px" }}
    />
  );
  const renderDetailsSkeletons1 = () => (
    <Skeleton
      variant="rectangular"
      width="100%"
      height="100%"
      style={{ ...classes.ColumnOneRowTwoGridContainer, borderRadius: "8px" }}
    />
  );

  const renderDetailsSkeletons2 = () => (
    <Skeleton
      variant="rectangular"
      width="100%"
      height="100%"
      style={{ ...classes.productDetailsContainer, borderRadius: "8px" }}
    />
  );
  return {
    getBoardMissions,
    initStates,
    boardMissionsDetails,
    isLoading,
    onClickUploadFile,
    openAddNoteModal,
    handleOpenNotesModal,
    handleCloseNotesModal,
    productDetails,
    t,
    stations,
    subWorkFlows,
    boardMissions,
    getStations,
    renderSkeletons,
    productWorksTypes,
    companyProfile,
    notes,
    classes,
    ProductDetailsSectionRef,
    typesConHeight,
    setTypesConHeight,
    isLoadingStations,
    renderDetailsSkeletons1,
    renderDetailsSkeletons2,
    relatedOrderItems,
    isMobileScreen,
    renderMobileSkeletons,
  };
};

export { useBoardMissions };
