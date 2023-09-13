import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";
import { useEffect } from "react";
import * as React from 'react';
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { SecondaryButton } from "@/components/button/secondary-button";

const HeaderFilter = ({ setAllCustomers, allCustomers, agentsCategores, clientTypesCategores, statuses, onChangeAgent, onChangeCustomer, onChangeClientType, onChangeStatus, handleClean, cutomerName, agentName, valClientType, valStatus }: any) => {
    const { t } = useTranslation();
    const { clasess } = useStyle();
    useEffect(() => {
        setAllCustomers(allCustomers);
    }, [allCustomers]);

    return (
        <div style={clasess.subHeaderContainer}>
            <div style={clasess.filterContainer}>
                {agentsCategores?.length > 0 ? (
                    <GoMakeAutoComplate
                        options={agentsCategores}
                        style={clasess.dropDownListStyle}
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
                        style={clasess.dropDownListStyle}
                        placeholder={t("customers.selectCustomerType")}
                        onChange={onChangeClientType}
                        value={valClientType}
                    />
                ) : (
                    <Skeleton variant="rectangular" width={200} height={40} />)}
                {statuses?.length > 0 ? (
                    <GoMakeAutoComplate
                        options={statuses}
                        style={clasess.dropDownListStyle}
                        placeholder={t("customers.selectStatus")}
                        onChange={onChangeStatus}
                        value={valStatus}
                        disableClearable={true}
                        //defaultValue={statuses[0]}
                    />
                ) : (
                    <Skeleton variant="rectangular" width={200} height={40} />
                )}
                <SecondaryButton style={clasess.cleanBtnStyle} onClick={handleClean} >{t("customers.buttons.clean")}</SecondaryButton>
            </div>
            <div style={clasess.subHeaderRightSide}>
                <SearchInputComponent onChange={onChangeCustomer} value={cutomerName}></SearchInputComponent>
            </div>
        </div>
    );
};
export { HeaderFilter };
