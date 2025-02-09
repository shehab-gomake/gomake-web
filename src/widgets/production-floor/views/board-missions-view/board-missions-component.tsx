import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { useBoardMissions } from "@/widgets/production-floor/views/board-missions-view/use-board-missions";
import { BoardMissionsDetailsHeader } from "@/widgets/production-floor/views/board-missions-view/header/board-nissions-details-header";
import { Button, Divider, IconButton, Skeleton } from "@mui/material";

import { NavigationButtonsComponent } from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/navigation-buttons-component";
import { EBoardMissionsViews } from "@/widgets/production-floor/views/board-missions-view/enums";
import { BoardMissionsActivities } from "@/widgets/production-floor/views/board-missions-view/activity/board-missions-activities";
import { BoardMissionsFiles } from "@/widgets/production-floor/views/board-missions-view/files/board-missions-files";
import { GoMakeSnackBar } from "@/components";
import {useJobModalSocketIO} from "@/hooks/socket-io/use-job-modal-socket-io";
import styled from "styled-components";
import { CardContainer } from "./job-card-container/job-card-container";
import { FONT_FAMILY } from "@/utils/font-family";
import { DownloadIcon } from "./job-card-container/components/icons";
import { BoardMissionsAddNote } from "./stations/notes/add-note";
import { BoardMissionsNotes } from "./stations/notes/board-missions-notes";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission";
import ProductDetailsSection from "./job-card-container/components/product-details-section";
import { BoardMissionsStationsComponent } from "./stations/board-missions-stations-component";

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
  step,
  productType,
  connectionId,
}: IProps) => {
  const {} = useJobModalSocketIO(boardMissionsId)
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
  } = useBoardMissions();

  useEffect(() => {
    if (!!boardMissionsId && !!connectionId) {
      getBoardMissions(boardMissionsId, connectionId, productType).then();
    }
    return () => {
      initStates();
    };
  }, [boardMissionsId, connectionId, productType]);

  const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    // height: 100vh;
    height: 100%;

    gap: 10px;
  `;

  const ColumnOne = styled.div`
    display: grid;
    grid-template-rows: calc(20% - 6px) calc(35% - 6px) calc(45% - 6px);
    gap: 9px;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    box-sizing: border-box;
  `;

  const ColumnTwo = styled.div`
    display: grid;
    grid-template-rows: calc(50% - 4px) calc(50% - 4px);
    gap: 8px;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    box-sizing: border-box;
  `;

  const NestedGrid = styled.div`
    display: grid;
    grid-template-columns: calc(30% - 4px) calc(70% - 4px);
    width: 100%;
    height: 100%;
    gap: 8px;
    min-height: 0;
    overflow: hidden;
  `;

  const typesData = null;

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
      {/* Old */}
      {/* <BoardMissionsDetailsHeader /> */}
      {/* <Divider orientation={"horizontal"} flexItem />
      <NavigationButtonsComponent /> */}
      {/* <Stack overflow={"auto"} flex={1}>
          {step === EBoardMissionsViews.STATIONS && (
            <BoardMissionsStationsComponent />
          )}
          {step === EBoardMissionsViews.FILES && <BoardMissionsFiles />}
          {step === EBoardMissionsViews.APPROVAL && <></>}
          {step === EBoardMissionsViews.ACTIVITY && <BoardMissionsActivities />}
        </Stack> */}
      {/* <GoMakeSnackBar /> */}
      {/* Old */}
      <BoardMissionsDetailsHeader />
      <GridContainer>
        {isLoading ? (
          <>
            <ColumnOne>
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                style={{ borderRadius: "8px" }}
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                style={{ borderRadius: "8px" }}
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                style={{ borderRadius: "8px" }}
              />
            </ColumnOne>
            <ColumnTwo>
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                style={{ borderRadius: "8px" }}
              />
              <NestedGrid>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  style={{ borderRadius: "8px" }}
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  style={{ borderRadius: "8px" }}
                />
              </NestedGrid>
            </ColumnTwo>
          </>
        ) : (
          <>
            {/* Notes + Products details */}
            <ColumnOne>
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
                      style={{
                        color: "#ffffff",
                        ...FONT_FAMILY.Inter(500, 14),
                        padding: "0px",
                        textTransform: "capitalize",
                      }}
                    >
                      + {t("productionFloor.addNote")}
                    </Button>
                  </PermissionCheck>
                }
              >
                <BoardMissionsNotes />
              </CardContainer>
              <GridContainer
                style={{
                  display: "grid",
                  gridTemplateColumns: typesData
                    ? "calc(60% - 4px) calc(40% - 4px)"
                    : "100%",
                  gap: "8px",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                {productDetails.length > 0 && (
                  <ProductDetailsSection
                    key={0}
                    name={productDetails[0].name}
                    productionFloorSubSections={
                      productDetails[0].productionFloorSubSections
                    }
                    withHeader={true}
                    header={"Product Details"}
                    style={{
                      flex: 1,
                      height: "100%",
                    }}
                  />
                )}
                {typesData && (
                  <CardContainer label="Types">
                    <p>This will be "Types" section</p>
                  </CardContainer>
                )}
              </GridContainer>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  flex: 1,
                  overflowY: "auto",
                  minHeight: 0,
                }}
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
            </ColumnOne>
            {/* Actions + Files + Activities */}
            <ColumnTwo>
              <CardContainer label="Actions">
                <BoardMissionsStationsComponent
                  stations={stations}
                  subWorkFlows={subWorkFlows}
                  boardMissions={boardMissions}
                  getStations={getStations}
                />
              </CardContainer>
              <NestedGrid>
                <CardContainer
                  label="Files"
                  actionButton={
                    <IconButton
                      onClick={onClickUploadFile}
                      sx={{ padding: "0px" }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  }
                >
                  <p>This will be "Files" section</p>
                  {/* <BoardMissionsFiles /> */}
                </CardContainer>
                <CardContainer label="Activities">
                  <p>This will be "Activities" section</p>
                  {/* <BoardMissionsActivities /> */}
                </CardContainer>
              </NestedGrid>
            </ColumnTwo>
          </>
        )}
      </GridContainer>
      <GoMakeSnackBar />
      <BoardMissionsAddNote
        onClose={handleCloseNotesModal}
        openModal={openAddNoteModal}
      />
    </Stack>
  );
};

export { BoardMissionsComponent };
