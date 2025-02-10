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
import { DateFormatterDDMMYYYY } from "@/utils/adapter";
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
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
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
import {
  currentProductItemValueState,
  outsourceSuppliersState,
} from "@/widgets/product-pricing-widget/state";
import { updateProductItemDraftActionData } from "@/services/api-service/product-item-value-draft/product-item-draft-endpoints";

interface IProps extends IBoardMissionsStation {
  delay: number;
  selected?: boolean;
  isLastStation?: boolean;
  getStations?: any;
  isHaveSubACtions?: boolean;
  isHideTimeAndDate?: boolean;
  supplierId?: string;
}

//!here have a copy
const BoardMissionsStationAction = ({
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
}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate, alertFaultGetData } =
    useSnackBar();
  // const [openReadyModal, setIsReadyModal] = useState<boolean>(false);
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
  const [openPackagingModal, setOpenPackagingModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [timerLoading, setTimerLoading] = useState<boolean>(false);
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

  const onClickBackToProcess = async (boardMissionsActionId: string) => {
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
          currentBoardMissionActionId: currentActionId,
        });
        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    };
    await cancelBoardMissionsActionDone(callApi, callBack, {
      boardMissionsActionId: boardMissionsActionId,
      productType: boardMissions.productType,
    });
  };

  const onToggleTimer = async (seconds: number) => {
    setTimerLoading(true);
    const callBack = (res) => {
      setTimerLoading(false);
      setStations(
        stations.map((station) => {
          if (station.boardMissionActionId == boardMissionActionId) {
            const isTimerRunning = station.boardMissionActionTimer
              ? !station.boardMissionActionTimer.isTimerRunning
              : true;
            return {
              ...station,
              boardMissionActionTimer: {
                ...station.boardMissionActionTimer,
                isTimerRunning: isTimerRunning,
                totalRunningTime: seconds,
              },
            };
          }
          return { ...station };
        })
      );
      if (res.success) {
        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    };
    await toggleBoardMissionsActionTimer(callApi, callBack, {
      boardMissionsActionId: boardMissionActionId,
      productType: boardMissions.productType,
    });
  };

  useEffect(() => {
    setIsOpen(!!selected);
  }, [selected]);

  const [open, setOpen] = useState<boolean>(false);
  const [contactsFilter, setContactsFilter] = useState<string>("");
  const [selectedContact, setSelectedContacts] = useState({});

  const [openMachine, setOpenMachine] = useState<boolean>(false);
  const [machensFilter, setMachinesFilter] = useState<string>("");
  const [selectedMachine, setSelectedMachines] = useState({});

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
    setMachinesFilter(e.target.value);
  };
  const onMachineClick = (value: any, label: any) => {
    setSelectedMachines(value);
    setMachinesFilter(value.label);
    setOpenMachine(false);
    setChooseMachine(false);
    onClickBoardMissionsUpdateActionMachine(
      boardMissionActionId,
      value?.value,
      label
    );
  };
  const onContactClick = (value: any, label: any) => {
    setSelectedContacts(value);
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
      productType: boardMissions.productType,
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
          currentBoardMissionActionId: currentActionId,
        });
        setOpenPackagingModal(true);
      } else {
        alertFaultUpdate();
        setLoading(false);
      }
    };
    await updateBoardMissionsActionDoneWithMaterialsApi(callApi, callBack, {
      updatedState,
      productType: boardMissions.productType,
      isSendMessage: !!sendMSg,
    });
  };

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
                  <span style={{ color: "#FFF" }}>{actionName}</span>
                  <Divider
                    orientation={"vertical"}
                    flexItem
                    style={{ background: "#FFF" }}
                  />
                </Stack>
                <Stack direction={"row"} gap={"8px"} alignItems={"center"}>
                  <span style={{ ...classes.detailTitle, color: "#FFFF" }}>
                    {t("productionFloor.timer")}
                  </span>
                  <ActionTimer
                    actionId={boardMissionActionId}
                    loading={timerLoading}
                    onToggle={onToggleTimer}
                    {...boardMissionActionTimer}
                    isSubAction={true}
                  />
                </Stack>
                <Divider
                  orientation={"vertical"}
                  flexItem
                  style={{ background: "#FFF" }}
                />
                <Stack direction={"row"} gap={"8px"} alignItems={"center"}>
                  <span style={{ ...classes.detailTitle, color: "#FFFF" }}>
                    {t("productionFloor.deliveryTime")}
                  </span>
                  <span style={{ ...classes.detailValue, color: "#FFFF" }}>
                    {DateFormatterDDMMYYYY(convertUtcToLocalIsoString(dueDate))}
                  </span>
                </Stack>
                <span style={classes.sourceLabel}>
                  {source === EWorkSource.OUT
                    ? t("pricingWidget.outSource")
                    : t("pricingWidget.inSource")}
                </span>
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
                        <CircularProgress />
                      ) : isDone ? (
                        <Button
                          variant={"contained"}
                          onClick={(e) => {
                            e.stopPropagation();
                            onClickBackToProcess(boardMissionActionId).then();
                          }}
                          style={{
                            padding: "10px",
                            backgroundColor: "#FFF",
                            color: "#344054",
                            borderRadius: "16px",
                          }}
                        >
                          {t("boardMissions.completed")}
                        </Button>
                      ) : (
                        <PrimaryButton
                          variant={"contained"}
                          sx={{
                            height: "40px",
                            width: "40px",
                            minWidth: "40px",
                            padding: 0,
                            borderRadius: "12px",
                          }}
                          onClick={onClickOpenDoneModal}
                        >
                          <CheckIcon />
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
                        margin: i === 0 ? "-20px 0 -10px 0" : "-10px 0",
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
                  <BoardMissionsStationAction
                    delay={i * 300}
                    selected={subAction.boardMissionActionId}
                    isHaveSubACtions={!!subAction.subActions}
                    subActions={subAction.subActions}
                    isHideTimeAndDate={true}
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
          style={{ width: "100%", position: "relative" }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            onClick={() => setIsOpen(isHideTimeAndDate ? isOpen : !isOpen)}
            style={{
              ...classes.actionContainer,
              backgroundColor: isDone ? "#EAECF0" : "#F9FAFB",
              border: selected ? classes.actionContainerBorder : "unset",
            }}
          >
            <Stack>
              <Stack
                padding={"10px 0"}
                direction={"row"}
                justifyContent={"space-between"}
              >
                <Stack direction={"row"} gap={"16px"} alignItems={"center"}>
                  <Stack
                    style={classes.sectionTitle}
                    direction={"row"}
                    alignItems={"center"}
                    gap={"10px"}
                  >
                    <span>{actionName}</span>
                    {source === EWorkSource.OUT && supplierId ? (
                      // <Stack
                      //   gap={"10px"}
                      //   direction={"row"}
                      //   onClick={(e) => e.stopPropagation()}
                      // >
                      //   <Divider orientation={"vertical"} flexItem color={"#000"} />
                      //   <GoMakeAutoComplate
                      //     key={supplierId + suppliers}
                      //     placeholder={t("materials.sheetPaper.selectSupplier")}
                      //     value={getSupplierId()}
                      //     style={{ width: "200px", }}
                      //     onChange={handleSupplierChange}
                      //     options={suppliersState?.map((s) => ({
                      //       value: s.supplierId,
                      //       label: s.supplierName,
                      //     }))}
                      //   />
                      // </Stack>
                      <>
                        <Divider
                          orientation={"vertical"}
                          flexItem
                          color={"#000"}
                        />

                        <span>{getSupplierId()}</span>
                        <Divider orientation={"vertical"} flexItem />
                      </>
                    ) : (
                      isNeedMachine && (
                        <>
                          <Divider
                            orientation={"vertical"}
                            flexItem
                            color={"#000"}
                          />
                          {!chooseMachine ? (
                            <Button
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
                              style={classes.sectionTitle}
                            >
                              {machineName != null ? (
                                <>
                                  {machineName?.length > 20
                                    ? machineName.slice(0, 20) + "..."
                                    : machineName}
                                </>
                              ) : (
                                <>Selecte New Machine</>
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
                                    "materials.inputs.selectMachine"
                                  )}
                                  style={{ height: "40px" }}
                                  value={contactsFilter}
                                  onChange={onMachinesInputChange}
                                  onClick={() => setOpenMachine(!openMachine)}
                                />
                                {!!openMachine && (
                                  <ClickOutside
                                    onClick={() => setOpenMachine(false)}
                                  >
                                    <Paper
                                      sx={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        right: 0,
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                        zIndex: 9999999999999999999,
                                      }}
                                    >
                                      {machinesList?.map((value, index) => {
                                        return (
                                          <MenuItem
                                            key={index}
                                            onClick={() =>
                                              onMachineClick(value, value.label)
                                            }
                                          >
                                            {value.label?.slice(0, 18) + "..."}
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
                              >
                                <ClearRoundedIcon />
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
                            style={classes.sectionTitle}
                          >
                            {employeeName ? (
                              employeeName
                            ) : (
                              <>Select New Employee</>
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
                                style={{ height: "40px" }}
                                value={contactsFilter}
                                onChange={onContactsInputChange}
                                onClick={() => setOpen(!open)}
                              />
                              {!!open && (
                                <ClickOutside onClick={() => setOpen(false)}>
                                  <Paper
                                    sx={{
                                      position: "absolute",
                                      top: "100%",
                                      left: 0,
                                      right: 0,
                                      maxHeight: "200px",
                                      overflowY: "auto",
                                      zIndex: 9999999999999999999,
                                    }}
                                  >
                                    {employeesList?.map((value, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          onClick={() =>
                                            onContactClick(value, value.label)
                                          }
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
                      <Divider orientation={"vertical"} flexItem />
                      <Stack
                        direction={"row"}
                        gap={"5px"}
                        alignItems={"center"}
                      >
                        <span style={classes.detailTitle}>
                          {t("productionFloor.timer")}
                        </span>
                        <ActionTimer
                          actionId={boardMissionActionId}
                          loading={timerLoading}
                          onToggle={onToggleTimer}
                          {...boardMissionActionTimer}
                        />
                      </Stack>
                      <Divider orientation={"vertical"} flexItem />
                      <Stack
                        direction={"row"}
                        gap={"5px"}
                        alignItems={"center"}
                      >
                        <span style={classes.detailTitle}>
                          {t("productionFloor.deliveryTime")}
                        </span>
                        <span style={classes.detailValue}>
                          {DateFormatterDDMMYYYY(
                            convertUtcToLocalIsoString(dueDate)
                          )}
                        </span>
                      </Stack>
                      <span style={classes.sourceLabel}>
                        {source === EWorkSource.OUT
                          ? t("pricingWidget.outSource")
                          : t("pricingWidget.inSource")}
                      </span>
                    </>
                  )}
                </Stack>
              </Stack>
              <Collapse
                in={isOpen}
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
                      gap={"16px"}
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
                        gap={"16px"}
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
            <PermissionCheck
              userPermission={
                Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
              }
            >
              {isEditable && !isHideTimeAndDate && (
                <div>
                  {loading ? (
                    <CircularProgress />
                  ) : isDone ? (
                    <Button
                      variant={"contained"}
                      onClick={(e) => {
                        e.stopPropagation();
                        onClickBackToProcess(boardMissionActionId).then();
                      }}
                      style={{
                        padding: "10px",
                        backgroundColor: "#FFF",
                        color: "#344054",
                        borderRadius: "16px",
                      }}
                    >
                      {t("boardMissions.completed")}
                    </Button>
                  ) : (
                    <PrimaryButton
                      variant={"contained"}
                      sx={{
                        height: "40px",
                        width: "40px",
                        minWidth: "40px",
                        padding: 0,
                        borderRadius: "12px",
                      }}
                      onClick={onClickOpenDoneModal}
                    >
                      <CheckIcon />
                    </PrimaryButton>
                  )}
                </div>
              )}
            </PermissionCheck>
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

export { BoardMissionsStationAction };
