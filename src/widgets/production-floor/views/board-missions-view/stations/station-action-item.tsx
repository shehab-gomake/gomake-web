import {
  CircularProgress,
  Collapse,
  Fade,
  IconButton,
  MenuItem,
  Paper,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import {
  EWorkSource,
  HtmlElementType,
  RuleType,
} from "@/widgets/product-pricing-widget/enums";
import Divider from "@mui/material/Divider";
import {
  ParametersMapping,
  TextAreaActionsMapping,
} from "@/widgets/product-pricing-widget/components/action/key-value-view";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CheckIcon from "@mui/icons-material/Check";
import { useStyle } from "@/widgets/production-floor/views/board-missions-view/stations/style";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { PrimaryButton } from "@/components/button/primary-button";
import { IBoardMissionsStation } from "@/widgets/production-floor/views/board-missions-view/stations/interface";
import { DateFormatterShort } from "@/utils/date-formatters";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  boardMissionsUpdateActionEmployee,
  boardMissionsUpdateActionMachine,
  cancelBoardMissionsActionDone,
  getBoardMissionActionMaterialsApi,
  toggleBoardMissionsActionTimer,
  updateBoardMissionsActionDoneWithMaterialsApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button from "@mui/material/Button";
import { GomakeTextInput } from "@/components";
import { useBoardMissionsUpdatedOutputs } from "./use-board-missions-updated-outputs";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { ActionTimer } from "@/widgets/production-floor/views/board-missions-view/stations/action-timer/action-timer";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import {
  boardMissionsStationsState,
  isOrderCompletedState,
  isPrintNodeModalOpenState,
} from "@/widgets/production-floor/views/board-missions-view/stations/state";
import { useUserPermission } from "@/hooks/use-permission";
import { PrintPackingSlipModalWidget } from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/print-packing-slip-modal-widget";
import { TableOutPutComponent } from "@/widgets/product-pricing-widget/components/table-output/table-output-component";
import {
  boardMissionMaterialState,
  materialModalState,
} from "./material-and-production-time-modal/states";
import { MaterialsAndProductionTimeModalWidget } from "./material-and-production-time-modal";
import { convertUtcToLocalIsoString } from "@/components/date-time/date-time-component";
import { outsourceSuppliersState } from "@/widgets/product-pricing-widget/state";
import { FONT_FAMILY } from "@/utils/font-family";
import { formatSecondsToHHMMSS } from "@/utils/helpers";
import { useIsMobile } from "@/hooks/use-responsive";

interface IProps extends IBoardMissionsStation {
  delay: number;
  selected?: boolean;
  isLastStation?: boolean;
  getStations?: any;
  isHaveSubACtions?: boolean;
  isHideTimeAndDate?: boolean;
  supplierId?: string;
  isSubAction?: boolean;
  storage?: string;
}

const BoardMissionsStationActionItem = ({
  id,
  actionId,
  actionName,
  source,
  machineName,
  employeeName,
  delay,
  dueDate,
  outputs,
  isDone,
  boardMissionActionId,
  boardMissionActionTimer,
  selected,
  isLastStation,
  isEditable,
  isNeedEmployee,
  isNeedMachine,
  isNeedMaterial,
  getStations,
  isHaveSubACtions,
  subActions,
  isHideTimeAndDate,
  supplierName,
  supplierId,
  productType,
  realProductionTime,
  isSubAction = false,
  storage
}: IProps) => {
  const isMobile = useIsMobile();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate, alertFaultGetData } =
    useSnackBar();
  const [boardMissions, setBoardMissions] = useRecoilState(
    boardMissionsDetailsState
  );
  const suppliersState = useRecoilValue(outsourceSuppliersState);
  const suppliers = useMemo(() => {
    return suppliersState?.map((s) => ({
      value: s.supplierId,
      label: s.supplierName,
    }));
  }, [suppliersState]);
  const getSupplierId = useCallback(() => {
    if (supplierId) {
      const supplier = suppliers?.find((sup) => sup.value === supplierId);
      return !!supplier ? supplier.label : "";
    }
    return "";
  }, [supplierId, suppliers, suppliersState]);
  const [stations, setStations] = useRecoilState(boardMissionsStationsState);
  const setIsPrintNodeModalOpen = useSetRecoilState(isPrintNodeModalOpenState);
  const [openPackagingModal, setOpenPackagingModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOrderCompleted] = useRecoilState(isOrderCompletedState);
  const [chooseMachine, setChooseMachine] = useState<boolean>(false);
  const [chooseEmployee, setChooseEmployee] = useState<boolean>(false);
  const {
    employeesList,
    machinesList,
    onClickGetEmployeeForAction,
    onClickGetMachineForAction,
  } = useBoardMissionsUpdatedOutputs();
  const { CheckPermission } = useUserPermission();

  const inputsParameters = outputs.filter(
    (parameter) =>
      parameter &&
      parameter?.propertyType === RuleType.PARAMETER &&
      parameter?.htmlElementType === HtmlElementType.TEXT
  );
  const outputsParameters = outputs.filter(
    (parameter) =>
      parameter &&
      parameter?.propertyType === RuleType.OUTPUT &&
      parameter?.htmlElementType === HtmlElementType.TEXT
  );
  const textAreaOutputs = outputs?.filter(
    (parameter) =>
      parameter &&
      parameter?.propertyType === RuleType.OUTPUT &&
      parameter?.htmlElementType === HtmlElementType.TEXT_AREA
  );
  const tableOutputs = outputs?.filter(
    (parameter) =>
      parameter &&
      parameter?.propertyType === RuleType.OUTPUT &&
      parameter?.htmlElementType === HtmlElementType.TABLE
  );

  const onClickBackToProcess = async (boardMissionsActionId: string, productType: string) => {
    setLoading(true);
    const callBack = (res) => {
      setLoading(false);

      if (res.success) {
        const currentActionId = res.data.currentStationId;
        setStations(
          stations.map((station) => {
            if (station.boardMissionActionId == boardMissionActionId) {
              return { ...station, isDone: false };
            }
            return { ...station };
          })
        );
        setBoardMissions({
          ...boardMissions,
          currentStation: {
            ...boardMissions.currentStation,
            boardMissionActionTimer: {
              ...boardMissions.currentStation?.boardMissionActionTimer,
              isTimerRunning: false,
              totalRunningTime: 0,
            },
          },
          currentBoardMissionActionId: currentActionId,
        });

        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    };
    await cancelBoardMissionsActionDone(callApi, callBack, {
      boardMissionsActionId: boardMissionsActionId,
      productType: productType,
    });
  };

  const [open, setOpen] = useState<boolean>(false);
  const [contactsFilter, setContactsFilter] = useState<string>("");
  const [openMachine, setOpenMachine] = useState<boolean>(false);

  const onClickBoardMissionsUpdateActionEmployee = async (
    boardMissionActionId: string,
    employeeId: string,
    employeeName: string
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getStations();
      } else {
        alertFaultUpdate();
      }
    };
    await boardMissionsUpdateActionEmployee(callApi, callBack, {
      boardMissionActionId,
      employeeId,
      employeeName,
    });
  };

  const onClickBoardMissionsUpdateActionMachine = async (
    boardMissionActionId: string,
    machineId: string,
    machineName: string
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getStations();
      } else {
        alertFaultUpdate();
      }
    };
    await boardMissionsUpdateActionMachine(callApi, callBack, {
      boardMissionActionId,
      machineId,
      machineName: machineName,
    });
  };

  const onContactsInputChange = (e) => {
    setOpen(true);
    setContactsFilter(e.target.value);
  };

  const onMachinesInputChange = (e) => {
    setOpenMachine(true);
  };

  const onMachineClick = (value: any, label: any) => {
    setOpenMachine(false);
    setChooseMachine(false);
    onClickBoardMissionsUpdateActionMachine(
      boardMissionActionId,
      value?.value,
      label
    );
  };

  const onContactClick = (value: any, label: any) => {
    setContactsFilter(value.label);
    setOpen(false);
    setChooseEmployee(false);
    onClickBoardMissionsUpdateActionEmployee(
      boardMissionActionId,
      value?.value,
      label
    );
  };

  const [isReadyModal, setIsReadyModal] = useState<boolean>(false);
  const setState = useSetRecoilState<any>(boardMissionMaterialState);
  const [openMaterialsModal, setOpenMaterialsModal] =
    useRecoilState<any>(materialModalState);
  const [activeStation, setActiveStation] = useState(null);
  const handleOpenModal = (station) => {
    setActiveStation(station);
    setOpenMaterialsModal(true);
  };

  const handleCloseModal = () => {
    setOpenMaterialsModal(false);
    setActiveStation(null);
  };

  const onClickOpenDoneModal = (e) => {
    e.stopPropagation();
    if (isLastStation && isOrderCompleted) {
      setIsReadyModal(true);
    } else {
      setIsReadyModal(false);
    }
    getBoardMissionActionMaterials(boardMissionActionId).then();
  };

  const getBoardMissionActionMaterials = async (
    boardMissionsActionId: string
  ) => {
    const callBack = (res) => {
      setLoading(false);

      if (res.success) {
        setState(res.data);
        handleOpenModal(boardMissionsActionId);
      } else {
        alertFaultGetData();
      }
    };
    await getBoardMissionActionMaterialsApi(callApi, callBack, {
      boardMissionsActionId: boardMissionsActionId,
      productType: productType
    });
  };

  const onClickDoneWithMaterials = async (
    updatedState: {
      currentStationId: string;
      boardMissionActionId: string;
      productionTime: string;
      materials: {
        ProductType: string;
        WorkFlowActionId: string;
        materialKey: string;
        currentValue: string;
      }[];
    },
    sendMSg?: boolean
  ) => {
    setLoading(true);
    const callBack = (res) => {
      setLoading(false);
      if (res.success) {
        setIsPrintNodeModalOpen(res.data.showPrintNodeModal);
        alertSuccessUpdate();
        const currentActionId = res?.data?.currentStationId;
        setStations(
          stations.map((station) => {
            if (station?.boardMissionActionId === boardMissionActionId) {
              return {
                ...station,
                isDone: true,
                boardMissionActionTimer: {
                  isTimerRunning: false,
                  totalRunningTime: Number(updatedState.productionTime),
                },
              };
            }
            return {
              ...station,
            };
          })
        );
        setBoardMissions({
          ...boardMissions,
          currentStation: {
            ...boardMissions.currentStation,
            boardMissionActionTimer: {
              ...boardMissions.currentStation?.boardMissionActionTimer,
              isTimerRunning: false,
              totalRunningTime: 0,
            },
          },
          currentBoardMissionActionId: currentActionId,
        });
        if (isLastStation) {
          setOpenPackagingModal(true);
        }
      } else {
        alertFaultUpdate();
        setLoading(false);
      }
    };
    await updateBoardMissionsActionDoneWithMaterialsApi(callApi, callBack, {
      updatedState,
      productType: productType,
      isSendMessage: !!sendMSg,
    });
  };

  // if isSubAction make problem delete it and use the useEffect
  // useEffect(() => {
  //   setIsOpen(!!selected);
  // }, [selected]);

  return (
    <>
      {isHaveSubACtions ? (
        <div>
          {/* General action header */}
          <Fade in={true} timeout={delay}>
            <Stack
              onClick={() => setIsOpen(!isOpen)}
              alignItems={"center"}
              direction={"row"}
              justifyContent={"space-between"}
              style={{
                ...classes.actionContainer,
                border: selected ? classes.actionContainerBorder : "unset",
              }}
            >
              <Stack
                direction={"row"}
                gap={"10px"}
                alignItems={"center"}
                flexWrap={"wrap"}
              >
                <Stack
                  style={classes.sectionTitle}
                  direction={"row"}
                  alignItems={"center"}
                  gap={"10px"}
                >
                  <span
                    style={{ color: "#FFF", ...FONT_FAMILY.Inter(500, 14) }}
                  >
                    {actionName}
                  </span>
                </Stack>
                <Divider
                  orientation={"vertical"}
                  flexItem
                  style={{ background: "#FFF" }}
                />
                <span style={{ ...classes.detailValue, color: "#FFFF" }}>
                  {DateFormatterShort(convertUtcToLocalIsoString(dueDate))}
                </span>
                {isDone && (
                  <>
                    <Divider
                      orientation={"vertical"}
                      flexItem
                      style={classes.dividerStyle}
                    />
                    <span style={classes.realTimeValue}>
                      {formatSecondsToHHMMSS(realProductionTime ?? 0)}
                    </span>
                  </>
                )}
                {source == EWorkSource.OUT && (
                  <Stack style={classes.sectionTitle}>
                    <span style={classes.outSourceLabel}>OS</span>
                  </Stack>
                )}
              </Stack>
              <Stack
                direction={"row"}
                gap={"12px"}
                flexWrap={"nowrap"}
                minWidth={"fit-content"}
              >
                <PermissionCheck
                  userPermission={
                    Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
                  }
                >
                  {isEditable && (
                    <div>
                      {loading ? (
                        <CircularProgress size={isMobile ? 20 : 30} />
                      ) : isDone ? (
                        <Button
                          variant={"contained"}
                          onClick={(e) => {
                            e.stopPropagation();
                            onClickBackToProcess(boardMissionActionId, productType).then();
                          }}
                          style={{
                            padding: "5px 8px",
                            ...FONT_FAMILY.Inter(600, isMobile ? 12 : 14),
                            backgroundColor: "#FFF",
                            color: "#475467",
                            borderRadius: "8px",
                            textTransform: "capitalize",
                            border: "1px solid #475467",
                          }}
                        >
                          {t("boardMissions.completed")}
                        </Button>
                      ) : (
                        <PrimaryButton
                          variant={"contained"}
                          sx={{
                            height: isMobile ? "25px" : "30px",
                            width: isMobile ? "25px" : "30px",
                            minWidth: isMobile ? "25px" : "30px",
                            padding: 0,
                            borderRadius: "8px",
                          }}
                          onClick={onClickOpenDoneModal}
                        >
                          <CheckIcon
                            sx={isMobile ? { fontSize: "16px" } : undefined}
                          />
                        </PrimaryButton>
                      )}
                    </div>
                  )}
                </PermissionCheck>
                <Stack
                  direction={"row"}
                  gap={"12px"}
                  flexWrap={"nowrap"}
                  minWidth={"fit-content"}
                >
                  <IconButton
                    onClick={() => setIsOpen(!isOpen)}
                    style={classes.toggleSubWorkFlowActionButton}
                  >
                    {isOpen ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                </Stack>
              </Stack>
            </Stack>
          </Fade>
          {/* Collapse subActions */}
          <Collapse in={isOpen} collapsedSize={0} orientation={"vertical"}>
            <Stack padding={"10px 0"} gap={"10px"}>
              {subActions?.map((subAction, i) => (
                <Stack
                  key={subAction?.boardMissionActionId}
                  direction={"row"}
                  alignItems={"center"}
                  position={"relative"}
                  padding={"0 5px"}
                >
                  {/* Divider between actions */}
                  {i + 1 < subActions?.length ? (
                    <Divider
                      orientation={"vertical"}
                      style={{
                        width: "2px",
                        backgroundColor: "#667085",
                        margin: i === 0 ? "-10px 0 -10px 0" : "-10px 0",
                      }}
                      flexItem
                    />
                  ) : (
                    <Divider
                      style={classes.subWorkFlowDividerVertical}
                      absolute
                      orientation={"vertical"}
                    />
                  )}

                  <Divider
                    orientation={"horizontal"}
                    style={{
                      width: "30px",
                      height: "2px",
                      backgroundColor: "#667085",
                    }}
                  />
                  {/* Sub Action Item */}
                  <BoardMissionsStationActionItem
                    delay={i * 300}
                    selected={subAction.boardMissionActionId}
                    isHaveSubACtions={!!subAction.subActions}
                    subActions={subAction.subActions}
                    isHideTimeAndDate={true}
                    isSubAction={true}
                    {...subAction}
                  />
                </Stack>
              ))}
            </Stack>
          </Collapse>
        </div>
      ) : (
        <Fade
          in={true}
          timeout={delay}
          style={{
            width: "100%",
            position: "relative",
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"baseline"}
            justifyContent={"space-between"}
            onClick={() => setIsOpen(isHideTimeAndDate ? isOpen : !isOpen)}
            style={{
              ...classes.actionContainer,
              backgroundColor: isDone ? "#EAECF0" : "#F9FAFB",
              border: selected
                ? classes.actionContainerBorder
                : "1px solid var(--Colors-Border-border-primary, #D0D5DD)",
            }}
          >
            <Stack style={{ width: "100%" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
                width={"100%"}
              >
                <Stack
                  direction={"row"}
                  gap={isMobile ? "8px" : "16px"}
                  alignItems={"center"}
                  width="90%"
                  flexWrap={"wrap"}
                >
                  <Stack
                    style={classes.sectionTitle}
                    direction={"row"}
                    alignItems={"center"}
                    gap={"10px"}
                  >
                    <span
                      style={{ ...FONT_FAMILY.Inter(500, isMobile ? 13 : 14) }}
                    >
                      {actionName}
                    </span>
                    {source === EWorkSource.OUT && supplierId ? (
                      <span style={classes.supplierTitle}>
                        {getSupplierId()}
                      </span>
                    ) : (
                      isNeedMachine && (
                        <>
                          {!chooseMachine ? (
                            <Button
                              dir={dir}
                              disabled={isDone}
                              endIcon={!isDone && <KeyboardArrowDownIcon />}
                              onClick={(e) => {
                                if (
                                  CheckPermission(
                                    Permissions.IS_CAN_UPDATE_MACHINE_IN_PRODUCTION_FLOOR
                                  ) &&
                                  isEditable
                                ) {
                                  e.stopPropagation();
                                  setChooseMachine(true);
                                  onClickGetMachineForAction(actionId);
                                }
                              }}
                              variant={"text"}
                              sx={classes.machineTitle}
                            >
                              {machineName != null ? (
                                <>
                                  {machineName?.length > 20
                                    ? machineName.slice(0, 20) + "..."
                                    : machineName}
                                </>
                              ) : (
                                <>{t("boardMissions.selectNewMachine")}</>
                              )}
                            </Button>
                          ) : (
                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div style={{ position: "relative" }}>
                                <GomakeTextInput
                                  placeholder={t(
                                    "materials.inputs.selectMachine"
                                  )}
                                  style={{
                                    height: "40px",
                                    marginBottom: "3px",
                                  }}
                                  value={contactsFilter}
                                  onChange={onMachinesInputChange}
                                  onClick={() => setOpenMachine(!openMachine)}
                                />
                                {!!openMachine && (
                                  <ClickOutside
                                    onClick={() => setOpenMachine(false)}
                                  >
                                    <Paper sx={classes.paperStyle}>
                                      {machinesList?.map((value, index) => {
                                        return (
                                          <MenuItem
                                            key={index}
                                            onClick={() =>
                                              onMachineClick(value, value.label)
                                            }
                                            sx={{
                                              ...FONT_FAMILY.Inter(
                                                500,
                                                isMobile ? 14 : 16
                                              ),
                                            }}
                                          >
                                            {value.label?.slice(
                                              0,
                                              isMobile ? 16 : 18
                                            ) + "..."}
                                          </MenuItem>
                                        );
                                      })}
                                    </Paper>
                                  </ClickOutside>
                                )}
                              </div>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setChooseMachine(false);
                                }}
                                sx={{
                                  fontSize: isMobile ? "16px" : "24px",
                                }}
                              >
                                <ClearRoundedIcon
                                  sx={{
                                    fontSize: isMobile ? "18px" : "20px",
                                  }}
                                />
                              </IconButton>
                            </Stack>
                          )}
                        </>
                      )
                    )}
                    {isNeedEmployee && (
                      <>
                        {!chooseEmployee ? (
                          <Button
                            dir={dir}
                            disabled={isDone}
                            endIcon={!isDone && <KeyboardArrowDownIcon />}
                            onClick={(e) => {
                              if (
                                CheckPermission(
                                  Permissions.IS_CAN_UPDATE_MACHINE_IN_PRODUCTION_FLOOR
                                ) &&
                                isEditable
                              ) {
                                e.stopPropagation();
                                setChooseEmployee(true);
                                onClickGetEmployeeForAction(actionId);
                              }
                            }}
                            variant={"text"}
                            sx={classes.machineTitle}
                          >
                            {employeeName ? (
                              employeeName
                            ) : (
                              <>{t("boardMissions.selectNewEmployee")}</>
                            )}
                          </Button>
                        ) : (
                          <Stack
                            direction={"row"}
                            gap={"5px"}
                            alignItems={"center"}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div style={{ position: "relative" }}>
                              <GomakeTextInput
                                placeholder={t(
                                  "products.profits.exceptions.selectEmployee"
                                )}
                                style={{
                                  height: "40px",
                                  marginBottom: "3px",
                                }}
                                value={contactsFilter}
                                onChange={onContactsInputChange}
                                onClick={() => setOpen(!open)}
                              />
                              {!!open && (
                                <ClickOutside onClick={() => setOpen(false)}>
                                  <Paper sx={classes.paperStyle}>
                                    {employeesList?.map((value, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          onClick={() =>
                                            onContactClick(value, value.label)
                                          }
                                          sx={{
                                            ...FONT_FAMILY.Inter(
                                              500,
                                              isMobile ? 14 : 16
                                            ),
                                          }}
                                        >
                                          {value.label}
                                        </MenuItem>
                                      );
                                    })}
                                  </Paper>
                                </ClickOutside>
                              )}
                            </div>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setChooseEmployee(false);
                              }}
                            >
                              <ClearRoundedIcon />
                            </IconButton>
                          </Stack>
                        )}
                      </>
                    )}
                  </Stack>
                  {!isHideTimeAndDate && (
                    <>
                      <Divider
                        orientation={"vertical"}
                        flexItem
                        style={{
                          height: "20px",
                          alignSelf: "center",
                          color: "#D6D6D6",
                        }}
                      />
                      <Stack
                        direction={"row"}
                        gap={"5px"}
                        alignItems={"center"}
                      >
                        <span style={classes.detailValue}>
                          {DateFormatterShort(
                            convertUtcToLocalIsoString(dueDate)
                          )}
                        </span>
                      </Stack>
                      {isDone && (
                        <>
                          <Divider
                            orientation={"vertical"}
                            flexItem
                            style={classes.dividerStyle}
                          />
                          <span style={classes.realTimeValue}>
                            {formatSecondsToHHMMSS(realProductionTime ?? 0)}
                          </span>
                        </>
                      )}
                      {source == EWorkSource.OUT && (
                        <Stack style={classes.sectionTitle}>
                          <span style={classes.outSourceLabel}>OS</span>
                        </Stack>
                      )}
                    </>
                  )}
                  {
                    storage && (
                      <span style={classes.sectionTitle}>{t("boardMissions.storage")}: {storage}</span>
                    )
                  }
                </Stack>
                {/* Completed and Check */}
                <PermissionCheck
                  userPermission={
                    Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
                  }
                >
                  {isEditable && !isHideTimeAndDate && (
                    <div>
                      {loading ? (
                        <CircularProgress size={isMobile ? 20 : 30} />
                      ) : isDone ? (
                        <Button
                          variant={"outlined"}
                          onClick={(e) => {
                            e.stopPropagation();
                            onClickBackToProcess(boardMissionActionId, productType).then();
                          }}
                          style={{
                            padding: "5px 8px",
                            ...FONT_FAMILY.Inter(600, isMobile ? 12 : 14),
                            backgroundColor: "#FFF",
                            color: "#475467",
                            borderRadius: "8px",
                            textTransform: "capitalize",
                            border: "1px solid #475467",
                          }}
                        >
                          {t("boardMissions.completed")}
                        </Button>
                      ) : (
                        <PrimaryButton
                          variant={"contained"}
                          sx={{
                            height: isMobile ? "25px" : "30px",
                            width: isMobile ? "25px" : "30px",
                            minWidth: isMobile ? "25px" : "30px",
                            padding: 0,
                            borderRadius: "8px",
                          }}
                          onClick={onClickOpenDoneModal}
                        >
                          <CheckIcon
                            sx={isMobile ? { fontSize: "16px" } : undefined}
                          />
                        </PrimaryButton>
                      )}
                    </div>
                  )}
                </PermissionCheck>
              </Stack>
              <Collapse
                in={isSubAction ? true : isOpen}
                collapsedSize={0}
                orientation={"vertical"}
                onClick={(e) => e.stopPropagation()}
              >
                {inputsParameters.length > 0 && (
                  <>
                    <Divider />
                    <Stack
                      padding={"10px 0"}
                      direction={"row"}
                      gap={isMobile ? "8px" : "16px"}
                      flexWrap={"wrap"}
                    >
                      <ParametersMapping
                        parameters={inputsParameters}
                        isProductionFloor={true}
                      />
                    </Stack>
                  </>
                )}
                {outputsParameters.length > 0 &&
                  source === EWorkSource.INTERNAL && (
                    <>
                      <Divider />
                      <Stack
                        padding={"10px 0"}
                        direction={"row"}
                        gap={isMobile ? "8px" : "16px"}
                        flexWrap={"wrap"}
                      >
                        <ParametersMapping
                          source={source}
                          parameters={outputsParameters}
                          isProductionFloor={true}
                        />
                        <TextAreaActionsMapping
                          parameters={textAreaOutputs}
                          actionId={id}
                          orderItemId={boardMissions?.orderItemId}
                          productType={boardMissions.productType}
                        />
                        {tableOutputs?.map((parameter) => (
                          <TableOutPutComponent {...parameter} />
                        ))}
                      </Stack>
                    </>
                  )}
              </Collapse>
            </Stack>
          </Stack>
        </Fade>
      )}
      {activeStation && (
        <MaterialsAndProductionTimeModalWidget
          openModal={openMaterialsModal}
          onClose={handleCloseModal}
          onUpdate={onClickDoneWithMaterials}
          showIsReady={isReadyModal}
        />
      )}
      <PrintPackingSlipModalWidget
        boardMissionId={boardMissions.boardMissionId}
        quantity={boardMissions.quantity}
        openModal={openPackagingModal}
        onClose={() => {
          setOpenPackagingModal(false);
        }}
      />
    </>
  );
};

export { BoardMissionsStationActionItem };
