import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useCustomerDropDownList } from "@/hooks/use-customer-drop-down-list";
import { SecondaryButton } from "@/components/button/secondary-button";
import { Stack } from "@mui/material";
import { useSnackBar } from "@/hooks";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";

interface ITransferToClient {
  onClickClosModal: () => void;
  onClickConfirm: (clientID: string) => void;
}

const TransferToClientModal = ({
  onClickClosModal,
  onClickConfirm,
}: ITransferToClient) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { alertFault } = useSnackBar();
  const {
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
  } = useCustomerDropDownList({});

  const handleConfirmClick = () => {
    if (customer != null) {
      onClickConfirm(customer.id);
    } else {
      alertFault("reports.pleaseSelectCustomer");
    }
  };

  return (
    <Stack
      display={"flex"}
      justifyContent={"space-between"}
      height={"100%"}
      direction={"column"}
      padding={"20px"}
    >
      <div style={classes.date2FilterContainer}>
        <h3 style={classes.filterLabelStyle}>{t("sales.quote.customer")}</h3>
        <ClientAutocomplete
          options={renderOptions()}
          onChangeTextField={checkWhatRenderArray}
          getOptionLabel={(option: any) => `${option.name}`}
          style={classes.textInputStyle}
          onChange={handleCustomerChange}
          value={customer}
          loading={isFetching}
        />
      </div>
      <Stack direction={"row"} gap={"20px"}>
        <SecondaryButton variant={"contained"} onClick={handleConfirmClick}>
          {t("sales.quote.confirmed")}
        </SecondaryButton>
        <SecondaryButton variant={"contained"} onClick={onClickClosModal}>
          {t("sales.quote.cancel")}
        </SecondaryButton>
      </Stack>
    </Stack>
  );
};

export { TransferToClientModal };
