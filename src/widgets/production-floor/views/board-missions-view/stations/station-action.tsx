import { CircularProgress, Collapse, Fade, IconButton, MenuItem, Paper } from "@mui/material";
import Stack from "@mui/material/Stack";
import { EWorkSource, HtmlElementType, RuleType } from "@/widgets/product-pricing-widget/enums";
import Divider from "@mui/material/Divider";
import {
    ParametersMapping,
    TextAreaActionsMapping
} from "@/widgets/product-pricing-widget/components/action/key-value-view";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CheckIcon from "@mui/icons-material/Check";
import { useStyle } from "@/widgets/production-floor/views/board-missions-view/stations/style";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { PrimaryButton } from "@/components/button/primary-button";
import { IBoardMissionsStation } from "@/widgets/production-floor/views/board-missions-view/stations/interface";
import { DateFormatterDDMMYYYY } from "@/utils/adapter";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
    cancelBoardMissionsActionDone, toggleBoardMissionsActionTimer,
    updateBoardMissionsActionDone
} from "@/services/api-service/production-floor/production-floor-endpoints";
import Button from "@mui/material/Button";
import { ActionTimer } from "@/widgets/production-floor/views/board-missions-view/stations/action-timer/action-timer";
import { useRecoilState } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { GoMakeAutoComplate, GomakeTextInput, ThreeOptionsModal } from "@/components";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { useBoardMissionsUpdatedOutputs } from "./use-board-missions-updated-outputs";
import { backgroundClip } from "html2canvas/dist/types/css/property-descriptors/background-clip";
import { ClickOutside } from "@/components/click-out-side/click-out-side";

