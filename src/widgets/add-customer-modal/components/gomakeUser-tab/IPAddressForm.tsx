import * as React from "react";
import { useStyle } from "./style";
import { GomakePrimaryButton } from "@/components";
import { t } from "i18next";
import { Switch } from "@mui/material";



const IPaddressForm = ({IPaddress,onDelete}: any) => {

    const { clasess } = useStyle();
    return (
        <div style={{ marginBottom: '20px' }} >
            <div style={{ display: "flex", alignItems: "center", width: "62%", justifyContent: "space-between" }} >
                <div>
                    <h3 style={clasess.headersStyle} >Address:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                    <h3 style={clasess.headersStyle} >Description:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                    <h3 style={clasess.headersStyle} >Updated:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </div>
                <GomakePrimaryButton style={clasess.autoButtonStyle} onClick={() => onDelete(IPaddress.index)}>Delete</GomakePrimaryButton>
            </div>
        </div>
    );
};

export { IPaddressForm };

