import { Button, Stack } from "@mui/material";

import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { isValidCustomer } from "@/utils/helpers";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission";
import { useEffect, useState } from "react";
import { getClientBalanceApi } from "@/services/api-service/customers/customers-api";
import { useGomakeAxios } from "@/hooks";
import { FONT_FAMILY } from "@/utils/font-family";
import { WalletIcon } from "@/pages-components/quotes/widgets/icons/header-section-icons";
import { useTranslation } from "react-i18next";
import { useCustomerEdit } from "@/hooks/use-customer-edit";

interface IProps {
  clientId: string;
  clientBalance?: number;
  isClickable?: boolean;
  clientType?: CLIENT_TYPE;
}

const ClientBalanceComponent = ({
  clientBalance,
  clientId,
  clientType = CLIENT_TYPE.CUSTOMER,
}: IProps) => {
  const { t } = useTranslation();
  const direction = t("direction");
  const {
    showCustomerModal,
    customerForEdit,
    setCustomerForEdit,
    getCustomerForEdit,
    closeModal,
  } = useCustomerEdit();

  const { callApi } = useGomakeAxios();
  const [balance, setBalance] = useState<number>(clientBalance);

  useEffect(() => {
    if (!clientBalance && clientId) {
      getClientBalanceApi(
        callApi,
        (res) => {
          if (res.success) {
            setBalance(res.data);
          }
        },
        clientId
      ).then();
    }
  }, [clientBalance, clientId]);

  return (
    <>
      <PermissionCheck userPermission={Permissions.SHOW_CLIENT_BALANCE}>
        {balance !== undefined && (
          <Stack direction="row" alignItems="center" gap={"2px"}>
            <span style={{ width: "70px", color: "#252675" }}>
              {t("home.clientBalance")}
            </span>
            <Button
              startIcon={<WalletIcon stroke="#252675" />}
              sx={{
                border: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "4px 12px",
                backgroundColor: "#CBCBE4",
                color: "#252675 !important",
                borderRadius: 16,
                ...FONT_FAMILY.Inter(500, 14),
                "& .MuiButton-startIcon": {
                  ...(direction === "rtl" && { margin: "0px 2px 0px 5px" }),
                },
              }}
              onClick={() => getCustomerForEdit(clientId)}
            >
              {balance}
            </Button>
          </Stack>
        )}
      </PermissionCheck>
      <CustomerCardWidget
        isValidCustomer={isValidCustomer}
        customerAction={CUSTOMER_ACTIONS.Edit}
        codeFlag={true}
        typeClient={clientType}
        modalTitle={
          clientType === CLIENT_TYPE.SUPPLIER
            ? t("suppliers.editModalTitle")
            : t("customers.modal.editTitle")
        }
        isgetAllCustomers={false}
        openModal={showCustomerModal}
        onClose={closeModal}
        customer={customerForEdit}
        setCustomer={setCustomerForEdit}
        showUpdateButton={true}
        selectedTabIndex={clientType === CLIENT_TYPE.SUPPLIER ? 5 : 6}
      />
    </>
  );
};

export { ClientBalanceComponent };
