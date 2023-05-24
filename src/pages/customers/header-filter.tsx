import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";
import { useEffect } from "react";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const HeaderFilter = ({ agentsCategores, customerType, customerTypes, status, onChangeAgent, onChangeCustomerType, onChangeStatus, setAllCustomers, onChangeCustomer, allCustomers, handleClean, valName, valAgent
}: any) => {
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
                placeholder={t("Select customer")}
                style={{
                    height: convertHeightToVH(42),
                    width: convertWidthToVW(200),
                }}
                value={valName}
            />
            <div style={clasess.filterContainer}>
                {agentsCategores?.length > 0 ? (
                    <GoMakeAutoComplate
                        options={agentsCategores}
                        style={clasess.autoComplateStyle}
                        placeholder={t("Select agent")}
                        onChange={onChangeAgent}
                    />
                ) : (
                    <Skeleton variant="rectangular" width={200} height={40} />
                )}
                {customerTypes?.length > 0 ? (
                    <GoMakeAutoComplate
                        options={customerTypes}
                        style={clasess.autoComplateStyle}
                        placeholder={t("Select customer type")}
                        onChange={onChangeCustomerType}
                        value={customerType}
                    />
                ) : (
                    <Skeleton variant="rectangular" width={200} height={40} />)}
                {status?.length > 0 ? (
                    <GoMakeAutoComplate
                        options={status}
                        style={clasess.autoComplateStyle}
                        placeholder={t("Select status")}
                        onChange={onChangeStatus}
                    />
                ) : (
                    <Skeleton variant="rectangular" width={200} height={40} />
                )}
                <GomakePrimaryButton style={clasess.autoButtonStyle} onClick={handleClean} >Clean</GomakePrimaryButton>
            </div>
        </div>
    );
};
export { HeaderFilter };
