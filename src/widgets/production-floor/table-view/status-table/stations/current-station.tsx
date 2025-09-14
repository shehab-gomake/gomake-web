import { Button, Divider, Menu, MenuItem } from "@mui/material";
import { ICurrentStation } from "@/widgets/production-floor/interfaces/current-station";
import { useStyle } from "@/widgets/production-floor/table-view/style";
import Stack from "@mui/material/Stack";
import { DownArrowIcon } from "../table-row/more-circle/icons/down-arrow";
import { UpArrowIcon } from "../table-row/more-circle/icons/up-arrow";
import { FONT_FAMILY } from "@/utils/font-family";
import { useStations } from "./use-stations";
import { getTruncatedLabel } from "@/utils/get-truncated-text";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { useTranslation } from "react-i18next";
interface IProps extends ICurrentStation {
  boardMissionId: string;
  status?: any;
  textColor?: string;
  onClickDone?: () => void;
  employeesCategories?: any;
  isMobileScreen?: boolean;
}

const CurrentStationComponent = ({
  boardMissionId,
  textColor,
  machineName,
  actionName,
  productType,
  id,
  employeesCategories,
  onClickDone,
  isMobileScreen = false,
}: IProps) => {
  const { GetProductionFontSizeFromPreferences } = usePrintHousePreferences();
  const { classes } = useStyle({ textColor });
  const { t } = useTranslation();
  const {
    handleClick,
    handleClose,
    anchorEl,
    open,
    boardMissionsStations,
    onUpdateCurrentStation,
    canMoveStation,
  } = useStations();

  return (
    <Stack
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      display={"inline-flex"}
      overflow={"hidden"}
    >
      <Button
        sx={classes.currentStationBtn}
        variant={"contained"}
        disabled={!canMoveStation}
        onClick={(e) => handleClick(e, boardMissionId, productType)}
      >
        <span
          style={{
            ...FONT_FAMILY.Lexend(500, 15),
            color: "#000000",
            lineHeight: "15px",
            fontSize: GetProductionFontSizeFromPreferences(),
          }}
        >
          {machineName
            ? getTruncatedLabel(machineName, 25)
            : getTruncatedLabel(actionName, 25)}
        </span>
        {anchorEl ? (
          <UpArrowIcon color={"#475467"} width={14} height={14} />
        ) : (
          <DownArrowIcon color={"#475467"} width={14} height={14} />
        )}
      </Button>
      <Menu
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{
          style: {
            borderRadius: "8px",
            border: "1px solid #EAECF0",
            boxShadow:
              "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
            color: "black",
            ...FONT_FAMILY.Inter(500, 14),
            width: isMobileScreen ? "200px" : "13%",
            minWidth: isMobileScreen ? "180px" : "auto",
          },
        }}
        anchorEl={anchorEl}
        open={open && boardMissionsStations?.length > 0}
        onClose={handleClose}
      >
        {boardMissionsStations
          ?.filter((s) => s.id !== id)
          ?.map((station) => {
            const employee = employeesCategories?.find(
              (e) => e.id === station.employeeId
            );
            return (
              <>
                <MenuItem
                  style={{ fontSize: GetProductionFontSizeFromPreferences() }}
                  onClick={() =>
                    onUpdateCurrentStation(
                      boardMissionId,
                      station.id,
                      productType
                    )
                  }
                >
                  {station.employeeId
                    ? employee?.label
                    : station?.machineId
                    ? station?.machineName
                    : ""}{" "}
                  ({station.actionName})
                </MenuItem>
                <Divider />
              </>
            );
          })}
        <MenuItem
          style={{ fontSize: GetProductionFontSizeFromPreferences() }}
          onClick={onClickDone}
        >
          {t("boardMissions.done")}
        </MenuItem>
      </Menu>
    </Stack>
  );
};

export { CurrentStationComponent };
