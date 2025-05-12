import { GoMakeAutoComplate, GoMakeModal } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { SecondaryButton } from "@/components/button/secondary-button";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";

const TransferBalanceModal = ({
  openModal,
  onCloseModal,
  customer,
  renderOptions,
  checkWhatRenderArray,
  handleCustomerChange,
  transferBalanceApi,
  isFetchingCustomers,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const btns = [
    {
      name: t("reports.transfer"),
      onclick: () => {
        transferBalanceApi();
        onCloseModal();
      },
    },
    {
      name: t("reports.cancel"),
      onclick: () => onCloseModal(),
    },
  ];

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("reports.transferBalance")}
        onClose={onCloseModal}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <div style={classes.date2FilterContainer}>
            <h3 style={classes.filterLabelStyle}>
              {t("sales.quote.customer")}
            </h3>
            <ClientAutocomplete
              key={customer?.id}
              options={renderOptions()}
              onChangeTextField={checkWhatRenderArray}
              getOptionLabel={(option: any) => `${option.name}`}
              style={classes.textInputStyle}
              onChange={handleCustomerChange}
              value={customer}
              loading={isFetchingCustomers}
            />
          </div>
          <div style={classes.btnsContainer}>
            {btns.map((tab, index) => {
              return (
                <SecondaryButton
                  variant={index === 0 ? "contained" : "outlined"}
                  key={index}
                  onClick={tab.onclick}
                  style={classes.btnContainer}
                >
                  {tab.name}
                </SecondaryButton>
              );
            })}
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};

export { TransferBalanceModal };
