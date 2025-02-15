import { Breadcrumbs, ButtonGroup, Link, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
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

const ProductionFloorHeader = ({ filterGroups, setFilterGroups,connectionId }: any) => {
  const {
    view,
    setView,
    showAllJobsButton,
    paths,
    onClickPath,
    navigateToProductionFloor,
    onClickBack,
    currentPathIndex,
    onStationsChange,
    useUpdateViewInUrl,
  } = useProductionFloorHeader(connectionId);
  const { t } = useTranslation();
  const dir = t("direction");
  const updateViewInUrl = useUpdateViewInUrl();
  const { CheckPermission } = useUserPermission();

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
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
          }}
        >
          {t("tabs.productFloor")}
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
        )}
        <SelectGroup />
        <ButtonGroup dir={"ltr"}>
          {CheckPermission(Permissions.SHOW_PRODUCTION_TIME_LINE) && (
            <PrimaryButton
              style={{ width: "40px", height: "40px", padding: 0 }}
              variant={
                view === EProductionFloorView.GANTT ? "contained" : "outlined"
              }
              // onClick={() => {
              //   setView(EProductionFloorView.DASHBOARD);
              //   navigateToProductionFloor();
              // }}
              onClick={() => updateViewInUrl(EProductionFloorView.GANTT)}
            >
              <AvTimerIcon />
            </PrimaryButton>
          )}

          <PrimaryButton
            style={{ width: "40px", height: "40px", padding: 0 }}
            variant={
              view === EProductionFloorView.DASHBOARD ? "contained" : "outlined"
            }
            // onClick={() => {
            //   setView(EProductionFloorView.DASHBOARD);
            //   navigateToProductionFloor();
            // }}
            onClick={() => updateViewInUrl(EProductionFloorView.DASHBOARD)}
          >
            <AvTimerIcon />
          </PrimaryButton>
          <PrimaryButton
            style={{ width: "20px", height: "40px", padding: 0 }}
            variant={
              view === EProductionFloorView.KANBAN ? "contained" : "outlined"
            }
            // onClick={() => {
            //   setView(EProductionFloorView.KANBAN);
            //   navigateToProductionFloor();
            // }}
            onClick={() => updateViewInUrl(EProductionFloorView.KANBAN)}
          >
            <GridViewIcon />
          </PrimaryButton>
          <PrimaryButton
            style={{ width: "20px", height: "40px", padding: 0 }}
            variant={
              view === EProductionFloorView.TABLE ? "contained" : "outlined"
            }
            // onClick={() => {
            //   setView(EProductionFloorView.TABLE);
            //   navigateToProductionFloor();
            // }}
            onClick={() => updateViewInUrl(EProductionFloorView.TABLE)}
          >
            <ViewHeadlineIcon />
          </PrimaryButton>
        </ButtonGroup>
      </Stack>
    </Stack>
  );
};

export { ProductionFloorHeader };
