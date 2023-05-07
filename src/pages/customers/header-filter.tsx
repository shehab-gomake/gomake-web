import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GomakePrimaryButton } from "@/components";
import { useEffect, useMemo } from "react";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";
import { useSupplier } from "@/hooks";

const HeaderFilter = ({ customersCategores , agentsCategores, customerType , status , categoryName , onChangeAgent , onChangeCustomer , onChangeCustomerType, onChangeSupplier , onChangeStatus
  }: any) => {
    const { t } = useTranslation();
    const { clasess } = useStyle();

   

    return (
        <div >
            {agentsCategores?.length > 0 ? (
                <GoMakeAutoComplate
                    options={agentsCategores}
                    style={clasess.autoComplateStyle}
                    placeholder={t("Select agent")}
                    onChange={onChangeSupplier}
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
                    />
                ) : (<Skeleton variant="rectangular" width={200} height={40} />)}

                {customerType?.length > 0 ? (
                    <GoMakeAutoComplate
                        options={customerType}
                        style={clasess.autoComplateStyle}
                        placeholder={t("Select customer type")}
                        onChange={onChangeCustomerType}
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
