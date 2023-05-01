import * as React from "react";
import { useStyle } from "./style";
import { GomakePrimaryButton } from "@/components";
import { t } from "i18next";
import { Switch } from "@mui/material";



const CustomerForm = ({user,onDelete}: any) => {

    const { clasess } = useStyle();
    return (
        <div style={{ marginBottom: '20px' }} >
            <div style={{ display: "flex", alignItems: "center", width: "62%", justifyContent: "space-between" }} >
                <div>
                    <h3 style={clasess.headersStyle} >Username:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                    <h3 style={clasess.headersStyle} >Password:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                    <h3 style={clasess.headersStyle} >Email:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Switch style={clasess.switchStyle} />
                    <h3 style={clasess.headersStyle} >Log in using an email code</h3>
                </div>
                <GomakePrimaryButton style={clasess.autoButtonStyle} onClick={() => onDelete(user.index)}>Delete</GomakePrimaryButton>
            </div>
        </div>
    );
};

export { CustomerForm };

