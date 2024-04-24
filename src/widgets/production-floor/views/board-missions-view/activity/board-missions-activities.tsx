import { Stack} from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import {GoMakeTextEditor} from "@/components/text-editor/go-make-text-editor";
import {
    useBoardMissionsActivities
} from "@/widgets/production-floor/views/board-missions-view/activity/use-board-missions-activities";
import {useEffect} from "react";
import {ActivityComponent} from "@/widgets/production-floor/views/board-missions-view/activity/activity-component";
import {convertHeightToVH} from "@/utils/adapter";


const BoardMissionsActivities = () => {
    const {
        getAllActivities,
        addComment,
        step,
        boardMissionsId,
        filtersButtonsArray,
        activitiesList
    } = useBoardMissionsActivities();

    useEffect(() => {
        if (step === 'activity') {
            getAllActivities().then();
        }
    }, [step, boardMissionsId])

    return (
        <Stack width={'40%'} gap={'25px'} height={'100%'}>
            <Stack direction={'row'} gap={'10px'} alignItems={'center'}>
                {
                    filtersButtonsArray?.map(btn => <Button onClick={btn.onClick} variant={'contained'} style={{
                        backgroundColor: btn.selected ? '#CBCBE4' : '#F2F4F7',
                        borderRadius: '16px',
                        color: btn.selected ? '#252675' : '#344054'
                    }}>{btn.name}</Button>)
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
                    activitiesList?.map(activity => <ActivityComponent {...activity}/>)
                }
            </div>
            <GoMakeTextEditor onSend={addComment} containerStyle={{marginTop: 'auto'}}/>
        </Stack>

    )
}

export {BoardMissionsActivities}