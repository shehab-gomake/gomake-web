import Stack from "@mui/material/Stack";
import { useRecoilState, useRecoilValue } from "recoil";
import {
    boardMissionsDetailsState,
    boardsMissionsState,
} from "@/widgets/production-floor/state/boards";
import { Avatar, Divider, IconButton, Skeleton, Tooltip } from "@mui/material";
import { useStyle } from "@/widgets/production-floor/views/board-missions-view/header/style"
import { DateFormatterDDMMYYYY } from "@/utils/adapter";
import TocIcon from '@mui/icons-material/Toc';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useRouter } from "next/router";
import { IBoardMissions, IBoardMissionsDetails } from "@/widgets/production-floor/interfaces/board-missions";

const HeaderTitleComponent = ({ title }: { title?: string }) => {
    const { classes } = useStyle();
    return <span style={classes.title}>{title}</span>
}
const HeaderDividerComponent = () => {
    const { classes } = useStyle()
    return <Divider orientation={'vertical'} style={classes.divider} flexItem />
}
const doneBoardMissionsColors = {
    color: '#66D671',
    bfColor: '#D9F5DC',
}
const BoardMissionsDetailsHeader = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const direction = t('direction');
    const [boardFromTable, setBoardFromTable] = useState<IBoardMissions>({} as IBoardMissions)
    const { push, query, pathname } = useRouter();
    const [boardMissionsDetails, setBoardMissionsDetails] = useRecoilState(boardMissionsDetailsState);
    useEffect(() => {
        setBoardMissionsDetails({} as IBoardMissionsDetails)
    }, [])
    const boards = useRecoilValue(boardsMissionsState);
    useEffect(() => {
        if (!!boardMissionsDetails?.boardMissionId && boards.length > 0) {
            const statusBoards = boards?.find(b => b.boardMissionStatus?.boardMissionStatus?.id === boardMissionsDetails.boardMissionStatus.id)?.boardMissions;
            setBoardFromTable(statusBoards?.find(bm => bm?.id === boardMissionsDetails?.boardMissionId));
        }
    }, [boards, boardMissionsDetails]);


    const onNavigateBoardMissions = (boardId, productType) => {
        push({
            pathname: pathname,
            query: { ...query, boardMissionsId: boardId, productType: productType }
        }, undefined, { shallow: true }).then();

    }
    const isLoading = !boardMissionsDetails?.boardMissionId; // Check if boardMissionId exists

    return (
        <>
            {isLoading ? (
                <Stack direction="row" justifyContent="space-between">
                    {/* Avatar Skeleton */}
                    <Stack direction="row" gap="14px" alignItems="center">
                        <Skeleton variant="rectangular" width={80} height={80} />

                        <Stack gap="10px">
                            {/* Skeleton for product/client names */}
                            <Skeleton variant="text" width={200} height={20} />
                            <Skeleton variant="text" width={150} height={20} />

                            <Stack direction="row" alignItems="center" gap="5px">
                                <Skeleton variant="text" width={100} height={20} />
                            </Stack>
                        </Stack>
                    </Stack>

                    {/* Navigation buttons Skeleton */}
                    <Stack direction="row" gap="10px" alignItems="center">
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="circular" width={40} height={40} />
                    </Stack>
                </Stack>
            ) : (
                <Stack direction={'row'} justifyContent={'space-between'}>
                    <Stack gap={'14px'} direction={'row'} alignItems={'center'}>
                        <Stack>
                            <Avatar
                                src={boardMissionsDetails?.boardMissionImage}
                                style={{ width: '80px', height: '80px', borderRadius: '8px' }}
                                variant={'square'}
                            >
                                <TocIcon style={{ width: '60px', height: '60px' }} />
                            </Avatar>
                        </Stack>
                        <Stack gap={'10px'}>
                            <Stack direction={'row'} alignItems={'center'} gap={'5px'}>
                                <HeaderTitleComponent title={boardMissionsDetails?.productName} />
                                <HeaderDividerComponent />
                                <HeaderTitleComponent title={boardMissionsDetails.clientName} />
                                <HeaderDividerComponent />
                                <HeaderTitleComponent
                                    title={`${boardMissionsDetails.boardMissionNumber}/${boardMissionsDetails.orderNumber}${!!boardMissionsDetails.productType ? '/' : ''}`}
                                />
                                <span style={classes.productType}>{boardMissionsDetails.sectionName}</span>
                            </Stack>
                            <Stack direction={'row'} alignItems={'center'} gap={'16px'}>
                                <span>{t('productionFloor.started')} {DateFormatterDDMMYYYY(boardMissionsDetails.createdDate?.toString())}</span>
                                <Divider flexItem orientation={'vertical'} />
                                <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
                                    <span style={classes.parameterLabel}>{t('productionFloor.status')}:</span>
                                    <Stack
                                        style={{ backgroundColor: boardMissionsDetails?.isReady ? doneBoardMissionsColors.bfColor : boardMissionsDetails?.boardMissionStatus?.backgroundColor }}
                                        padding={'0 5px'}
                                        direction={'row'}
                                        gap={'5px'}
                                        color={boardMissionsDetails?.isReady ? doneBoardMissionsColors.color : boardMissionsDetails?.boardMissionStatus?.textColor}
                                    >
                                        {
                                            boardMissionsDetails?.isReady ? <span>{t('boardMissions.done')}</span> : <>
                                                <span>{t(`productionStatuses.${boardMissionsDetails.boardMissionStatus?.name}`)}</span>
                                                <span>/</span>
                                                <span>{boardMissionsDetails.currentActionName}</span>
                                            </>
                                        }
                                    </Stack>
                                </Stack>
                                <Divider flexItem orientation={'vertical'} />
                                <Stack direction={'row'} gap={'5px'}>
                                    <span style={classes.parameterLabel}>{t('productionFloor.agent')}:</span>
                                    <span style={classes.parameterValue}>{boardMissionsDetails.agentName}</span>
                                </Stack>
                                <Divider flexItem orientation={'vertical'} />
                                <Stack direction={'row'} gap={'5px'}>
                                    <span style={classes.parameterLabel}>{t('login.email')}</span>
                                    <span
                                        style={classes.parameterValue}>{boardMissionsDetails.clientEmail}</span>
                                </Stack>

                                <Divider flexItem orientation={'vertical'} />
                                <Stack direction={'row'} gap={'5px'}>
                                    <span style={classes.parameterLabel}>{t('sales.quote.phone')}</span>
                                    <span
                                        style={classes.parameterValue}>{boardMissionsDetails.clientPhone}</span>
                                </Stack>
                                <Divider flexItem orientation={'vertical'} />
                                <Stack direction={'row'} gap={'5px'}>
                                    <span style={classes.parameterLabel}>{t('productionFloor.deliveredOn')}</span>
                                    <span
                                        style={classes.parameterValue}>{DateFormatterDDMMYYYY(boardMissionsDetails.dueDate)}</span>
                                </Stack>


                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack direction={'row'} gap={'10px'} alignItems={'center'}>
                        <Tooltip
                            title={`${boardFromTable?.previousBoardMission?.productName} |  ${boardFromTable?.previousBoardMission?.clientName} | ${boardFromTable?.previousBoardMission?.boardMissionNumber} / ${boardFromTable?.previousBoardMission?.orderNumber}`}
                            arrow
                        >
                            <IconButton
                                onClick={() =>
                                    onNavigateBoardMissions(
                                        boardFromTable?.previousBoardMission?.boardMissionId,
                                        boardFromTable?.previousBoardMission?.productType
                                    )
                                }
                                style={{ border: '1px solid' }}
                                color={'error'}
                                disabled={!boardFromTable?.previousBoardMission}
                            >
                                {direction === 'ltr' ? <NavigateBeforeIcon /> : <NavigateNextIcon />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title={`${boardFromTable?.nextBoardMission?.productName} |  ${boardFromTable?.nextBoardMission?.clientName} | ${boardFromTable?.nextBoardMission?.boardMissionNumber} / ${boardFromTable?.nextBoardMission?.orderNumber}`}
                            arrow
                        >
                            <IconButton
                                onClick={() =>
                                    onNavigateBoardMissions(
                                        boardFromTable?.nextBoardMission?.boardMissionId,
                                        boardFromTable?.nextBoardMission?.productType
                                    )
                                }
                                style={{ border: '1px solid' }}
                                color={'success'}
                                disabled={!boardFromTable?.nextBoardMission}
                            >
                                {direction === 'ltr' ? <NavigateNextIcon /> : <NavigateBeforeIcon />}
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>
            )}
        </>
    );
}
export { BoardMissionsDetailsHeader }