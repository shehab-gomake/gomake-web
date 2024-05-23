import Stack from "@mui/material/Stack";
import {useTranslation} from "react-i18next";
import {useRecoilValue} from "recoil";
import {stationGeneralInformationState} from "@/widgets/production-floor/views/board-missions-view/stations/state";
import {Divider, Skeleton} from "@mui/material";
import {useStyle} from "@/widgets/production-floor/views/board-missions-view/stations/style";
import Button from "@mui/material/Button";
import {PlusIcon} from "@/icons";
import {BoardMissionsAddNote} from "@/widgets/production-floor/views/board-missions-view/stations/notes/add-note";
import {
    BoardMissionsNotes
} from "@/widgets/production-floor/views/board-missions-view/stations/notes/board-missions-notes";
import {useEffect, useState} from "react";

const GeneralInformationComponent = () => {
    const {t} = useTranslation();
    const data = useRecoilValue(stationGeneralInformationState);
    const {classes} = useStyle();
    const [openAddNoteModal, setOpenAddNoteModal] = useState<boolean>(false);
    useEffect(() => {console.log(data)}, [data])
    return (
        data.length > 0 ?
        <Stack gap={'10px'}>
            <h3>{t("pricingWidget.generalInformation")}</h3>
            <Stack direction={'row'} gap={'16px'}>
                {
                    data?.flatMap((parameter, index, array) => {
                        return index < array.length - 1 ? [<Stack direction={'row'} gap={'10px'} alignItems={'center'}>
                            <span style={classes.detailTitle}>{parameter.name}</span>
                            {
                                parameter.values?.map(value => <span style={classes.detailValue}>{value}</span>)
                            }

                        </Stack>,
                            <Divider orientation={'vertical'} flexItem/>] : [
                            <Stack direction={'row'} gap={'10px'} alignItems={'center'}>
                                <span style={classes.detailTitle}>{parameter.name}</span>
                                {
                                    parameter?.values?.map(value => <span style={classes.detailValue}>{value}</span>)
                                }

                            </Stack>]
                    })


                }
                <Divider flexItem orientation={'vertical'}/>
                <Button style={classes.addNoteBtn} onClick={()=>setOpenAddNoteModal(true)} variant={'outlined'} startIcon={<PlusIcon stroke={'#344054'}/>}>{t('productionFloor.addNote')}</Button>
            </Stack>
            <BoardMissionsNotes/>
            <BoardMissionsAddNote onClose={()=>{setOpenAddNoteModal(false)}} openModal={openAddNoteModal}/>
        </Stack> :
            <Skeleton height={'50px'} width={'50%'}/>
    );
}

export {GeneralInformationComponent}