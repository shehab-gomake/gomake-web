import { PrimaryTable } from "@/components/tables/primary-table";
import { Stack } from "@mui/material";
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";
import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "../style";
import { useRecoilState } from "recoil";
import { checksAccountCodeState } from "../../states";

const CheckTab = () => {
    const { t, data, tableHeaders, getTableRow , mapERPAccountsOptions} = usePaymentMethodsTabs();
    const { classes } = useStyle();
    const [checkAccountCode, setCheckAccountCode] = useRecoilState<any>(checksAccountCodeState);

    const handleAccountCodeChange = (selectedOption) => {
       setCheckAccountCode(selectedOption?.value);
    };

    return (
        <Stack display={"flex"} direction={"column"} justifyContent={"space-between"} padding={"0 5px"} gap={"10px"} >
            <Stack direction={"row"} gap={"7px"} padding={"0 5px"} width={"100%"}>
                <span style={classes.selectLbl} >{t("payment.accountCode")}</span>
                <GoMakeAutoComplate
                    style={{ height: "30px", width: 180, border: 0 }}
                    value={mapERPAccountsOptions.find((option) => option.value === checkAccountCode)}
                    defaultValue={mapERPAccountsOptions[0]}
                    options={mapERPAccountsOptions}
                    onChange={(e: any, value: any) => handleAccountCodeChange(value)}
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
