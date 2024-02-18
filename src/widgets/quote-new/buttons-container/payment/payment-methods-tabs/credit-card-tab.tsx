import { useStyle } from "../style";
import { usePaymentInputs } from 'react-payment-inputs';
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Stack } from "@mui/material";
import { GomakeTextInput } from "@/components";


const CreditCardTab = () => {
    const { classes } = useStyle();
    const { getCardNumberProps, getExpiryDateProps, getCVCProps } = usePaymentInputs();
    const {
        handleCardNumberChange,
        handleExpiryDateChange,
        handleCVVChange } = usePaymentMethodsTabs();

    return (
        <div style={{padding:"0 10px"}}>
            <div style={classes.creditCardInputsContainer}>
                <CreditCardIcon sx={{ color: "#2e3092" }} />
                <input
                    {...getCardNumberProps({ onChange: handleCardNumberChange })}
                    style={{ ...classes.creditCardInputs, width: "55%", paddingLeft: "5px" }}
                    placeholder="Card number">
                </input>
                <input
                    {...getExpiryDateProps({ onChange: handleExpiryDateChange })}

                    style={{ ...classes.creditCardInputs, width: "20%" }}
                    placeholder="MM/YY">
                </input>
                <input
                    {...getCVCProps({ onChange: handleCVVChange })}

                    style={{ ...classes.creditCardInputs, width: "20%" }}
                    placeholder="CVV">
                </input>
            </div>
{/* 
            <Stack direction={"column"} gap={"7px"} padding={"0 5px"} >
                    <span style={classes.inputLbl} >Total payment in credit card</span>
                    <GomakeTextInput
                        style={{ height: "40px", maxWidth: 180 }}
                        type={"number"}
                        placeholder={"sum"}
                    />
                </Stack> */}
            </div>
    );
}
export { CreditCardTab }