import { Button, Divider, Menu, MenuItem } from "@mui/material";
import { ICurrentStation } from "@/widgets/production-floor/interfaces/current-station";
import { useStyle } from "@/widgets/production-floor/table-view/style";
import Stack from "@mui/material/Stack";
import { DownArrowIcon } from "../table-row/more-circle/icons/down-arrow";
import { UpArrowIcon } from "../table-row/more-circle/icons/up-arrow";
import { FONT_FAMILY } from "@/utils/font-family";
import { getTruncatedLabel } from "@/utils/get-truncated-text";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  boardMissionsUpdateActionMachine,
  boardMissionsUpdateActionEmployee,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { useProductionFloorData } from "@/widgets/production-floor/use-production-floor-data";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useBoardMissionsUpdatedOutputs } from "@/widgets/production-floor/views/board-missions-view/stations/use-board-missions-updated-outputs";

interface IProps extends ICurrentStation {
  boardMissionId: string;
  status?: any;
  textColor?: string;
  employeesCategories?: any;
}

const ChangeMachineEmployeeComponent = ({
  boardMissionId,
  textColor,
  machineName,
  actionName,
  productType,
  id,
  employeesCategories,
  machineId,
  employeeId,
  actionId,
  supplierId,
  supplierName,
}: IProps) => {
  const { GetProductionFontSizeFromPreferences } = usePrintHousePreferences();
  const { classes } = useStyle({ textColor });
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { getData } = useProductionFloorData();
  const { CheckPermission } = useUserPermission();
  const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const open = Boolean(anchorEl);
  const canMoveStation = CheckPermission(
    Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
  );

  // Check if job is outsourced
  const isOutsourced = Boolean(supplierId);

  // Use the correct hook to get available machines and employees
  const {
    employeesList,
    machinesList,
    onClickGetEmployeeForAction,
    onClickGetMachineForAction,
  } = useBoardMissionsUpdatedOutputs();

  const loadAvailableOptions = async () => {
    setIsLoading(true);
    try {
      // Only load the relevant type based on current assignment
      if (employeeId) {
        // If currently assigned to employee, load machines
        await onClickGetEmployeeForAction(actionId);
      } else if (machineId) {
        // If currently assigned to machine, load employees
        await onClickGetMachineForAction(actionId);
      } else {
        // If no assignment, load both
        await Promise.all([
          onClickGetMachineForAction(actionId),
          onClickGetEmployeeForAction(actionId),
        ]);
      }
    } catch (error) {
      console.error("Error loading options:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    // Don't allow changes for outsourced jobs
    if (isOutsourced) {
      return;
    }

    if (canMoveStation) {
      setAnchorEl(event.currentTarget);
      await loadAvailableOptions();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onUpdateMachine = async (machineId: string, machineName: string) => {
    const callBack = (res: any) => {
      if (res?.success) {
        alertSuccessUpdate();
        getData().then();
        handleClose();
      } else {
        alertFaultUpdate();
        getData().then();
      }
    };

    await boardMissionsUpdateActionMachine(callApi, callBack, {
      boardMissionActionId: id,
      machineId,
      machineName,
      workFlowActionId: actionId,
    });
  };

  const onUpdateEmployee = async (employeeId: string, employeeName: string) => {
    const callBack = (res: any) => {
      if (res?.success) {
        alertSuccessUpdate();
        getData().then();
        handleClose();
      } else {
        alertFaultUpdate();
        getData().then();
      }
    };

    await boardMissionsUpdateActionEmployee(callApi, callBack, {
      boardMissionActionId: id,
      employeeId,
      employeeName,
    });
  };

  const currentDisplayText = () => {
    // Check if job is outsourced (has supplierId)
    if (supplierId) {
      return supplierName || "Outsource Job";
    }

    if (employeeId) {
      const employee = employeesCategories?.find(
        (e: any) => e.id === employeeId
      );
      return employee?.label || "Unknown Employee";
    } else if (machineId) {
      return machineName || "Unknown Machine";
    } else {
      return "Select Machine/Employee";
    }
  };

  return (
    <Stack
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      display={"inline-flex"}
      overflow={"hidden"}
    >
      <Button
        sx={{
          ...classes.currentStationBtn,
          ...(isOutsourced && {
            backgroundColor: "#F5F5F5",
            color: "#666666",
            cursor: "default",
            "&:hover": {
              backgroundColor: "#F5F5F5",
            },
          }),
        }}
        variant={"contained"}
        disabled={!canMoveStation || isOutsourced}
        onClick={handleClick}
      >
        <span
          style={{
            ...FONT_FAMILY.Lexend(500, 15),
            color: isOutsourced ? "#666666" : "#000000",
            lineHeight: "15px",
            fontSize: GetProductionFontSizeFromPreferences(),
          }}
        >
          {getTruncatedLabel(currentDisplayText(), 25)}
        </span>
        {!isOutsourced && (
          <>
            {open ? (
              <UpArrowIcon color={"#475467"} width={14} height={14} />
            ) : (
              <DownArrowIcon color={"#475467"} width={14} height={14} />
            )}
          </>
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
            width: "150px",
            maxHeight: "210px",
            overflow: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#9CA3AF #F3F4F6",
          },
          sx: {
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#F3F4F6",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#9CA3AF",
              borderRadius: "4px",
              "&:hover": {
                background: "#6B7280",
              },
            },
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {isLoading && (
          <MenuItem
            disabled
            style={{ fontSize: GetProductionFontSizeFromPreferences() }}
          >
            Loading...
          </MenuItem>
        )}

        {!isLoading && machinesList.length > 0 && (
          <>
            {machinesList.map((machine: any, index: number) => (
              <div key={machine.value}>
                <MenuItem
                  style={{ fontSize: GetProductionFontSizeFromPreferences() }}
                  onClick={() => onUpdateMachine(machine.value, machine.label)}
                >
                  {machine.label}
                </MenuItem>
                {index < machinesList.length - 1 && <Divider />}
              </div>
            ))}
          </>
        )}

        {!isLoading && employeesList.length > 0 && (
          <>
            {employeesList.map((employee: any, index: number) => (
              <div key={employee.value}>
                <MenuItem
                  style={{ fontSize: GetProductionFontSizeFromPreferences() }}
                  onClick={() =>
                    onUpdateEmployee(employee.value, employee.label)
                  }
                >
                  {employee.label}
                </MenuItem>
                {index < employeesList.length - 1 && <Divider />}
              </div>
            ))}
          </>
        )}

        {!isLoading &&
          machinesList.length === 0 &&
          employeesList.length === 0 && (
            <MenuItem
              style={{ fontSize: GetProductionFontSizeFromPreferences() }}
              disabled
            >
              {t("boardMissions.noOptionsAvailable")}
            </MenuItem>
          )}
      </Menu>
    </Stack>
  );
};

export { ChangeMachineEmployeeComponent };
