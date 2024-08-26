import {Stack} from "@mui/material";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useCallback} from "react";
import NotificationsNoneSharpIcon from '@mui/icons-material/NotificationsNoneSharp';
import HourglassBottomSharpIcon from '@mui/icons-material/HourglassBottomSharp';
import BlockIcon from '@mui/icons-material/Block';
interface IProps {
    fileStatus: 0 | 1 | 2;
}

const ApprovalFileStatusComponent = ({fileStatus}: IProps) => {
    const {errorColor, theme} = useGomakeTheme();
    const getColor = useCallback(() => {
        switch (fileStatus) {
            case 0:
                return '#EDC455';
            case 1:
                return '#05CF56'
            case 2:
                return errorColor(500);
        }
    }, [theme, fileStatus]);
    return <Stack width={'18px'} height={'15px'} alignItems={'center'} justifyContent={'center'} borderRadius={'11px'}
                  border={'1px solid' + getColor()}>
        {fileStatus === 0 && <HourglassBottomSharpIcon style={{color: getColor(), height: '12px', width: '15px'}}/>}
        {fileStatus === 1 && <NotificationsNoneSharpIcon style={{color: getColor(), height: '12px', width: '15px'}}/>}
        {fileStatus === 2 && <BlockIcon style={{color: getColor(), height: '12px', width: '15px'}}/>}
    </Stack>
}

export {ApprovalFileStatusComponent}