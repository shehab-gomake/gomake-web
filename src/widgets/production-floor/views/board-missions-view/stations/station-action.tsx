import {CircularProgress, Collapse, Fade} from "@mui/material";
import Stack from "@mui/material/Stack";
import {EWorkSource, HtmlElementType, RuleType} from "@/widgets/product-pricing-widget/enums";
import Divider from "@mui/material/Divider";
import {
    ParametersMapping
} from "@/widgets/product-pricing-widget/components/action/key-value-view";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import CheckIcon from "@mui/icons-material/Check";
import {useStyle} from "@/widgets/production-floor/views/board-missions-view/stations/style";
import CircleIcon from '@mui/icons-material/Circle';
import {PrimaryButton} from "@/components/button/primary-button";
import {IBoardMissionsStation} from "@/widgets/production-floor/views/board-missions-view/stations/interface";
import {DateFormatterDDMMYYYY} from "@/utils/adapter";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {
    cancelBoardMissionsActionDone, toggleBoardMissionsActionTimer,
    updateBoardMissionsActionDone
} from "@/services/api-service/production-floor/production-floor-endpoints";
import Button from "@mui/material/Button";
import {ActionTimer} from "@/widgets/production-floor/views/board-missions-view/stations/action-timer/action-timer";
import {useRecoilState} from "recoil";
import {boardMissionsDetailsState} from "@/widgets/production-floor/state/boards";
import {ThreeOptionsModal} from "@/components";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";

interface IProps extends IBoardMissionsStation {
    delay: number;
    selected?: boolean;
    isLastStation?: boolean;
}

const BoardMissionsStationAction = ({
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
                                        isLastStation
                                    }: IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {t} = useTranslation();
    const {classes} = useStyle();
    const {callApi} = useGomakeAxios();
    const {alertSuccessUpdate, alertFaultUpdate} = useSnackBar();
    const [openReadyModal, setIsReadyModal] = useState<boolean>(false)
    const [boardMissions] = useRecoilState(boardMissionsDetailsState);
    const [loading, setLoading] = useState<boolean>(false);
    const [timerLoading, setTimerLoading] = useState<boolean>(false);
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
    return (
        <>
            <Fade in={true} timeout={delay} style={{width: "100%", position: "relative"}}>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}
                       onClick={() => setIsOpen(!isOpen)}
                       style={{
                           ...classes.actionContainer,
                           backgroundColor: isDone ? '#EAECF0' : '#F9FAFB',
                           border: selected ? classes.actionContainerBorder : "unset",
                       }}>
                    <Stack>
                        <Stack padding={"10px 0"} direction={"row"} justifyContent={"space-between"}>
                            <Stack direction={"row"} gap={"16px"} alignItems={"center"}>
                                <Stack style={classes.sectionTitle} direction={"row"} alignItems={"center"}
                                       gap={"10px"}>
                                    <span>{actionName}</span>
                                    {source === EWorkSource.OUT ? (
                                        <>
                                            <Divider orientation={"vertical"} flexItem color={"#000"}/>
                                        </>
                                    ) : (
                                        machineName && (
                                            <>
                                                <Divider orientation={"vertical"} flexItem color={"#000"}/>
                                                <span>{machineName}</span>
                                            </>
                                        )
                                    )}
                                    {
                                        employeeName && <>
                                            <CircleIcon style={{width: '5px', height: '5px'}}/>
                                            <span>{employeeName}</span>
                                        </>
                                    }
                                </Stack>
                                <Divider orientation={"vertical"} flexItem/>
                                <Stack direction={'row'} gap={'5px'} alignItems={'center'}>
                                    <span style={classes.detailTitle}>Timer</span>
                                    <ActionTimer loading={timerLoading} onToggle={onToggleTimer} {...boardMissionActionTimer}/>
                                </Stack>
                                <Divider orientation={"vertical"} flexItem/>
                                <Stack direction={'row'} gap={'5px'} alignItems={'center'}>
                                    <span style={classes.detailTitle}>Delivery time</span>
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
                                    <Divider/>
                                    <Stack padding={"10px 0"} direction={"row"} gap={"16px"} flexWrap={"wrap"}
                                    >
                                        <ParametersMapping parameters={inputsParameters}/>
                                    </Stack>
                                </>
                            )}
                            {outputsParameters.length > 0 && source === EWorkSource.INTERNAL && (
                                <>
                                    <Divider/>
                                    <Stack padding={"10px 0"} direction={"row"} gap={"16px"} flexWrap={"wrap"}>
                                        <ParametersMapping source={source} parameters={outputsParameters}/>
                                    </Stack>
                                </>
                            )}
                        </Collapse>
                    </Stack>
                    <PermissionCheck userPermission={Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR}>
                    <div>
                        {
                            loading ? <CircularProgress/> :
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
                                        <CheckIcon/>
                                    </PrimaryButton>
                        }
                    </div>
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
                        insideStyle={{zIndex: 999999}}
                    />
                </Stack>
            </Fade>
        </>
    );
};

export {BoardMissionsStationAction}