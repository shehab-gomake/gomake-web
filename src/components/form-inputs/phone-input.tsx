import React from "react";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

interface IProps {
    onChange: (value: string) => void;
    value: string;
}

const PhoneInputComponent = ({ onChange, value }: IProps) => {

    return (
        <PhoneInput
            defaultCountry="il"
            value={value || "" }
            onChange={(value) => {
                onChange(value);
            }} />
    );
};

export { PhoneInputComponent };
