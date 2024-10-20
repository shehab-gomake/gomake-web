import {usePaymentHistory} from "@/pages-components/company-reports/payment-history/use-payment-history";
import {useEffect} from "react";
import {PrimaryTable} from "@/components/tables/primary-table";

interface IProps {
    printHouseId: string;
}

const PaymentHistoryComponent = ({printHouseId}: IProps) => {
    const {getPaymentsHistory, tableHeaders, paymentRows} = usePaymentHistory();
    useEffect(() => {
        getPaymentsHistory(printHouseId).then();
    }, [printHouseId]);
    return (
        <PrimaryTable rows={paymentRows} headers={tableHeaders}/>
    );
}

export {PaymentHistoryComponent}