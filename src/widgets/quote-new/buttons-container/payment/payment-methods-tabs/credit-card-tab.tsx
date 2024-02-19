import { useStyle } from "../style";
import { usePaymentInputs } from 'react-payment-inputs';
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";
import CreditCardIcon from '@mui/icons-material/CreditCard';

const CreditCardTab = () => {
    const { classes } = useStyle();
    const { getCardNumberProps, getExpiryDateProps, getCVCProps } = usePaymentInputs();
    const {
        handleCardNumberChange,
        handleExpiryDateChange,
        handleCVVChange,
        handleCardIdChange } = usePaymentMethodsTabs();

    return (
        <div dir="ltr" style={classes.mainContainer}>
            <div style={classes.creditCardInputsContainer}>
                <CreditCardIcon sx={{ color: "#2e3092" }} />
                <input
                    {...getCardNumberProps({ onChange: handleCardNumberChange })}
                    style={{ ...classes.creditCardInputs, width: "55%", paddingLeft: "5px" }}
                    placeholder="Card number" />
                <input
                    {...getExpiryDateProps({ onChange: handleExpiryDateChange })}
                    style={{ ...classes.creditCardInputs, width: "20%" }}
                    placeholder="MM/YY" />
                <input
                    {...getCVCProps({ onChange: handleCVVChange })}
                    style={{ ...classes.creditCardInputs, width: "20%" }}
                    placeholder="CVV" />
            </div>
            <div style={classes.creditCardSecondInputsContainer}>
                <input
                    onChange={handleCardIdChange}
                    style={classes.creditSecondCardInputs}
                    placeholder="Id"
                    maxLength={9} />
                <input
                    style={classes.creditSecondCardInputs}
                    placeholder="Total"
                />
            </div>
        </div>
    );
}
export { CreditCardTab }