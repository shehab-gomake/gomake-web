import { PrimaryTable } from "@/components/tables/primary-table";
import { Stack } from "@mui/material";
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";

const CheckTab = () => {
    const { data,tableHeaders, getTableRow} = usePaymentMethodsTabs();

    return (
        <Stack display={"flex"} direction={"column"} justifyContent={"space-between"} padding={"0 5px"} >
            <PrimaryTable
                maxHeight={650}
                rows={data.map((row, index) => getTableRow(row, index))}
                headers={tableHeaders}
            />
        </Stack>
    );
};

export { CheckTab };
