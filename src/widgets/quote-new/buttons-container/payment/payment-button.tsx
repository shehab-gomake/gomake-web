import Button from "@mui/material/Button";
import { useState } from "react";
import { Menu } from "@mui/material";
import { GomakePrimaryButton } from "@/components";
import { CreditCardIcon } from "@/icons/credit-card-icon";
import { useStyle } from "../style";
import { useTranslation } from "react-i18next";

export enum EStatus {
    CREDIT_CARD = 0,
    CASH = 1,
    TRANSFERENCE = 2,
    CHECK = 3,
    BIT = 4
}

interface IPaymentBtn {
    handleOpenModal: (selectedTabIndex: number) => void;
}

const PaymentBtn = ({ handleOpenModal }: IPaymentBtn) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onSelectPaymentMethod = (paymentMethod: number) => {
        handleOpenModal(paymentMethod);
        handleClose();
    }

    return (
        <>
            <GomakePrimaryButton
                leftIcon={<CreditCardIcon color={"#344054"} />}
                onClick={handleClick}
                style={classes.btnContainer}
            >{t("payment.payment")}
            </GomakePrimaryButton>
            <Menu
                closeAfterTransition={false}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{sx: { width: anchorEl?.offsetWidth, padding: 0 }}}
            >
                <Button sx={{ ...classes.statusLabel, borderRadius: 0 }}
                    onClick={() => onSelectPaymentMethod(EStatus.CREDIT_CARD)}>{t("payment.creditCard")}</Button>
                <Button sx={{ ...classes.statusLabel, borderRadius: 0 }}
                    onClick={() => onSelectPaymentMethod(EStatus.CASH)}>{t("payment.cash")}</Button>
                <Button sx={{ ...classes.statusLabel, borderRadius: 0 }}
                    onClick={() => onSelectPaymentMethod(EStatus.TRANSFERENCE)}>{t("payment.transfer")}</Button>
                <Button sx={{ ...classes.statusLabel, borderRadius: 0 }}
                    onClick={() => onSelectPaymentMethod(EStatus.CHECK)}>{t("payment.check")}</Button>
                <Button sx={{ ...classes.statusLabel, borderRadius: 0 }}
                    onClick={() => onSelectPaymentMethod(EStatus.BIT)}>{t("payment.bit")}</Button>
            </Menu>
        </>
    );
}

export { PaymentBtn }