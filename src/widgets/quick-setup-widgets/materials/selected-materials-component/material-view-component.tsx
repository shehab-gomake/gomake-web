import { IconButton, Stack} from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import {FONT_FAMILY} from "@/utils/font-family";

export interface IMaterialViewComponentProps {
    id: string;
    label: string;
    bgColor?: string;
    textColor?: string;
    onRemove: (id: string) => void
}

const MaterialViewComponent = ({
                                   bgColor = '#F89AD1',
                                   textColor = '#252675',
                                   label,
                                   onRemove,
                                   id
                               }: IMaterialViewComponentProps) => {
    return (
        <Stack width={'fit-content'} gap={'10px'} justifyContent={'space-between'} padding={'0 10px'} height={'22px'} alignItems={'center'}
               overflow={'hidden'} direction={'row'} style={{
            backgroundColor: bgColor,
            color: textColor,
            ...FONT_FAMILY.Inter(500, 12),
            borderRadius: 16
        }}>
            <span>{label}</span>
            <IconButton style={{
                display: 'flex',
                backgroundColor: bgColor,
                color: textColor,
                border: 0,
                padding: 0,
            }}
                        onClick={() => onRemove(id)}><ClearRoundedIcon
                style={{width: '15px', height: '15px'}}/></IconButton>
        </Stack>
    );
}

export {MaterialViewComponent}