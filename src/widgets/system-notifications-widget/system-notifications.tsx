import {Badge, IconButton, Stack} from "@mui/material";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useState} from "react";
import {useGomakeAxios} from "@/hooks";
import {GoMakeMenu} from "@/components";

const SystemNotifications = () => {
    const {primaryColor} = useGomakeTheme();
    const {} = useGomakeAxios();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handelClick = async (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    };

    const list = [
        {status: 1, text: 'notification 1'},
        {status: 2, text: 'notification 2'},
        {status: 3, text: 'notification 3'},
        {status: 1, text: 'notification 4'},
        {status: 1, text: 'notification 5'},
        {status: 2, text: 'notification 6'},
        {status: 1, text: 'notification 7'},
    ]
    return (
        <Badge style={{padding: "2px"}} badgeContent={0} color={'warning'} invisible={true}>
            <IconButton style={{padding: "5px", backgroundColor: primaryColor(300)}}
                        onClick={handelClick}>
                <NotificationsNoneOutlinedIcon style={{color: '#FFF', width: 16, height: 16}}/>
            </IconButton>
            <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
                <Stack width={'450px'} padding={'10px'} height={'550px'}>
                    <Stack>
                        {
                            list.map(item => <Stack direction={'row'} alignItems={'center'} gap={'10px'}>
                                <div>{item.status}</div>
                                <div>{item.text}</div>
                            </Stack>)
                        }
                    </Stack>
                </Stack>
            </GoMakeMenu>
        </Badge>
    );
}
export {SystemNotifications}