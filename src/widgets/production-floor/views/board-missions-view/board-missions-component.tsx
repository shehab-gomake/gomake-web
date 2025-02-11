import Stack from "@mui/material/Stack";
import { useEffect, useRef, useState } from "react";
import { useBoardMissions } from "@/widgets/production-floor/views/board-missions-view/use-board-missions";
import { BoardMissionsDetailsHeader } from "@/widgets/production-floor/views/board-missions-view/header/board-nissions-details-header";
import { Button, IconButton } from "@mui/material";
import { NavigationButtonsComponent } from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/navigation-buttons-component";
import { EBoardMissionsViews } from "@/widgets/production-floor/views/board-missions-view/enums";
import { BoardMissionsActivities } from "@/widgets/production-floor/views/board-missions-view/activity/board-missions-activities";
import { BoardMissionsFiles } from "@/widgets/production-floor/views/board-missions-view/files/board-missions-files";
import { GoMakeSnackBar } from "@/components";
import { useJobModalSocketIO } from "@/hooks/socket-io/use-job-modal-socket-io";
import { CardContainer } from "./job-card-container/job-card-container";
import { FONT_FAMILY } from "@/utils/font-family";
import { DownloadIcon } from "./job-card-container/components/icons";
import { BoardMissionsAddNote } from "./stations/notes/add-note";
import { BoardMissionsNotes } from "./stations/notes/board-missions-notes";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission";
import ProductDetailsSection from "./job-card-container/components/product-details-section";
import { BoardMissionsStationsComponent } from "./stations/board-missions-stations-component";
import { useStyle } from "./style";
import WorkTypesWidget from "./work-types/work-types-widget";

interface IProps {
  boardMissionsId: string;
  step: string;
  productType: string;
  connectionId: string;
  updateStatus?: any;
}

//!here BoardMissionsComponent main component
const BoardMissionsComponent = ({
  boardMissionsId,
  productType,
  connectionId,
}: IProps) => {
  const {} = useJobModalSocketIO(boardMissionsId);
  const ProductDetailsSectionRef = useRef(null);
  const [typesConHeight, setTypesConHeight] = useState("auto");
  const {
    t,
    getBoardMissions,
    initStates,
    boardMissionsDetails,
    isLoading,
    onClickUploadFile,
    openAddNoteModal,
    handleOpenNotesModal,
    handleCloseNotesModal,
    productDetails,
    stations,
    subWorkFlows,
    boardMissions,
    getStations,
    renderSkeletons,
    productWorksTypes,
    companyProfile,
    classes,
  } = useBoardMissions();

  useEffect(() => {
    if (!!boardMissionsId && !!connectionId) {
      getBoardMissions(boardMissionsId, connectionId, productType).then();
    }
    return () => {
      initStates();
    };
  }, [boardMissionsId, connectionId, productType]);

  useEffect(() => {
    if (ProductDetailsSectionRef?.current) {
      setTypesConHeight(ProductDetailsSectionRef?.current?.clientHeight);
    }
  }, [productDetails]);

  return (
    <Stack
      borderTop={`6px solid ${boardMissionsDetails?.productionFloorJobColor}`}
      maxHeight={"100%"}
      height={"100%"}
      overflow={"hidden"}
      gap={"16px"}
      padding={"34px 24px"}
      borderRadius={"24px, 24px, 0px, 0px"}
    >
      <BoardMissionsDetailsHeader />
      <div style={classes.GridContainer}>
        {isLoading ? (
          renderSkeletons()
        ) : (
          <>
            {/* Notes + Types + Products details */}
            <div style={classes.ColumnOne}>
              <CardContainer
                label={t("sales.quote.notes")}
                actionButton={
                  <PermissionCheck
                    userPermission={
                      Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
                    }
                  >
                    <Button
                      onClick={handleOpenNotesModal}
                      variant="text"
                      style={classes.addNote}
                    >
                      + {t("productionFloor.addNote")}
                    </Button>
                  </PermissionCheck>
                }
              >
                <BoardMissionsNotes />
              </CardContainer>
              <div
                style={{
                  ...classes.GridContainer,
                  gridTemplateColumns:
                    productWorksTypes?.length > 0
                      ? "calc(70% - 5px) calc(30% - 5px)"
                      : "100%",
                  height: "100%",
                }}
              >
                {productDetails.length > 0 && (
                  <div
                    ref={ProductDetailsSectionRef}
                    style={{
                      maxHeight: "fit-content",
                      height: "fit-content",
                    }}
                  >
                    <ProductDetailsSection
                      key={0}
                      name={productDetails[0].name}
                      productionFloorSubSections={
                        productDetails[0].productionFloorSubSections
                      }
                      withHeader={true}
                      header={t("productionFloor.productDetails")}
                    />
                  </div>
                )}
                {productWorksTypes.length > 0 && (
                  <div
                    style={{
                      flex: 1,
                      maxHeight: `${typesConHeight}px`,
                    }}
                  >
                    <CardContainer label={t("productionFloor.types")}>
                      <WorkTypesWidget types={productWorksTypes} />
                    </CardContainer>
                  </div>
                )}
              </div>
              <div
                style={classes.productDetailsContainer}
                className={`custom-scroller`}
              >
                {productDetails.slice(1).map((section, index) => (
                  <ProductDetailsSection
                    key={index + 1}
                    name={section.name}
                    productionFloorSubSections={
                      section.productionFloorSubSections
                    }
                    withHeader={false}
                    style={{
                      flex: 1,
                      minHeight: "fit-content",
                    }}
                  />
                ))}
              </div>
            </div>
            {/* Actions + Files + Activities */}
            <div style={classes.ColumnTwo}>
              <CardContainer label={t("productionFloor.actions")}>
                <BoardMissionsStationsComponent
                  stations={stations}
                  subWorkFlows={subWorkFlows}
                  boardMissions={boardMissions}
                  getStations={getStations}
                />
              </CardContainer>
              <div
                style={{
                  ...classes.NestedGrid,
                  gridTemplateColumns: !!companyProfile.filesApiAddress
                    ? "calc(30% - 4px) calc(70% - 4px)"
                    : "100%",
                }}
              >
                {!!companyProfile.filesApiAddress && (
                  <CardContainer
                    label={t("productionFloor.files")}
                    actionButton={
                      <IconButton
                        onClick={onClickUploadFile}
                        sx={{ padding: "0px" }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    }
                  >
                    <BoardMissionsFiles />
                  </CardContainer>
                )}
                <CardContainer label={t("productionFloor.activities")}>
                  <BoardMissionsActivities />
                </CardContainer>
              </div>
            </div>
          </>
        )}
      </div>
      {/* !here have problem also with type text in activities */}
      <BoardMissionsAddNote
        onClose={handleCloseNotesModal}
        openModal={openAddNoteModal}
      />
      <GoMakeSnackBar />
    </Stack>
  );
};

export { BoardMissionsComponent };
