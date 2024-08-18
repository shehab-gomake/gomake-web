
import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";

import { useCreateNewTransaction } from "./use-create-transaction";
import { useStyle } from "./style";
import { DateFormatter } from "@/utils/adapter";
import { SecondaryButton } from "@/components/button/secondary-button";


const CreateNewTransactionModal = ({ openModal, onCloseModal }) => {
  const { classes } = useStyle();
  const {
    customer,
    erpAccountsList,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    t,
    selectErpAccount,
    handleERPAccountChange,
    accountTypeList,
    selectAccountType,
    handleAccountTypeChange,
    handleClickSelectDate,
    selectDate,
    setSelectDate,
    dateRef,
    onChangeReference,
    onChangePrice,
    createTransactionsApi,
    onCloseAndRemoveState
  } = useCreateNewTransaction({ onCloseModal })
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle="Create New Transaction"
        onClose={onCloseAndRemoveState}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <div style={classes.inputsRowStyle}>
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
            <div style={classes.date2FilterContainer}>
              <h3 style={classes.filterLabelStyle}>Account Code</h3>
              <GoMakeAutoComplate
                key={selectErpAccount?.code}
                options={erpAccountsList}
                getOptionLabel={(option: any) => `${option.name}`}
                style={classes.textInputStyle}
                placeholder="Select Account Code"
                onChange={handleERPAccountChange}
                value={selectErpAccount}
              />
            </div>
            <div style={classes.date2FilterContainer}>
              <h3 style={classes.filterLabelStyle}>Type</h3>
              <GoMakeAutoComplate
                key={selectAccountType?.id}
                options={accountTypeList}
                getOptionLabel={(option: any) => `${option.name}`}
                style={classes.textInputStyle}
                placeholder="Select Type"
                onChange={handleAccountTypeChange}
                value={selectAccountType}
              />
            </div>
            <div style={classes.date2FilterContainer}>
              <h3 style={classes.filterLabelStyle}>{t("reports.price")}</h3>
              <GomakeTextInput style={classes.textInputStyle} placeholder="Enter Price" type="number" onChange={onChangePrice} />

            </div>
            <div style={classes.date2FilterContainer}>
              <h3 style={classes.filterLabelStyle}>Reference</h3>
              <GomakeTextInput style={classes.textInputStyle} placeholder="Enter Reference" onChange={onChangeReference} />
            </div>
            <div style={classes.date2FilterContainer}>
              <h3 style={classes.filterLabelStyle}>{t("customers.modal.referenceDate")}</h3>
              <div style={classes.datePickerinvidualContainer} onClick={handleClickSelectDate}>
                <div
                  style={classes.dateStyle}

                >
                  {selectDate ? DateFormatter(selectDate) : t("sales.quote.selectDate")}
                  <div style={classes.datePickerContainer}>
                    <input
                      type="date"
                      onChange={(e) => {
                        setSelectDate(e.target.value);
                      }}
                      ref={dateRef}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SecondaryButton variant="contained" style={classes.createBtnStyle} onClick={createTransactionsApi}>{t("reports.createNewTransaction")}</SecondaryButton>
        </div>
      </GoMakeModal>
    </>
  );
};

export { CreateNewTransactionModal };