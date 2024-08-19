
import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const TransferBalanceModal = ({ openModal, onCloseModal, customer, renderOptions, checkWhatRenderArray, handleCustomerChange, transferBalanceApi }) => {
  const { classes } = useStyle();
  const { t } = useTranslation()
  const btns = [
    {
      name: t("reports.transfer"),
      onclick: () => {
        transferBalanceApi()
        onCloseModal()
      }
    },
    {
      name: t("reports.cancel"),
      onclick: () => onCloseModal()
    },
  ]

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
            <h3 style={classes.filterLabelStyle}>{t("sales.quote.customer")}</h3>
            <GoMakeAutoComplate
              key={customer?.id}
              options={renderOptions()}
              onChangeTextField={checkWhatRenderArray}
              getOptionLabel={(option: any) => `${option.name}`}
              style={classes.textInputStyle}
              placeholder={t("sales.quote.chooseCustomer")}
              onChange={handleCustomerChange}
              value={customer}
            />
          </div>
          <div style={classes.btnsContainer}>
            {btns.map((tab, index) => {
              return (
                <GomakePrimaryButton key={index} onClick={tab.onclick} style={classes.btnContainer}>{tab.name}</GomakePrimaryButton>
              )
            })}
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};

export { TransferBalanceModal };