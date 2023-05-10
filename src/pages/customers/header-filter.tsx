import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GomakePrimaryButton } from "@/components";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";
import { useEffect } from "react";
import { useAgent } from "@/hooks/use-agent";

const HeaderFilter = ({ agentsCategores,customersCategores, customerType, status, categoryName, onChangeAgent, onChangeCustomerType, onChangeSupplier, onChangeStatus , setAllCustomers , onChangeCustomer, allCustomers
}: any) => {
    const { t } = useTranslation();
    const { clasess } = useStyle();
    const { getAgent,  agents } = useAgent();
    useEffect(() => {
        getAgent();
    }, []);

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
                {customersCategores?.length > 0 ? (
                    <GoMakeAutoComplate
                        options={customersCategores}
                        style={clasess.autoComplateStyle}
                        placeholder={t("Select customer")}
                        onChange={onChangeCustomer} 
                        value={categoryName}  
                    />
                ) : (<Skeleton variant="rectangular" width={200} height={40} />)}

                {customerType?.length > 0 ? (
                    <GoMakeAutoComplate
                        options={customerType}
                        style={clasess.autoComplateStyle}
                        placeholder={t("Select customer type")}
                        onChange={onChangeCustomerType}
                        value={customerType[0]} 
                    />
                ) : (<Skeleton variant="rectangular" width={200} height={40} />)}
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
                <GomakePrimaryButton style={clasess.autoButtonStyle} >Clean</GomakePrimaryButton>
            </div>
        </div>
    );
};
export { HeaderFilter };
