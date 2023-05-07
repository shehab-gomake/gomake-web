import * as React from "react";
import { useStyle } from "./style";
import { HeaderFilter } from "./header-filter";
import { GomakePrimaryButton } from "@/components";
import { t } from "i18next";

const ContactForm = ({contact,onDelete}: any) => {

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
        <div style={{ marginBottom: '20px'}} >
            <div style={{ display: "flex", alignItems: "center",  width: "63%" , justifyContent:"space-between" , marginBottom: '8px'}} >
                <div>
                    <h3 style={clasess.headersStyle} >First name:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                    <h3 style={clasess.headersStyle} >Last Name:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                    <h3 style={clasess.headersStyle} >title:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                    <h3 style={clasess.headersStyle} >role:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                    <h3 style={clasess.headersStyle} >Address:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                    <h3 style={clasess.headersStyle} >Phone 1:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center",  width: "62%" , justifyContent:"space-between"}} >
                <div>
                <h3 style={clasess.headersStyle} >Phone 2:</h3>
                <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                <h3 style={clasess.headersStyle} >Mobile:</h3>
                <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                <h3 style={clasess.headersStyle} >fax:</h3>
                <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                <h3 style={clasess.headersStyle} >E-mail:</h3>
                <input style={clasess.inputStyle} type="text" />
                </div>
                <div>
                <h3 style={clasess.headersStyle } >Default in document</h3>
                <HeaderFilter setAllOptions={DocumentsOptions}  style={clasess.autoComplateStyle}></HeaderFilter>
                </div>
                <GomakePrimaryButton style={clasess.autoButtonStyle} onClick={() => onDelete(contact.index)}>Delete</GomakePrimaryButton>
            </div>
        </div>
    );
};

export { ContactForm };
   
