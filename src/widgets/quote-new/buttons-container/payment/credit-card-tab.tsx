import { useState } from "react";
import { usePaymentInputs } from 'react-payment-inputs';

const CreditCardTab = () => {
    const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps } = usePaymentInputs();
    const [cardNumber, setCardNumber] = useState();
    const [expiryDate, setExpiryDate] = useState();
    const [cvv, setCVV] = useState();

    const handleCardNumberChange = (e) => {
        const formattedInput = e.target.value.replace(/\D/g, '');

        if (formattedInput.length <= 16) {
            setCardNumber(formattedInput);
        }

        console.log(formattedInput);
    };

    const handleExpiryDateChange = (e) => {
        // Remove non-numeric characters
        const formattedInput = e.target.value.replace(/\D/g, '');

        if (formattedInput.length <= 4) {
            setExpiryDate(formattedInput);
        }
        console.log(formattedInput);

    };

    const handleCVVChange = (e) => {
        const formattedInput = e.target.value.replace(/\D/g, '');
        if (formattedInput.length <= 3) {
            setCVV(formattedInput);
        }
        console.log(formattedInput);

    };
    return (
        <div>
            <input {...getCardNumberProps({ onChange: ()=>console.log("s")})} value={cardNumber} />
            <input {...getExpiryDateProps({ onChange:handleExpiryDateChange})} value={expiryDate} />
            <input {...getCVCProps({ onChange: handleCVVChange })} value={cvv} />
            {meta.isTouched && meta.error && <span>Error: {meta.error}</span>}
        </div>
    );
}
export { CreditCardTab }