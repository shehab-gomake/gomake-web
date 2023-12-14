import {useProductionFloorStatuses} from "@/widgets/production-floor-widget/hooks/use-production-floor-statuses";
import Stack from "@mui/material/Stack";
import Checkbox, {CheckboxProps} from '@mui/material/Checkbox';
import {FormControlLabel} from "@mui/material";
import {useStyle} from "@/widgets/production-floor-widget/production-statuses/style";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import {useTranslation} from "react-i18next";

const StyledCheckbox = styled(Checkbox)((props: CheckboxProps) => {
    return {
        color: props.style.color,
        padding: '0',
        '&.Mui-checked': {
            color: props.style.color,
        },
    }
})
const StatusesButtonsComponent = () => {
    const {statuses, handleStatusChecked, isSelectedBoardMissions, onChangeBoardsStatus} = useProductionFloorStatuses();
    const {classes} = useStyle();
    const {t} = useTranslation();
    return (
        <Stack direction={'row'} gap={'10px'}>
            {
                statuses().map(status => {
                    return isSelectedBoardMissions() ?
                        <Button onClick={() => onChangeBoardsStatus(status.id)} sx={{
                            ...classes.container,
                            backgroundColor: status.backgroundColor,
                            color: status.textColor,
                            '&:hover': {
                                opacity: 0.7,
                                backgroundColor: status?.backgroundColor,
                                color: status?.textColor,
                            }
                        }}>{`${t('moveTo')} ${status.name}`}</Button>
                        :
                        <FormControlLabel sx={{
                            ...classes.container,
                            backgroundColor: status.backgroundColor,
                            color: status.textColor
                        }} control={<StyledCheckbox
                            style={{color: status.textColor}}
                            onChange={() => {
                                handleStatusChecked(status.id)
                            }} checked={status.checked}/>}
                                          label={<div style={classes.labelContainer}>
                                              <span>{status.name}</span>
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