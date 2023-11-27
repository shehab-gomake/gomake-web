import {useStatuses} from "@/widgets/production-floor-widget/production-statuses/use-statuses";
import {useEffect} from "react";
import Stack from "@mui/material/Stack";
import Checkbox, {CheckboxProps} from '@mui/material/Checkbox';
import {FormControlLabel} from "@mui/material";
import {useStyle} from "@/widgets/production-floor-widget/production-statuses/style";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import {EStatus} from "@/widgets/production-floor-widget/components/status-btn";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useStatusColor} from "@/widgets/production-floor-widget/production-statuses/use-status-color";

interface IStatusesButtonsProps {

}

interface ICheckboxProps extends CheckboxProps{
    status: EStatus;
}

const StyledCheckbox = styled(Checkbox)((props: ICheckboxProps) => {
    const {statusColor} = useStatusColor();

    return {
        color: statusColor(props.status, 500),
        padding: '0',
        '&.Mui-checked': {
            color: statusColor(props.status, 500),
        },
    }
})
const StatusesButtonsComponent = ({}: IStatusesButtonsProps) => {
    const {getStatuses, statuses, handleStatusChecked, isSelectedBoardMissions} = useStatuses();
    const {classes, statusColor} = useStyle()
    useEffect(() => {
        getStatuses().then();
    }, [])
    return (
        <Stack direction={'row'} gap={'10px'}>
            {
                statuses().map(status => {
                    return isSelectedBoardMissions() ?
                        <Button  sx={{...classes.container, ...statusColor(status.value)}}>{`move to ${status.text}`}</Button>: <FormControlLabel sx={{...classes.container, ...statusColor(status.value)}}
                                             control={<StyledCheckbox status={status.value} onChange={() => {
                                                 handleStatusChecked(status.value)
                                             }} checked={status.checked}/>}
                                             label={<div style={{
                                                 display: 'flex',
                                                 alignItems: 'center',
                                                 gap: '6px',
                                                 textTransform: 'capitalize',
                                                 padding: '0 6px'
                                             }}>
                                                 <span>{status.text}</span>
                                                 <span>{status.count}</span>
                                             </div>}/>
                })
            }
        </Stack>
    )
}
export {
    StatusesButtonsComponent
}