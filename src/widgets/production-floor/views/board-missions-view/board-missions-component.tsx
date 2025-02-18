import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useBoardMissions } from "@/widgets/production-floor/views/board-missions-view/use-board-missions";
import { BoardMissionsDetailsHeader } from "@/widgets/production-floor/views/board-missions-view/header/board-nissions-details-header";
import { Button, IconButton, Skeleton } from "@mui/material";
import { BoardMissionsActivities } from "@/widgets/production-floor/views/board-missions-view/activity/board-missions-activities";
import { BoardMissionsFiles } from "@/widgets/production-floor/views/board-missions-view/files/board-missions-files";
import { GoMakeSnackBar } from "@/components";
import { useJobModalSocketIO } from "@/hooks/socket-io/use-job-modal-socket-io";
import { CardContainer } from "./job-card-container/job-card-container";
import { DownloadIcon } from "./job-card-container/components/icons";
import { BoardMissionsAddNote } from "./stations/notes/add-note";
import { BoardMissionsNotes } from "./stations/notes/board-missions-notes";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission";
import ProductDetailsSection from "./job-card-container/components/product-details-section";
import { BoardMissionsStationsComponent } from "./stations/board-missions-stations-component";
import WorkTypesWidget from "./work-types/work-types-widget";

interface IProps {
  boardMissionsId: string;
  step: string;
  productType: string;
  connectionId: string;
  updateStatus?: any;
}

const BoardMissionsComponent = ({
  boardMissionsId,
  productType,
  connectionId,
}: IProps) => {
  const {} = useJobModalSocketIO(boardMissionsId);

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
    ProductDetailsSectionRef,
    typesConHeight,
    setTypesConHeight,
    isLoadingStations,
    renderDetailsSkeletons1,
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
    const updateHeight = () => {
      if (ProductDetailsSectionRef?.current) {
        setTypesConHeight(ProductDetailsSectionRef.current.clientHeight);
      }
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);

    // Cleanup listener
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [productDetails]);

  return (
    <Stack
      borderTop={`6px solid ${boardMissionsDetails?.productionFloorJobColor}`}
      maxHeight={"100%"}
      height={"100%"}
      overflow={"hidden"}
      gap={"16px"}
      padding={"10px 20px 0px 20px"}
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
                style={{ background: "#F6F6F6" }}
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
              {isLoadingStations ? (
                renderDetailsSkeletons1()
              ) : (
                <div
                  className={`custom-scroller`}
                  style={classes.productDetailsContainer}
                >
                  <div style={classes.ColumnOneRowTwoGridContainer}>
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
                          style={{ background: "#F6F6F6" }}
                        />
                      </div>
                    )}
                    {productWorksTypes.length > 0 && (
                      <div style={{ maxHeight: `${typesConHeight}px` }}>
                        <CardContainer
                          label={t("productionFloor.types")}
                          style={{ background: "#F6F6F6" }}
                        >
                          <WorkTypesWidget types={productWorksTypes} />
                        </CardContainer>
                      </div>
                    )}
                  </div>
                  <div
                    className={`custom-scroller`}
                    style={{
                      overflowY:
                        productWorksTypes.length > 0 ? "auto" : "visible",
                      maxHeight: "fit-content",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
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
                          background: "#F6F6F6",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
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
      <BoardMissionsAddNote
        onClose={handleCloseNotesModal}
        openModal={openAddNoteModal}
      />
      <GoMakeSnackBar />
    </Stack>
  );
};

export { BoardMissionsComponent };
