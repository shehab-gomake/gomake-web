import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { useBoardMissions } from "@/widgets/production-floor/views/board-missions-view/use-board-missions";
import { BoardMissionsDetailsHeader } from "@/widgets/production-floor/views/board-missions-view/header/board-nissions-details-header";
import { Button, Divider, IconButton, Skeleton } from "@mui/material";

import { NavigationButtonsComponent } from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/navigation-buttons-component";
import { EBoardMissionsViews } from "@/widgets/production-floor/views/board-missions-view/enums";
import { BoardMissionsStationsComponent } from "@/widgets/production-floor/views/board-missions-view/stations/board-missions-stations-component";
import { BoardMissionsActivities } from "@/widgets/production-floor/views/board-missions-view/activity/board-missions-activities";
import { BoardMissionsFiles } from "@/widgets/production-floor/views/board-missions-view/files/board-missions-files";
import { GoMakeSnackBar } from "@/components";
import styled from "styled-components";
import { CardContainer } from "./test-components/job-card-container";
import { FONT_FAMILY } from "@/utils/font-family";
import { CompletedBoardMissionsComponent } from "./stations/completed-board-missions-component/completed-board-missions-component";
import { DownloadIcon } from "./test-components/icons";
import { BoardMissionsAddNote } from "./stations/notes/add-note";
import { BoardMissionsNotes } from "./stations/notes/board-missions-notes";

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
  const {
    t,
    getBoardMissions,
    initStates,
    boardMissionsDetails,
    isLoading,
    onClickUploadFile,
    openAddNoteModal,
    setOpenAddNoteModal,
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
    height: 100vh;
    gap: 10px;
  `;

  // const ColumnOne = styled.div`
  //   display: grid;
  //   grid-template-rows: 15% 25% 60%;
  //   gap: 10px;
  // `;

  // const ColumnTwo = styled.div`
  //   display: grid;
  //   grid-template-rows: 50% 50%;
  //   gap: 10px;
  // `;

  // const NestedGrid = styled.div`
  //   display: grid;
  //   grid-template-columns: 30% 70%; /* 2 columns with 30% and 70% */
  //   width: 100%;
  //   height: 100%;
  //   gap: 10px;
  //   padding-right: 10px;
  // `;

  const ColumnOne = styled.div`
    display: grid;
    grid-template-rows: 20% 25% 55%;
    gap: 10px;
    height: 100%; // Ensure it takes full height
    min-height: 0; // Prevents content overflow issues
    overflow: hidden; // Prevents unintended scrolling
  `;

  const ColumnTwo = styled.div`
    display: grid;
    grid-template-rows: 50% 50%;
    gap: 10px;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  `;

  const NestedGrid = styled.div`
    display: grid;
    grid-template-columns: 30% 70%;
    width: 100%;
    height: 100%;
    gap: 10px;
    padding-right: 10px;
    min-height: 0; // Prevents content overflow issues
    overflow: hidden;
  `;

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
                label="Notes"
                actionButton={
                  <Button
                    onClick={() => setOpenAddNoteModal(true)}
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
                }
              >
                <BoardMissionsNotes />
              </CardContainer>
              <CardContainer label="Product Details">
                <p>This will be "Product Details 1 " section</p>
              </CardContainer>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  flex: 1, // This makes it take remaining space (55%)
                  overflowY: "auto",
                  minHeight: 0, // E
                }}
                className={`custom-scroller`}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <CardContainer
                    style={{
                      flex: 1,
                      minHeight: "100%",
                      // maxHeight: "100%",
                      // height: "fit-content",
                    }}
                    key={index}
                    withHeader={false}
                  >
                    <p>This will be "Product Details {index + 2}" section</p>
                  </CardContainer>
                ))}
              </div>
              {/* <CardContainer withHeader={false}>
                <p>This will be "Product Details index + 1" section</p>
              </CardContainer> */}
            </ColumnOne>

            {/* Actions + Files + Activities */}
            <ColumnTwo>
              <CardContainer label="Actions">
                <p>This will be "Actions" section</p>

                {/* <BoardMissionsStationsComponent /> */}
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
        onClose={() => {
          setOpenAddNoteModal(false);
        }}
        openModal={openAddNoteModal}
      />
    </Stack>
  );
};

export { BoardMissionsComponent };
