import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { stationGeneralInformationProductionFloorState, stationGeneralInformationState } from "@/widgets/production-floor/views/board-missions-view/stations/state";
import { Divider, Skeleton } from "@mui/material";
import { useStyle } from "@/widgets/production-floor/views/board-missions-view/stations/style";
import Button from "@mui/material/Button";
import { PlusIcon } from "@/icons";
import { BoardMissionsAddNote } from "@/widgets/production-floor/views/board-missions-view/stations/notes/add-note";
import {
    BoardMissionsNotes
} from "@/widgets/production-floor/views/board-missions-view/stations/notes/board-missions-notes";
import { useState } from "react";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { GeneralInformationDictionaryComponent } from "@/widgets/product-pricing-widget/components/general-information/general-information-dictionary-component";

const GeneralInformationComponent = () => {
    const { t } = useTranslation();
    const data = useRecoilValue(stationGeneralInformationState);
    const data2 = useRecoilValue(stationGeneralInformationProductionFloorState);

    const { classes } = useStyle();
    const [openAddNoteModal, setOpenAddNoteModal] = useState<boolean>(false);
    const [boardMissionsDetails, setBoardMissionsDetails] = useRecoilState(boardMissionsDetailsState);
    const isLoading = boardMissionsDetails?.boardMissionId;

    return (
        isLoading ?
            <Stack gap={'10px'}>
                <h3>{t("pricingWidget.generalInformation")}</h3>
                <Stack direction={'row'} gap={'16px'} flexWrap={'wrap'}>
                    {
                        data?.flatMap((parameter, index, array) => {
                            const key = `parameter-${index}`;
                            const parameterComponent = (
                                <Stack key={key} direction={'row'} gap={'10px'} alignItems={'center'}>
                                    <span style={classes.detailTitle}>{parameter.name}</span>
                                    {
                                        parameter.values?.map(value => (
                                            <span key={value} style={classes.detailValue}>{!!parameter.defaultUnit ? `${value} ${parameter.defaultUnit}` : value}</span>
                                        ))
                                    }
                                </Stack>
                            );
                            const isLastElement = index >= array.length - 1;

                            if (parameter?.unitType === 2) {
                                return (
                                    <PermissionCheck userPermission={Permissions.SHOW_COSTS_IN_PRODUCTION_FLOOR}>
                                        {
                                            isLastElement
                                                ? [parameterComponent]
                                                : [parameterComponent, <Divider key={`divider-${key}`} orientation="vertical" flexItem />]
                                        }
                                    </PermissionCheck>
                                );
                            }
                            else {
                                return isLastElement
                                    ? [parameterComponent]
                                    : [parameterComponent, <Divider key={`divider-${key}`} orientation="vertical" flexItem />];
                            }

                        })
                    }

                </Stack>
                <GeneralInformationDictionaryComponent details2={data2} /> <PermissionCheck userPermission={Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR}>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 16 }}>
                        <h4 style={{ textTransform: 'uppercase' }}>{t('productionFloor.notes')}</h4>
                        <Button sx={classes.addNoteBtn} onClick={() => setOpenAddNoteModal(true)} variant={'outlined'} startIcon={<PlusIcon stroke={'#344054'} />}>{t('productionFloor.addNote')}</Button>

                    </div>
                </PermissionCheck>
                <BoardMissionsNotes />
                <BoardMissionsAddNote onClose={() => { setOpenAddNoteModal(false) }} openModal={openAddNoteModal} />
            </Stack> :
            <Stack gap={'10px'}>
                <Skeleton variant="text" width={200} height={30} /> {/* Skeleton for "General Information" title */}
                <Stack direction={'row'} gap={'16px'} alignItems={'center'}>
                    {/* Skeleton for parameter names and values */}
                    {Array(3).fill(null).map((_, index) => (
                        <Stack key={index} direction={'row'} gap={'10px'} alignItems={'center'}>
                            <Skeleton variant="text" width={100} height={20} /> {/* Parameter Name Skeleton */}
                            <Skeleton variant="text" width={50} height={20} />  {/* Parameter Value Skeleton */}
                            {index < 2 && <Divider orientation="vertical" flexItem />} {/* Divider Skeleton */}
                        </Stack>
                    ))}
                    {/* Skeleton for Add Note Button */}
                    <Divider flexItem orientation={'vertical'} />
                    <Skeleton variant="rectangular" width={150} height={40} /> {/* Button Skeleton */}
                </Stack>
                <Skeleton variant="rectangular" width="100%" height={150} /> {/* Notes Section Skeleton */}
            </Stack>
    );
}

export { GeneralInformationComponent }