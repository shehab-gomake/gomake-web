import { PrimaryTable } from "@/components/tables/primary-table";
import { Stack } from "@mui/material";
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";
import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "../style";

const CheckTab = () => {
    const { t, data, tableHeaders, getTableRow , mapERPAccountsOptions} = usePaymentMethodsTabs();
    const { classes } = useStyle();

    return (
        <Stack display={"flex"} direction={"column"} justifyContent={"space-between"} padding={"0 5px"} gap={"10px"} >
            <Stack direction={"row"} gap={"7px"} padding={"0 5px"} width={"100%"}>
                <span style={classes.selectLbl} >{t("payment.accountCode")}</span>
                <GoMakeAutoComplate
                    style={{ height: "30px", width: 180, border: 0 }}
                    value={mapERPAccountsOptions[0]}
                    options={mapERPAccountsOptions}
                    disabled={true}
                />
            </Stack>
            <PrimaryTable
                stickyHeader={true}
                maxHeight={330}
                rows={data.map((row, index) => getTableRow(row, index))}
                headers={tableHeaders}
            />
        </Stack>
    );
};

export { CheckTab };
