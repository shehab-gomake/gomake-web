import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";
import { useEffect } from "react";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";

const HeaderFilter = ({ agentsCategores, customerType, status, onChangeAgent, onChangeCustomerType, onChangeStatus, setAllCustomers, onChangeCustomer, allCustomers ,handleClean , valName,valAgent,valStatus
}: any) => {
    const { t } = useTranslation();
    const { clasess } = useStyle();

    useEffect(() => {
        setAllCustomers(allCustomers);
    }, [allCustomers]);

    return (
        <div >
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
            <div style={clasess.filterContainer}>
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
                {customerType?.length > 0 ? (
                    <GoMakeAutoComplate
                        options={customerType}
                        style={clasess.autoComplateStyle}
                        placeholder={t("Select customer type")}
                        onChange={onChangeCustomerType}
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
                <GomakePrimaryButton style={clasess.autoButtonStyle} >Search</GomakePrimaryButton>
                <GomakePrimaryButton style={clasess.autoButtonStyle} onClick={handleClean} >Clean</GomakePrimaryButton>
            </div>
        </div>
    );
};
export { HeaderFilter };
