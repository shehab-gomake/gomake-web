import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { stationGeneralInformationState } from "@/widgets/production-floor/views/board-missions-view/stations/state";
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

const GeneralInformationComponent = () => {
    const { t } = useTranslation();
    const data = useRecoilValue(stationGeneralInformationState);
    const { classes } = useStyle();
    const [openAddNoteModal, setOpenAddNoteModal] = useState<boolean>(false);

    return (
        data.length > 0 ?
            <Stack gap={'10px'}>
                <h3>{t("pricingWidget.generalInformation")}</h3>
                <Stack direction={'row'} gap={'16px'}>
                    {
                        data?.flatMap((parameter, index, array) => {
                            const key = `parameter-${index}`;
                            const parameterComponent = (
                                <Stack key={key} direction={'row'} gap={'10px'} alignItems={'center'}>
                                    <span style={classes.detailTitle}>{parameter.name}</span>
                                    {
                                        parameter.values?.map(value => (
                                            <span key={value} style={classes.detailValue}>{value}</span>
                                        ))
                                    }
                                </Stack>
                            );

                            /*if (parameter.name === "Cost") {
                                return (
                                    <PermissionCheck key={`permission-check-${key}`} userPermission={Permissions.SHOW_COSTS_IN_PRODUCTION_FLOOR}>
                                        {parameterComponent}
                                    </PermissionCheck>
                                );
                            }*/

                            const isLastElement = index >= array.length - 1;
                            return isLastElement
                                ? [parameterComponent]
                                : [parameterComponent, <Divider key={`divider-${key}`} orientation="vertical" flexItem />];
                        })
                    }
                    <PermissionCheck userPermission={Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR}>
                        <Divider flexItem orientation={'vertical'} />
                        <Button sx={classes.addNoteBtn} onClick={() => setOpenAddNoteModal(true)} variant={'outlined'} startIcon={<PlusIcon stroke={'#344054'} />}>{t('productionFloor.addNote')}</Button>
                    </PermissionCheck>
                </Stack>
                <BoardMissionsNotes />
                <BoardMissionsAddNote onClose={() => { setOpenAddNoteModal(false) }} openModal={openAddNoteModal} />
            </Stack> :
            <Skeleton height={'50px'} width={'50%'} />
    );
}

export { GeneralInformationComponent }