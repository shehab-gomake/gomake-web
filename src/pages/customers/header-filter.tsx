import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";
import { useEffect } from "react";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import * as React from 'react';

const HeaderFilter = ({ setAllCustomers, allCustomers, agentsCategores, clientTypesCategores, statuses, onChangeAgent, onChangeCustomer, onChangeClientType, onChangeStatus, handleClean, cutomerName, agentName, valClientType, valStatus }: any) => {
    const { t } = useTranslation();
    const { clasess } = useStyle();

    useEffect(() => {
        setAllCustomers(allCustomers);
    }, [allCustomers]);

    return (
        <div>
            <GomakeTextInput
                type={"text"}
                onChange={onChangeCustomer}
                placeholder={t("customers.selectCustomer")}
                style={{
                    height: convertHeightToVH(42),
                    width: convertWidthToVW(200),
                    color: "black",                    
                }}
                
                value={cutomerName}
            />
            <div style={clasess.filterContainer}>
                {agentsCategores?.length > 0 ? (
                    <GoMakeAutoComplate
                        options={agentsCategores}
                        style={clasess.autoComplateStyle}
                        placeholder={t("customers.selectAgent")}
                        onChange={onChangeAgent}
                        value={agentName}
                    />
                ) : (
                    <Skeleton variant="rectangular" width={200} height={40} />
                )}
                {clientTypesCategores?.length > 0 ? (
                    <GoMakeAutoComplate
                        options={clientTypesCategores}
                        style={clasess.autoComplateStyle}
                        placeholder={t("customers.selectCustomerType")}
                        onChange={onChangeClientType}
                        value={valClientType}
                    
                    />
                ) : (
                    <Skeleton variant="rectangular" width={200} height={40} />)}
                {statuses?.length > 0 ? (
                    <GoMakeAutoComplate
                        options={statuses}
                        style={clasess.autoComplateStyle}
                        placeholder={t("customers.selectStatus")}
                        onChange={onChangeStatus}
                        value={valStatus}
                        disableClearable={true}
                        //defaultValue={statuses[0]}
                    />
                ) : (
                    <Skeleton variant="rectangular" width={200} height={40} />
                )}
                <GomakePrimaryButton style={clasess.autoButtonStyle} onClick={handleClean} >{t("customers.buttons.clean")}</GomakePrimaryButton>
            </div>
        </div>
    );
};
export { HeaderFilter };
