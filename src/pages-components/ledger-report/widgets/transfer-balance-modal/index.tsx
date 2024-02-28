
import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, } from "@/components";

import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const TransferBalanceModal = ({ openModal, onCloseModal, customer, renderOptions, checkWhatRenderArray, handleCustomerChange, transferBalanceApi }) => {
  const { clasess } = useStyle();
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
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <div style={clasess.date2FilterContainer}>
            <h3 style={clasess.filterLabelStyle}>{t("sales.quote.customer")}</h3>
            <GoMakeAutoComplate
              key={customer?.id}
              options={renderOptions()}
              onChangeTextField={checkWhatRenderArray}
              getOptionLabel={(option: any) => `${option.name}`}
              style={clasess.textInputStyle}
              placeholder={t("sales.quote.chooseCustomer")}
              onChange={handleCustomerChange}
              value={customer}
            />
          </div>
          <div style={clasess.btnsContainer}>
            {btns.map((tab, index) => {
              return (
                <GomakePrimaryButton key={index} onClick={tab.onclick} style={clasess.btnContainer}>{tab.name}</GomakePrimaryButton>
              )
            })}
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};

export { TransferBalanceModal };