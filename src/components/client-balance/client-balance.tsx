import {Stack} from "@mui/material";
import Link from "next/link";
import {useQuotes} from "@/pages-components/quotes/use-quote";
import {DOCUMENT_TYPE} from "@/pages-components/quotes/enums";
import {CustomerCardWidget} from "@/widgets/customer-card-modal";
import {isValidCustomer} from "@/utils/helpers";
import {CLIENT_TYPE, CUSTOMER_ACTIONS} from "@/pages/customers/enums";
import Button from "@mui/material/Button";

interface IProps {
    clientId: string;
    clientName: string;
    clientBalance: number;
}

const ClientBalanceComponent = ({clientBalance, clientName, clientId}: IProps) => {
    const {
        showCustomerModal,
        setShowCustomerModal,
        t,
        customerForEdit,
        setCustomerForEdit,
        onClickOpenCustomerModal,
    } = useQuotes(DOCUMENT_TYPE.order, false);
    return (
        <>
            <Stack direction={'row'} justifyContent={'space-between'} gap={'5px'}>
                <span>balance:</span>
                <Button onClick={()=> onClickOpenCustomerModal(clientId)}>{clientBalance}</Button>
            </Stack>
            <CustomerCardWidget
                isValidCustomer={isValidCustomer}
                customerAction={CUSTOMER_ACTIONS.Edit}
                codeFlag={true}
                typeClient={CLIENT_TYPE.CUSTOMER}
                isgetAllCustomers={false}
                openModal={showCustomerModal}
                modalTitle={t("customers.modal.editTitle")}
                onClose={() => setShowCustomerModal(false)}
                customer={customerForEdit}
                setCustomer={setCustomerForEdit}
                showUpdateButton={true}
            />
        </>
    )
}

export {ClientBalanceComponent}