import * as React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { RemoveIcon } from "@/components/icons/icons";
import Switch from "../switch-component";


const UserForm = ({ user, onDelete }: any) => {

    const { clasess } = useStyle();
    const { t } = useTranslation();

    return (
        <div style={{ display: "flex" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "24px" , width:"886px"}} >
                <div style={{ width: '180px' }}>
                    <h3 style={clasess.headerStyle}>{t("customers.modal.userName")}</h3>
                    <input style={clasess.inputStyle} placeholder="placeholder" type="text" value={user?.username}/>
                </div >
                <div style={{ width: '180px' }}>
                    <h3 style={clasess.headerStyle}>{t("customers.modal.password")}</h3>
                    <input style={clasess.inputStyle} placeholder="placeholder" type="text" value={user?.password} />
                </div>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "16px", width:"376px"}}>
                    <div  style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
                    <h3 style={clasess.headerStyle}>{t("customers.modal.email")}</h3>
                    <input style={clasess.inputStyle} placeholder="placeholder" type="text" />
                    <a style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }} >
                        <div style={{ width: "23px", height: "18px" }}>
                            <Switch checked={false} ></Switch>
                        </div>
                        <h3 style={clasess.switchHeaderStyle} >{t("customers.modal.loginUsingEmailCode")}</h3>
                    </a>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
                    <h3 style={clasess.headerStyle}>{t("customers.modal.IPaddress")}</h3>
                    <input style={clasess.inputStyle} placeholder="placeholder" type="text" />
                    </div>

                </div>
                <div  style={{ width: '102px' }}>
                    <a style={{ display: "flex", justifyContent: 'flex-start' }} onClick={() => onDelete(user.index)} >
                        <RemoveIcon></RemoveIcon>
                        <button style={clasess.buttonsStyle} >{t("customers.buttons.remove")}</button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export { UserForm };

