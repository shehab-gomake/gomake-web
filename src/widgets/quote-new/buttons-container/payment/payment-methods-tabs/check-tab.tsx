import { PrimaryTable } from "@/components/tables/primary-table";
import { Stack } from "@mui/material";
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";
import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "../style";
import { useRecoilState } from "recoil";
import { checksAccountCodeState } from "../../states";
import { useEffect } from "react";

const CheckTab = () => {
    const { classes } = useStyle();
    const { t, data, tableHeaders, getTableRow, checksAccountsOptions } = usePaymentMethodsTabs();
    const [checkAccountCode, setCheckAccountCode] = useRecoilState<string>(checksAccountCodeState);

    const handleAccountCodeChange = (selectedOption) => {
        setCheckAccountCode(selectedOption?.value);
    };

    useEffect(() => {
        if (checksAccountsOptions.length > 0 && !checkAccountCode) {
            const defaultOption = checksAccountsOptions.find(option => option.isSelected).value;
            if (defaultOption) {
                setCheckAccountCode(defaultOption);
            }
            else {
                setCheckAccountCode(checksAccountsOptions[0].value)
            }
        }
    }, [checksAccountsOptions, checkAccountCode]);

    return (
        <Stack display={"flex"} direction={"column"} justifyContent={"space-between"} padding={"0 5px"} gap={"10px"} >
            <Stack direction={"row"} gap={"7px"} padding={"0 5px"} width={"100%"}>
                <span style={classes.selectLbl} >{t("payment.accountCode")}</span>
                {checkAccountCode && (
                    <GoMakeAutoComplate
                        style={{ height: "30px", width: 180, border: 0 }}
                        value={checksAccountsOptions.find((option) => option.value === checkAccountCode)}
                        options={checksAccountsOptions}
                        onChange={(e: any, value: any) => handleAccountCodeChange(value)}
                    />
                )}
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
