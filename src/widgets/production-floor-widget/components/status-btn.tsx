import Button from "@mui/material/Button";
import {useStyle} from "@/widgets/production-floor-widget/components/style";
import {useState} from "react";
import {Menu, MenuItem} from "@mui/material";

export enum EStatus {
    NOT_YET = '1',
    IN_PROCESS = '2',
    DONE = '3',
    STUCK = '4',
    WAITING = '5'
}

interface IStatusBtnProps {
    id?: string;
    status: EStatus;
    onChange?: (id: string, status: EStatus) => void
}

const StatusBtn = ({status, id, onChange}: IStatusBtnProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onSelectNewStatus = (status: EStatus) => {
        onChange(id, status);
        handleClose();
    }
    const {classes} = useStyle();
    return (
        <>
            <Button onClick={handleClick}
                    variant={!!anchorEl ? 'outlined' : 'contained'}
                    sx={!anchorEl ? {...classes.statusLabel,
                        ...classes.statusLabelBg[status],
                        ...classes.borderRadius,
                        display: 'inline',
                        width: 150,
                         height: 36}: {
                        ...classes.borderRadius,
                        ...classes.statusLabel,
                        backgroundColor: "white",
                        color: 'red',
                        borderColor: 'red',
                        display: 'inline',
                        width: 150,
                        height: 36
                    }}>
                {
                     !!anchorEl ? 'select status' :status === EStatus.IN_PROCESS ? 'in proccess' :
                        status === EStatus.WAITING ? 'waiting' :
                            status === EStatus.STUCK ? 'Stuck' :
                                status === EStatus.DONE ? 'Done' : ''
                }
            </Button>
                <Menu
                    closeAfterTransition={true}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        sx: {width: anchorEl?.offsetWidth, padding: 0}
                    }}
                >
                    <Button sx={{...classes.statusLabel, ...classes.statusLabelBg[EStatus.WAITING], borderRadius: 0}}
                            onClick={() => onSelectNewStatus(EStatus.WAITING)}>waiting</Button>
                    <Button sx={{...classes.statusLabel, ...classes.statusLabelBg[EStatus.IN_PROCESS], borderRadius: 0}}
                            onClick={() => onSelectNewStatus(EStatus.IN_PROCESS)}>in process</Button>
                    <Button sx={{...classes.statusLabel, ...classes.statusLabelBg[EStatus.DONE], borderRadius: 0}}
                            onClick={() => onSelectNewStatus(EStatus.DONE)}>done</Button>
                    <Button sx={{...classes.statusLabel, ...classes.statusLabelBg[EStatus.STUCK], borderRadius: 0}}
                            onClick={() => onSelectNewStatus(EStatus.STUCK)}>stuck</Button>
                </Menu>
        </>
    );
}

export {StatusBtn}