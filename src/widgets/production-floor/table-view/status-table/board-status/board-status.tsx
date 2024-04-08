import {useCallback, useState} from "react";
import {Button, Menu} from "@mui/material";
import {FONT_FAMILY} from "@/utils/font-family";
import {useRecoilValue} from "recoil";
import {productionFloorStatusesState} from "@/widgets/production-floor/state/boards";

interface IStatusBtnProps {
    id?: string;
    statusId: string;
    onChange?: (id: string, statusId: string) => void
}

const BoardStatusComponent = ({statusId, id, onChange}: IStatusBtnProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
    const statuses = useRecoilValue(productionFloorStatusesState);
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
        return statuses?.find(status => status.id === statusId);
    }, [statuses, statusId])

    return (
        <>
            <Button onClick={handleClick}
                    variant={!!anchorEl ? 'outlined' : 'contained'}
                    sx={{
                            borderRadius: '4px',
                            backgroundColor: boardStatus()?.backgroundColor,
                            color: boardStatus()?.textColor,
                            display: 'inline',
                            width: 'fit-content',
                            minWidth: 150,
                            height: 36,
                            ...FONT_FAMILY.Lexend(500, 13),
                            '&:hover': {
                                opacity: 0.7,
                                backgroundColor: boardStatus()?.backgroundColor,
                                color: boardStatus()?.textColor,
                            }
                        }}>
                {
                    anchorEl ? 'select status' : boardStatus()?.name
                }
            </Button>
            <Menu
                closeAfterTransition={true}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    sx: {padding: 0, width: 150, minWidth: 'fit-content'}
                }}
            >
                {
                    statuses?.map(status => <Button sx={{
                        ...FONT_FAMILY.Lexend(500, 13),
                        width: '100%',
                        textTransform: 'capitalize',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        display: 'flex',
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

export {BoardStatusComponent}