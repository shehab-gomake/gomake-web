import {Collapse, Fade} from "@mui/material";
import Stack from "@mui/material/Stack";
import {EWorkSource, HtmlElementType, RuleType} from "@/widgets/product-pricing-widget/enums";
import Divider from "@mui/material/Divider";
import {
    ParametersMapping
} from "@/widgets/product-pricing-widget/components/action/key-value-view";
import {useState} from "react";
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
import {boardMissionsStationsState} from "@/widgets/production-floor/views/board-missions-view/stations/state";

interface IProps extends IBoardMissionsStation {
    delay: number
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
                                        boardMissionActionTimer
                                    }: IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {t} = useTranslation();
    const {classes} = useStyle();
    const {callApi} = useGomakeAxios();
    const [stations, setStations] = useRecoilState(boardMissionsStationsState);
    const {alertSuccessUpdate, alertFaultUpdate} = useSnackBar();
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

    const onClickDone = async (boardMissionsActionId: string) => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessUpdate();
                setStations(stations?.map(station => station.boardMissionActionId === boardMissionActionId ? {
                    ...station,
                    isDone: true
                } : station))
            } else {
                alertFaultUpdate()
            }
        }
        await updateBoardMissionsActionDone(callApi, callBack, boardMissionsActionId);
    }
    const onClickBackToProcess = async (boardMissionsActionId: string) => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessUpdate()
                setStations(stations?.map(station => station.boardMissionActionId === boardMissionActionId ? {
                    ...station,
                    isDone: false
                } : station))
            } else {
                alertFaultUpdate()
            }
        }
        await cancelBoardMissionsActionDone(callApi, callBack, boardMissionsActionId);
    }

    const onToggleTimer = async () => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessUpdate()
                setStations(stations?.map(station => station.boardMissionActionId === boardMissionActionId ? {
                    ...station,
                    boardMissionActionTimer: {
                        ...station.boardMissionActionTimer,
                        isTimerRunning: !station.boardMissionActionTimer?.isTimerRunning
                    }
                } : station))
            } else {
                alertFaultUpdate()
            }
        }
        await toggleBoardMissionsActionTimer(callApi, callBack, boardMissionActionId);
    }

    return (
        <Fade in={true} timeout={delay} style={{width: "100%", position: "relative"}}>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}
                   onClick={() => setIsOpen(!isOpen)}
                   style={{
                       ...classes.actionContainer,
                       backgroundColor: isDone ? '#EAECF0' : '#F9FAFB',
                       border: isOpen ? classes.actionContainerBorder : "unset",
                   }}>
                <Stack>
                    <Stack padding={"10px 0"} direction={"row"} justifyContent={"space-between"}>
                        <Stack direction={"row"} gap={"16px"} alignItems={"center"}>
                            <Stack style={classes.sectionTitle} direction={"row"} alignItems={"center"} gap={"10px"}>
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
                                <ActionTimer onToggle={onToggleTimer} {...boardMissionActionTimer}/>
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
                <div>
                    {
                        isDone ?
                            <Button variant={'contained'} onClick={(e) => {
                                e.stopPropagation();
                                onClickBackToProcess(boardMissionActionId).then()
                            }}
                                    style={{padding: '10px', backgroundColor: '#FFF', color: '#344054'}}>
                                Completed
                            </Button> :
                            <PrimaryButton variant={'contained'} style={{height: '40px', width: '40px'}}
                                           onClick={(e) => {
                                               e.stopPropagation();
                                               onClickDone(boardMissionActionId).then()
                                           }}>
                                <CheckIcon/>
                            </PrimaryButton>
                    }
                </div>
            </Stack>
        </Fade>
    );
};

export {BoardMissionsStationAction}