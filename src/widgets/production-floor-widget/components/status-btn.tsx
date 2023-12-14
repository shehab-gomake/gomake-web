import Button from "@mui/material/Button";
import {useStyle} from "@/widgets/production-floor-widget/components/style";
import {useCallback, useState} from "react";
import {Menu} from "@mui/material";

import {useProductionFloorStatuses} from "@/widgets/production-floor-widget/hooks/use-production-floor-statuses";

interface IStatusBtnProps {
    id?: string;
    statusId: string;
    onChange?: (id: string, statusId: string) => void
}

const StatusBtn = ({statusId, id, onChange}: IStatusBtnProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
    const {statuses} = useProductionFloorStatuses();
    const {classes} = useStyle();
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onSelectNewStatus = (statusId: string) => {
        onChange(id, statusId);
        handleClose();
    }
    const boardStatus = useCallback(() => {
        return statuses()?.find(status => status.id === statusId);
    }, [statuses, statusId])

    return (
        <>
            <Button onClick={handleClick}
                    variant={!!anchorEl ? 'outlined' : 'contained'}
                    sx={!anchorEl ? {
                            ...classes.statusLabel,
                            ...classes.borderRadius,
                            backgroundColor: boardStatus()?.backgroundColor,
                            color: boardStatus()?.textColor,
                            display: 'inline',
                            width: 150,
                            height: 36,
                            '&:hover': {opacity: 0.7, backgroundColor: boardStatus()?.backgroundColor, color: boardStatus()?.textColor,}
                        } :
                        {
                            ...classes.borderRadius,
                            ...classes.statusLabel,
                            backgroundColor: "white",
                            color: 'red',
                            borderColor: 'red',
                            display: 'inline',
                            width: 150,
                            height: 36,
                            '&:hover': {opacity: 0.7, backgroundColor: boardStatus()?.backgroundColor, color: boardStatus()?.textColor,}

                        }}>
                {
                    boardStatus()?.name
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
                {
                    statuses()?.map(status => <Button sx={{
                        ...classes.statusLabel,
                        backgroundColor: status.backgroundColor,
                        color: status.textColor,
                        borderRadius: 0,
                        '&:hover': {opacity: 0.7, backgroundColor: status.backgroundColor, color: status.textColor,}
                    }}
                                                    onClick={() => onSelectNewStatus(status.id)}>{status.name}</Button>)
                }
            </Menu>
        </>
    );
}

export {StatusBtn}