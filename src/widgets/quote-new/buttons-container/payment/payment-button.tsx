import Button from "@mui/material/Button";
import { useState } from "react";
import { Menu } from "@mui/material";
import { GomakePrimaryButton } from "@/components";
import { CreditCardIcon } from "@/icons/credit-card-icon";
import { useStyle } from "../style";
import { useTranslation } from "react-i18next";
import { ErpAccountType } from "../states";

interface IPaymentBtn {
    handleOpenModal: (selectedTabIndex: number) => void;
    getERPAccounts: (selectedTabIndex: ErpAccountType)=>void;
}

const PaymentBtn = ({ handleOpenModal , getERPAccounts }: IPaymentBtn) => {
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

    const onSelectPaymentMethod = async (paymentMethod: number) => {
        await getERPAccounts(paymentMethod);
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
                    onClick={() => onSelectPaymentMethod(ErpAccountType.CreditCardPayment)}>{t("payment.creditCard")}</Button>
                <Button sx={{ ...classes.statusLabel, borderRadius: 0 }}
                    onClick={() => onSelectPaymentMethod(ErpAccountType.CashPayment)}>{t("payment.cash")}</Button>
                <Button sx={{ ...classes.statusLabel, borderRadius: 0 }}
                    onClick={() => onSelectPaymentMethod(ErpAccountType.TransferPayment)}>{t("payment.transfer")}</Button>
                <Button sx={{ ...classes.statusLabel, borderRadius: 0 }}
                    onClick={() => onSelectPaymentMethod(ErpAccountType.ChecksPayment)}>{t("payment.check")}</Button>
                <Button sx={{ ...classes.statusLabel, borderRadius: 0 }}
                    onClick={() => onSelectPaymentMethod(ErpAccountType.CreditCardPayment + 1)}>{t("payment.bit")}</Button>
            </Menu>
        </>
    );
}

export { PaymentBtn }