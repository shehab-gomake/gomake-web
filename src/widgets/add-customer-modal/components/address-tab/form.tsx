import * as React from "react";
import { useStyle } from "./style";
import { HeaderFilter } from "./header-filter";
import { GomakePrimaryButton } from "@/components";
import { t } from "i18next";



const AddressForm = ({address,onDelete}: any) => {

    const { clasess } = useStyle();
    const DocumentsOptions = React.useMemo(
        () => [t("quote"),
        t("order"),
        t("invoice"),
        t("receipt"),
        t("delivery note"),],
        []
    );

    return (
        <div style={{ marginBottom: '20px' }} >
            <div style={{ display: "flex", alignItems: "center",  width: "63%" , justifyContent:"space-between" , marginBottom: '8px'}} >
                <div >
                    <h3 style={clasess.headersStyle} >Address ID:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                <h3 style={clasess.headersStyle } >City:</h3>
                <HeaderFilter setAllOptions={DocumentsOptions}  style={clasess.autoComplateStyle}></HeaderFilter>
                </div>
                <div>
                <h3 style={clasess.headersStyle } >Street:</h3>
                <HeaderFilter setAllOptions={DocumentsOptions}  style={clasess.autoComplateStyle}></HeaderFilter>
                </div>
                <div>
                    <h3 style={clasess.headersStyle} >Home:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                    <h3 style={clasess.headersStyle} >Entrance:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                    <h3 style={clasess.headersStyle} >Phone 1:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center",  width: "62%" , justifyContent:"space-between"}} >
                <div>
                <h3 style={clasess.headersStyle} >Apartment:</h3>
                <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                <h3 style={clasess.headersStyle} >Postal Code:</h3>
                <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                <h3 style={clasess.headersStyle} >Country:</h3>
                <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                <h3 style={clasess.headersStyle} >E-mail:</h3>
                <input style={clasess.inputStyle} type="text" />
                </div>
                <GomakePrimaryButton style={clasess.autoButtonStyle} onClick={() => onDelete(address.index)}>Delete</GomakePrimaryButton>
            </div>
        </div>
    );
};

export { AddressForm };
   