interface IProps extends IBoardMissionsStation {
    delay: number;
    selected?: boolean;
    isLastStation?: boolean;
}

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
}: IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { callApi } = useGomakeAxios();
    const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
    const [openReadyModal, setIsReadyModal] = useState<boolean>(false)
    const [boardMissions] = useRecoilState(boardMissionsDetailsState);
    const [loading, setLoading] = useState<boolean>(false);
    const [timerLoading, setTimerLoading] = useState<boolean>(false);

    const [chooseMachine, setChooseMachine] = useState<boolean>(false);
    const [chooseMaterial, setChooseMaterial] = useState<boolean>(false);
    const [chooseEmployee, setChooseEmployee] = useState<boolean>(false);

    const {
        employeesList,
        machinesList,
        materialsList,
        onClickGetEmployeeForAction,
        onClickGetMachineForAction,
        onClickGetMaterialsForAction
    } = useBoardMissionsUpdatedOutputs()

    const inputsParameters = outputs.filter(
        (parameter) =>
            parameter.propertyType === RuleType.PARAMETER &&
            parameter.htmlElementType === HtmlElementType.TEXT
    );
    const outputsParameters = outputs.filter(
        (parameter) =>
            parameter.propertyType === RuleType.OUTPUT &&
            parameter.htmlElementType === HtmlElementType.TEXT
    );
    const textAreaOutputs = outputs?.filter(
        (parameter) =>
            parameter.propertyType === RuleType.OUTPUT &&
            parameter.htmlElementType === HtmlElementType.TEXT_AREA
    );
    const onClickDone = async (boardMissionsActionId: string, sendMSg?: boolean) => {
        setLoading(true);
        const callBack = (res) => {
            setLoading(false);
            if (res.success) {
                alertSuccessUpdate();
            } else {
                alertFaultUpdate()
                setLoading(false);
            }
        }
        await updateBoardMissionsActionDone(callApi, callBack, {
            boardMissionsActionId: boardMissionsActionId,
            productType: boardMissions.productType,
            isSendMessage: !!sendMSg
        });
    }
    const onClickBackToProcess = async (boardMissionsActionId: string) => {
        setLoading(true);
        const callBack = (res) => {
            setLoading(false);
            if (res.success) {
                alertSuccessUpdate()
            } else {
                alertFaultUpdate();
            }
        }
        await cancelBoardMissionsActionDone(callApi, callBack, {
            boardMissionsActionId: boardMissionsActionId,
            productType: boardMissions.productType
        });
    }

    const onToggleTimer = async () => {
        setTimerLoading(true)
        const callBack = (res) => {
            setTimerLoading(false);
            if (res.success) {
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        }
        await toggleBoardMissionsActionTimer(callApi, callBack, {
            boardMissionsActionId: boardMissionActionId,
            productType: boardMissions.productType
        });
    }

    useEffect(() => {
        setIsOpen(!!selected)
    }, [selected])

    const [open, setOpen] = useState<boolean>(false);
    const [contactsFilter, setContactsFilter] = useState<string>('');
    const [selectedContact, setSelectedContacts] = useState({});


    const onContactsInputChange = (e) => {
        setOpen(true)
        setContactsFilter(e.target.value);
    }
    const onContactClick = (value: any) => {
        setSelectedContacts(value);
        setContactsFilter(value.label);
        setOpen(false)
        setChooseEmployee(false);
    }
    return (
        <>
            <Fade in={true} timeout={delay} style={{ width: "100%", position: "relative", zIndex: 999999999999999999999999999999 }}>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        ...classes.actionContainer,
                        backgroundColor: isDone ? '#EAECF0' : '#F9FAFB',
                        border: selected ? classes.actionContainerBorder : "unset",
                    }}>
                    <Stack >
                        <Stack padding={"10px 0"} direction={"row"} justifyContent={"space-between"} >
                            <Stack direction={"row"} gap={"16px"} alignItems={"center"}>
                                <Stack style={classes.sectionTitle} direction={"row"} alignItems={"center"}
                                    gap={"10px"}>
                                    <span>{actionName}</span>
                                    {source === EWorkSource.OUT ? (
                                        <>
                                            <Divider orientation={"vertical"} flexItem color={"#000"} />
                                        </>
                                    ) : (
                                        isNeedMachine && (
                                            <>
                                                <Divider orientation={"vertical"} flexItem color={"#000"} />
                                                {!chooseMachine ? (
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setChooseMachine(true);
                                                            onClickGetMachineForAction(actionId)
                                                        }}
                                                        variant={"text"}
                                                        style={classes.sectionTitle}
                                                    >
                                                        {
                                                            machineName != null ? <>
                                                                {machineName?.length > 20
                                                                    ? machineName.slice(0, 20) + "..."
                                                                    : machineName}
                                                            </> : <>
                                                                Selecte New Machine
                                                            </>
                                                        }

                                                    </Button>
                                                ) : (
                                                    <Stack
                                                        direction={"row"}
                                                        gap={"5px"}
                                                        alignItems={"center"}
                                                        onClick={(e) => e.stopPropagation()}

                                                    >
                                                        <GoMakeAutoComplate
                                                            onChange={(e, v) => {
                                                                console.log("dsfdsfds")
                                                                // setChooseMachine(false);
                                                            }}
                                                            style={{ width: "200px" }}
                                                            options={machinesList}
                                                            placeholder={"Choose machine"}
                                                            value={machineName}
                                                        />
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
                                    {
                                        isNeedEmployee && (
                                            <>
                                                {!chooseEmployee ? (
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setChooseEmployee(true);
                                                            onClickGetEmployeeForAction(actionId)
                                                        }}
                                                        variant={"text"}
                                                        style={classes.sectionTitle}
                                                    >
                                                        {employeeName ? employeeName : <>Select New Employee</>}
                                                    </Button>
                                                ) : (
                                                    <Stack
                                                        direction={"row"}
                                                        gap={"5px"}
                                                        alignItems={"center"}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div style={{ position: 'relative' }}>
                                                            <GomakeTextInput placeholder={t('prePayment.selectContact')} style={{ height: '40px' }} value={contactsFilter}
                                                                onChange={onContactsInputChange}
                                                                onClick={() => setOpen(!open)} />
                                                            {
                                                                !!open && <ClickOutside onClick={() => setOpen(false)}>
                                                                    <Paper sx={{ position: 'absolute', top: '100%', left: 0, right: 0 }}>
                                                                        {
                                                                            (!!contactsFilter
                                                                                ? employeesList?.filter(value =>
                                                                                    value.label?.toLowerCase()?.includes(contactsFilter?.toLowerCase())
                                                                                )
                                                                                : employeesList
                                                                            )?.map((value, index) => {
                                                                                return (
                                                                                    <MenuItem key={index} onClick={() => onContactClick(value)}>
                                                                                        {value.label}
                                                                                    </MenuItem>
                                                                                );
                                                                            })
                                                                        }
                                                                    </Paper>
                                                                </ClickOutside>
                                                            }
                                                        </div>
                                                        {/* <GoMakeAutoComplate
                                                            onChange={(e, v) => {
                                                                console.log("change", v)
                                                                // updateWorkFlowForEmployees(actionId, productType, actionIndex, v?.label, v?.value, id)
                                                                setChooseEmployee(false);
                                                            }}
                                                            style={{ width: "200px" }}
                                                            options={employeesList}
                                                            placeholder={"Choose Employee"}
                                                            value={employeeName}

                                                        /> */}
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
                                        )
                                    }
                                    {/* {
                                        employeeName && <>
                                            <CircleIcon style={{ width: '5px', height: '5px' }} />
                                            <span>{employeeName}</span>
                                        </>
                                    } */}
                                </Stack>
                                <Divider orientation={"vertical"} flexItem />
                                <Stack direction={'row'} gap={'5px'} alignItems={'center'}>
                                    <span style={classes.detailTitle}>{t("productionFloor.timer")}</span>
                                    <ActionTimer actionId={boardMissionActionId} loading={timerLoading}
                                        onToggle={onToggleTimer} {...boardMissionActionTimer} />
                                </Stack>
                                <Divider orientation={"vertical"} flexItem />
                                <Stack direction={'row'} gap={'5px'} alignItems={'center'}>
                                    <span style={classes.detailTitle}>{t("productionFloor.deliveryTime")}</span>
                                    <span style={classes.detailValue}>{DateFormatterDDMMYYYY(dueDate)}</span>
                                </Stack>
                                <span style={classes.sourceLabel}>
                                    {
                                        source === EWorkSource.OUT
                                            ? t("pricingWidget.outSource")
                                            : t("pricingWidget.inSource")
                                    }
                                </span>
                            </Stack>
                        </Stack>
                        <Collapse in={isOpen} collapsedSize={0} orientation={"vertical"}
                            onClick={(e) => e.stopPropagation()}>
                            {inputsParameters.length > 0 && (
                                <>
                                    <Divider />
                                    <Stack padding={"10px 0"} direction={"row"} gap={"16px"} flexWrap={"wrap"}
                                    >
                                        <ParametersMapping parameters={inputsParameters} isProductionFloor={true} />
                                    </Stack>
                                </>
                            )}
                            {outputsParameters.length > 0 && source === EWorkSource.INTERNAL && (
                                <>
                                    <Divider />
                                    <Stack padding={"10px 0"} direction={"row"} gap={"16px"} flexWrap={"wrap"}>
                                        <ParametersMapping source={source} parameters={outputsParameters}
                                            isProductionFloor={true} />
                                        <TextAreaActionsMapping
                                            parameters={textAreaOutputs}
                                            actionId={id}
                                            orderItemId={boardMissions?.orderItemId}
                                            productType={boardMissions.productType}
                                        />
                                    </Stack>

                                </>
                            )}
                        </Collapse>
                    </Stack>
                    <PermissionCheck userPermission={Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR}>
                        {
                            isEditable &&
                            <div>
                                {
                                    loading ? <CircularProgress /> :
                                        isDone ?
                                            <Button variant={'contained'} onClick={(e) => {
                                                e.stopPropagation();
                                                onClickBackToProcess(boardMissionActionId).then()
                                            }}
                                                style={{
                                                    padding: '10px',
                                                    backgroundColor: '#FFF',
                                                    color: '#344054',
                                                    borderRadius: '16px'
                                                }}>
                                                {t("boardMissions.completed")}
                                            </Button> :
                                            <PrimaryButton variant={'contained'} sx={{
                                                height: '40px',
                                                width: '40px',
                                                minWidth: '40px',
                                                padding: 0,
                                                borderRadius: '12px'
                                            }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (isLastStation) {
                                                        setIsReadyModal(true)
                                                    } else {
                                                        onClickDone(boardMissionActionId).then()
                                                    }
                                                }}>
                                                <CheckIcon />
                                            </PrimaryButton>
                                }
                            </div>
                        }
                    </PermissionCheck>
                    <ThreeOptionsModal
                        title={t("boardMissions.markDoneModalTitle")}
                        subTitle={t("boardMissions.markDoneModalSubTitle")}
                        yesBtn={"boardMissions.markDoneModalYes"}
                        noBtn={"boardMissions.markDoneModalNo"}
                        openModal={openReadyModal}
                        onClose={() => setIsReadyModal(false)}
                        onClickYes={() => onClickDone(boardMissionActionId, true)}
                        onClickNo={() => onClickDone(boardMissionActionId, false)}
                        insideStyle={{ zIndex: 999999 }}
                    />
                </Stack>
            </Fade>
        </>
    );
};

export { BoardMissionsStationAction }