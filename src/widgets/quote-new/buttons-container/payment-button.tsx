import Button from "@mui/material/Button";
//import { useStyle } from "@/widgets/production-floor-widget/components/style";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { GomakePrimaryButton } from "@/components";
import { CreditCardIcon } from "@/icons/credit-card-icon";
import { FONT_FAMILY } from "@/utils/font-family";
import { useStyle } from "./style";

export enum EStatus {
    NOT_YET = '1',
    IN_PROCESS = '2',
    DONE = '3',
    STUCK = '4',
    WAITING = '5'
}


const StatusBtn = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onSelectPaymentMethod = (paymentMethod: string) => {
        console.log(paymentMethod);
        handleClose();
    }
    const { classes } = useStyle();
    return (
        <>
            <GomakePrimaryButton

                leftIcon={<CreditCardIcon color={"#344054"} />}
                onClick={handleClick}
                // variant={!!anchorEl ? 'outlined' : 'contained'}
                style={classes.btnContainer}
            >
                Payment
            </GomakePrimaryButton>
            <Menu
                closeAfterTransition={false}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    sx: { width: anchorEl?.offsetWidth, padding: 0 }
                }}
            >
                <Button sx={{ ...classes.statusLabel, borderRadius: 0 }}
                    onClick={() => onSelectPaymentMethod("Credit Card")}>Credit Card</Button>
                <Button sx={{ ...classes.statusLabel, borderRadius: 0 }}
                    onClick={() => alert(EStatus.IN_PROCESS)}>Cash</Button>
                <Button sx={{ ...classes.statusLabel, borderRadius: 0 }}
                    onClick={() => alert(EStatus.DONE)}>transference</Button>
                <Button sx={{ ...classes.statusLabel, borderRadius: 0 }}
                    onClick={() => alert(EStatus.STUCK)}>check</Button>
                <Button sx={{ ...classes.statusLabel, borderRadius: 0 }}
                    onClick={() => alert(EStatus.STUCK)}>bit</Button>
            </Menu>
        </>
    );
}

export { StatusBtn }