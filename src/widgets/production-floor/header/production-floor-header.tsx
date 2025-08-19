import { Breadcrumbs, ButtonGroup, Link, Stack, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { useProductionFloorHeader } from "@/widgets/production-floor/header/use-production-floor-header";
import { EProductionFloorView } from "@/widgets/production-floor/state/production-floor-view";
import { PrimaryButton } from "@/components/button/primary-button";
import { FONT_FAMILY } from "@/utils/font-family";
import { SelectGroup } from "@/widgets/production-floor/select-group/select-group";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { EPathActionType } from "@/widgets/production-floor/enums/path-action-type";
import * as NextLink from "next/link";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import { useTranslation } from "react-i18next";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { SettingsIcon } from "../../../icons/settings-icon";
import { ActionsListComponent } from "@/widgets/production-floor/filters/select/actions-select/action-list-select-component";
import { Source } from "@/widgets/production-floor/filters/select/actions-select/use-actions-list";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import { useIsMobile } from "@/hooks/use-responsive";
import { DoneJobsIcon } from "./components/icons/done-jobs";
import { ColumnSettingsMenuContent } from "@/widgets/production-floor/table-view/components/column-settings-menu";
import { useState } from "react";

const ProductionFloorHeader = ({
  filterGroups,
  setFilterGroups,
  connectionId,
}: any) => {
  const {
    view,
    showAllJobsButton,
    paths,
    onClickPath,
    onClickBack,
    currentPathIndex,
    onStationsChange,
    useUpdateViewInUrl,
  } = useProductionFloorHeader(connectionId);
  const { t } = useTranslation();
  const dir = t("direction");
  const updateViewInUrl = useUpdateViewInUrl();
  const { CheckPermission } = useUserPermission();
  const isMobileScreen = useIsMobile();

  // State for column settings menu
  const [columnSettingsAnchorEl, setColumnSettingsAnchorEl] = useState(null);
  const columnSettingsOpen = Boolean(columnSettingsAnchorEl);

  const handleColumnSettingsOpen = (event) => {
    setColumnSettingsAnchorEl(event.currentTarget);
  };

  const handleColumnSettingsClose = () => {
    setColumnSettingsAnchorEl(null);
  };

  const _renderTitleComponent = () => {
    switch (view) {
      case EProductionFloorView.TABLE:
        return t("productionFloor.productionFloorTable");
      case EProductionFloorView.KANBAN:
        return t("productionFloor.productionFloorKanban");
      case EProductionFloorView.DASHBOARD:
        return t("productionFloor.dashboard");
      case EProductionFloorView.GANTT:
        return t("productionFloor.timeline");
      case EProductionFloorView.DONE_JOBS:
        return t("productionFloor.archive");
      default:
        return t("tabs.productFloor");
    }
  };

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      padding={"0 20px"}
      style={{
        ...(isMobileScreen && { display: "contents" }),
      }}
    >
      <Stack direction={"row"} alignItems={"center"} gap={"10px"}>
        {(showAllJobsButton || view === EProductionFloorView.GROUPS) &&
          view !== EProductionFloorView.DASHBOARD && (
            <Button
              onClick={() => {
                onClickBack();
              }}
              variant={"contained"}
              style={{
                backgroundColor: "#CBCBE4",
                color: "#252675",
                height: "30px",
                gap: "5px",
                alignItems: "center",
              }}
              startIcon={
                dir === "rtl" ? (
                  <ArrowForwardIcon />
                ) : (
                  <KeyboardBackspaceOutlinedIcon />
                )
              }
            >
              {t("materials.buttons.back")}
            </Button>
          )}
        <h1
          style={{
            ...FONT_FAMILY.Lexend(700, 20),
            color: "#2E3092",
            ...(isMobileScreen && { marginTop: "5px" }),
          }}
        >
          {_renderTitleComponent()}
        </h1>
        <Breadcrumbs aria-label="breadcrumb">
          {paths.map((path, index) => (
            <Link
              key={path.name + index}
              onClick={() => onClickPath(path, index)}
              underline={"hover"}
              component={NextLink.default}
              color={index <= currentPathIndex() ? "purple" : "inherit"}
              href={
                path?.actionType === EPathActionType.URL
                  ? "/production-floor?groupsId=" + path.data.groupId
                  : "/production-floor"
              }
            >
              {path.name}
            </Link>
          ))}
        </Breadcrumbs>
      </Stack>
      <Stack direction={"row"} gap={"5px"} alignItems={"center"}>
        {view !== EProductionFloorView.DASHBOARD && (
          <>
            <ActionsListComponent
              filterGroups={filterGroups}
              setFilterGroups={setFilterGroups}
              source={Source.PRODUCTION_FLOOR}
              onClickApply={onStationsChange}
              buttonElement={
                <PrimaryButton
                  style={{ minWidth: "40px", height: "40px", padding: 0 }}
                  variant={"outlined"}
                >
                  <SettingsIcon />
                </PrimaryButton>
              }
            />
            {view === EProductionFloorView.TABLE && (
              <Tooltip title={t("general.columnVisibility")}>
                <PrimaryButton
                  style={{ minWidth: "40px", height: "40px", padding: 0 }}
                  variant={"outlined"}
                  onClick={handleColumnSettingsOpen}
                >
                  <ViewColumnIcon />
                </PrimaryButton>
              </Tooltip>
            )}
            {view === EProductionFloorView.TABLE && (
              <ColumnSettingsMenuContent
                anchorEl={columnSettingsAnchorEl}
                open={columnSettingsOpen}
                onClose={handleColumnSettingsClose}
              />
            )}
          </>
        )}
        <SelectGroup />
        <ButtonGroup dir={"ltr"}>
          <Tooltip title={t("productionFloor.archive")}>
            <PrimaryButton
              style={{ width: "40px", height: "40px", padding: 0 }}
              variant={
                view === EProductionFloorView.DONE_JOBS
                  ? "contained"
                  : "outlined"
              }
              onClick={() => updateViewInUrl(EProductionFloorView.DONE_JOBS)}
            >
              <DoneJobsIcon />
            </PrimaryButton>
          </Tooltip>

          {CheckPermission(Permissions.SHOW_PRODUCTION_TIME_LINE) && (
            <Tooltip title={t("productionFloor.timeline")}>
              <PrimaryButton
                style={{ width: "40px", height: "40px", padding: 0 }}
                variant={
                  view === EProductionFloorView.GANTT ? "contained" : "outlined"
                }
                onClick={() => updateViewInUrl(EProductionFloorView.GANTT)}
              >
                <HourglassEmptyRoundedIcon />
              </PrimaryButton>
            </Tooltip>
          )}

          <Tooltip title={t("productionFloor.dashboard")}>
            <PrimaryButton
              style={{ width: "40px", height: "40px", padding: 0 }}
              variant={
                view === EProductionFloorView.DASHBOARD
                  ? "contained"
                  : "outlined"
              }
              onClick={() => updateViewInUrl(EProductionFloorView.DASHBOARD)}
            >
              <AvTimerIcon />
            </PrimaryButton>
          </Tooltip>

          <Tooltip title={t("productionFloor.kanban")}>
            <PrimaryButton
              style={{ width: "20px", height: "40px", padding: 0 }}
              variant={
                view === EProductionFloorView.KANBAN ? "contained" : "outlined"
              }
              onClick={() => updateViewInUrl(EProductionFloorView.KANBAN)}
            >
              <GridViewIcon />
            </PrimaryButton>
          </Tooltip>

          <Tooltip title={t("productionFloor.table")}>
            <PrimaryButton
              style={{ width: "20px", height: "40px", padding: 0 }}
              variant={
                view === EProductionFloorView.TABLE ? "contained" : "outlined"
              }
              onClick={() => updateViewInUrl(EProductionFloorView.TABLE)}
            >
              <ViewHeadlineIcon />
            </PrimaryButton>
          </Tooltip>
        </ButtonGroup>
      </Stack>
    </Stack>
  );
};

export { ProductionFloorHeader };
