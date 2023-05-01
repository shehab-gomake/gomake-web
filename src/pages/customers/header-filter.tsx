import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GomakePrimaryButton } from "@/components";
import { useMemo } from "react";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";

const HeaderFilter = () => {
    const { t } = useTranslation();
    const agentsCategores = useMemo(
        () => [t("agent1"),
        t("agent2"),
        t("agent3"),],
        []
    );
    const customersCategores = useMemo(
        () => [t("Cust1"), t("Cust2"),], []
    );
    const customersTypeCategores = useMemo(
        () => [t("client"),], []
    );
    const statusCategores = useMemo(
        () => [t("active"),], []
    );
    const { clasess } = useStyle();

    return (
        <div >
            {agentsCategores?.length > 0 ? (
                <GoMakeAutoComplate
                    options={agentsCategores}
                    style={clasess.autoComplateStyle}
                    placeholder={t("Select agent")}
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
                    />
                ) : (<Skeleton variant="rectangular" width={200} height={40} />)}

                {customersTypeCategores?.length > 0 ? (
                    <GoMakeAutoComplate
                        options={customersTypeCategores}
                        style={clasess.autoComplateStyle}
                        placeholder={t("Select customer type")}
                    />
                ) : (<Skeleton variant="rectangular" width={200} height={40} />)}
                {statusCategores?.length > 0 ? (
                    <GoMakeAutoComplate
                        options={statusCategores}
                        style={clasess.autoComplateStyle}
                        placeholder={t("Select status")}
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
