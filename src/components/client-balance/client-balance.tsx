import {Stack} from "@mui/material";
import {useQuotes} from "@/pages-components/quotes/use-quote";
import {DOCUMENT_TYPE} from "@/pages-components/quotes/enums";
import {CustomerCardWidget} from "@/widgets/customer-card-modal";
import {isValidCustomer} from "@/utils/helpers";
import {CLIENT_TYPE, CUSTOMER_ACTIONS} from "@/pages/customers/enums";
import {Permissions} from "@/components/CheckPermission/enum";
import {PermissionCheck} from "@/components/CheckPermission";
import {useEffect, useState} from "react";
import {getClientBalanceApi} from "@/services/api-service/customers/customers-api";
import {useGomakeAxios} from "@/hooks";
import {PrimaryButton} from "@/components/button/primary-button";

interface IProps {
    clientId: string;
    clientBalance?: number;
}

const ClientBalanceComponent = ({clientBalance, clientId}: IProps) => {
    const {
        showCustomerModal,
        setShowCustomerModal,
        t,
        customerForEdit,
        setCustomerForEdit,
        onClickOpenCustomerModal,
    } = useQuotes(DOCUMENT_TYPE.order, false);
    const {callApi} = useGomakeAxios();
    const [balance, setBalance] = useState<number>(clientBalance);

    useEffect(() => {
        if (!clientBalance) {
            getClientBalanceApi(callApi, (res) => {
                if (res.success) {
                    setBalance(res.data);
                }
            }, clientId).then();
        }
    }, [clientBalance])
    return (
        <>
            <PermissionCheck userPermission={Permissions.SHOW_CLIENT_BALANCE}>
                {balance !== undefined &&
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} >
                        <span style={{width:"70px"}}>{t('home.clientBalance')}</span>
                        <PrimaryButton style={{maxWidth: 'fit-content', padding: 0}}
                                       onClick={() => onClickOpenCustomerModal(clientId)}>{` ${balance}`}</PrimaryButton>
                    </Stack>
                }
            </PermissionCheck>
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
                selectedTabIndex={6}
            />
        </>
    )
}

export {ClientBalanceComponent}