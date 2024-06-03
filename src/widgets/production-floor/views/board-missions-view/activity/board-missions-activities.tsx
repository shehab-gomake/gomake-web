import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import { GoMakeTextEditor } from "@/components/text-editor/go-make-text-editor";
import {
    useBoardMissionsActivities
} from "@/widgets/production-floor/views/board-missions-view/activity/use-board-missions-activities";
import {ActivityComponent} from "@/widgets/production-floor/views/board-missions-view/activity/activity-component";
import {convertHeightToVH} from "@/utils/adapter";
import {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {DotsLoader} from "@/components/dots-loader/dots-Loader";


const BoardMissionsActivities = () => {
    const {t} = useTranslation();
    const loaderRef = useRef(null);
    const lastActivityRef = useRef(null);
    const {
        addComment,
        filtersButtonsArray,
        activitiesList,
        getAllActivities,
        addActivityLoader
    } = useBoardMissionsActivities();
    console.log("activitiesList", activitiesList)
    useEffect(() => {
        if (addActivityLoader && loaderRef.current) {
            loaderRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [addActivityLoader])

    useEffect(() => {
        getAllActivities().then();
    }, []);

    useEffect(() => {
        if (lastActivityRef && lastActivityRef.current) {
            lastActivityRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [activitiesList])
    return (
        <Stack  width={'40%'} gap={'25px'} maxHeight={'700px'} overflow={'hidden'}>
            <Stack direction={'row'} gap={'10px'} alignItems={'center'}>
                {
                    filtersButtonsArray?.map(btn => <Button onClick={btn.onClick} variant={'contained'} style={{
                        backgroundColor: btn.selected ? '#CBCBE4' : '#F2F4F7',
                        borderRadius: '16px',
                        color: btn.selected ? '#252675' : '#344054'
                    }}>{t(btn.name)}</Button>)
                }
            </Stack>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                overflow: 'auto',
                height: convertHeightToVH(650)
            }}>
                {
                    activitiesList?.length > 0 && activitiesList?.map((activity, index) => <div key={'activity' + index}
                                                                                                ref={index + 1 === activitiesList.length ? lastActivityRef : undefined}>
                        <ActivityComponent {...activity}/></div>)
                }
                {
                    addActivityLoader &&
                    <Stack ref={loaderRef} height={'60px'} alignItems={'center'} justifyContent={'center'}><DotsLoader/></Stack>
                }
            </div>
            <GoMakeTextEditor onSend={addComment} containerStyle={{ marginTop: 'auto' }} />
        </Stack>

    )
}

export { BoardMissionsActivities }