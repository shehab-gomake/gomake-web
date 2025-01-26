import { GoMakeAutoComplate, GoMakeModal, GomakeTextInput } from "@/components";
import { useCreateNewTransaction } from "./use-create-transaction";
import { useStyle } from "./style";
import { DateFormatter } from "@/utils/adapter";
import { SecondaryButton } from "@/components/button/secondary-button";

interface CreateNewTransactionModalProps {
  openModal: boolean;
  onCloseModal: () => void;
  erpAccountsList?: any;
}
const CreateNewTransactionModal = ({
  openModal,
  onCloseModal,
  erpAccountsList,
}: CreateNewTransactionModalProps) => {
  const { classes } = useStyle();
  const {
    t,
    // erpAccountsList,
    renderOptions,
    checkWhatRenderArray,
    accountTypeList,
    selectTransactionType,
    handleTransactionTypeChange,
    handleClickSelectDate,
    selectDate,
    setSelectDate,
    dateRef,
    onChangeReference,
    onChangePrice,
    createTransactionsApi,
    onCloseAndRemoveState,
    isFetching,
    accountTypeOptions,
    toAccountCode,
    fromAccountCode,
    toClientId,
    fromClientId,
    toAccountType,
    fromAccountType,
    handleFromChange,
    handleToChange,
    handleToTypeChange,
    handleFromTypeChange,
  } = useCreateNewTransaction({ onCloseModal });

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("reports.newTransaction")}
        onClose={onCloseAndRemoveState}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <div style={classes.inputsRowStyle}>
            <div style={classes.inputsColumnStyle}>
              <div style={classes.inputsRowStyle}>
                <div style={classes.date2FilterContainer}>
                  <h3 style={classes.filterLabelStyle}>
                    {t("reports.fromAccountType")}
                  </h3>
                  <GoMakeAutoComplate
                    options={accountTypeOptions}
                    getOptionLabel={(option) => option.label}
                    onChange={handleFromTypeChange}
                    value={accountTypeOptions.find(
                      (option) => option.value === fromAccountType
                    )}
                    placeholder={t("reports.selectAccountType")}
                    style={classes.textInputStyle}
                  />
                </div>
                {fromAccountType && (
                  <div style={classes.date2FilterContainer}>
                    <h3 style={classes.filterLabelStyle}>
                      {fromAccountType === "client"
                        ? t("sales.quote.chooseCustomer")
                        : t("reports.selectAccountCode")}
                    </h3>
                    <GoMakeAutoComplate
                      options={
                        fromAccountType === "client"
                          ? renderOptions()
                          : erpAccountsList
                      }
                      getOptionLabel={(option: any) => option.name}
                      style={classes.textInputStyle}
                      placeholder={
                        fromAccountType === "client"
                          ? t("sales.quote.chooseCustomer")
                          : t("reports.selectAccountCode")
                      }
                      value={
                        fromAccountType === "client"
                          ? renderOptions().find(
                              (option) => option.id === fromClientId
                            )
                          : erpAccountsList.find(
                              (option) => option.code === fromAccountCode
                            )
                      }
                      onChange={handleFromChange}
                      onChangeTextField={
                        fromAccountType === "client" && checkWhatRenderArray
                      }
                      defaultFiltering={
                        fromAccountType === "client" ? false : true
                      }
                    />
                  </div>
                )}
              </div>
              <div style={classes.inputsRowStyle}>
                <div style={classes.date2FilterContainer}>
                  <h3 style={classes.filterLabelStyle}>
                    {t("reports.toAccountType")}
                  </h3>
                  <GoMakeAutoComplate
                    options={accountTypeOptions}
                    getOptionLabel={(option) => option.label}
                    onChange={handleToTypeChange}
                    value={accountTypeOptions.find(
                      (option) => option.value === toAccountType
                    )}
                    placeholder={t("reports.selectAccountType")}
                    style={classes.textInputStyle}
                  />
                </div>
                {toAccountType && (
                  <div style={classes.date2FilterContainer}>
                    <h3 style={classes.filterLabelStyle}>
                      {toAccountType === "client"
                        ? t("sales.quote.chooseCustomer")
                        : t("reports.selectAccountCode")}
                    </h3>
                    <GoMakeAutoComplate
                      options={
                        toAccountType === "client"
                          ? renderOptions()
                          : erpAccountsList
                      }
                      getOptionLabel={(option: any) => option.name}
                      style={classes.textInputStyle}
                      placeholder={
                        toAccountType === "client"
                          ? t("sales.quote.chooseCustomer")
                          : t("reports.selectAccountCode")
                      }
                      value={
                        toAccountType === "client"
                          ? renderOptions().find(
                              (option) => option.id === toClientId
                            )
                          : erpAccountsList.find(
                              (option) => option.code === toAccountCode
                            )
                      }
                      onChange={handleToChange}
                      onChangeTextField={
                        fromAccountType === "client" && checkWhatRenderArray
                      }
                      defaultFiltering={
                        fromAccountType === "client" ? false : true
                      }
                    />
                  </div>
                )}
              </div>
            </div>
            <div style={classes.date2FilterContainer}>
              <h3 style={classes.filterLabelStyle}>
                {t("customers.modal.referenceDate")}
              </h3>
              <div
                style={classes.datePickerinvidualContainer}
                onClick={handleClickSelectDate}
              >
                <div style={classes.dateStyle}>
                  {selectDate
                    ? DateFormatter(selectDate)
                    : t("sales.quote.selectDate")}
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
            <div style={classes.date2FilterContainer}>
              <h3 style={classes.filterLabelStyle}>
                {t("payment.transactionType")}
              </h3>
              <GoMakeAutoComplate
                key={selectTransactionType?.id}
                options={accountTypeList}
                getOptionLabel={(option: any) => `${option.name}`}
                style={classes.textInputStyle}
                placeholder={t("reports.selectType")}
                onChange={handleTransactionTypeChange}
                value={selectTransactionType}
              />
            </div>
            <div style={classes.date2FilterContainer}>
              <h3 style={classes.filterLabelStyle}>{t("reports.reference")}</h3>
              <GomakeTextInput
                style={classes.textInputStyle}
                placeholder={t("reports.enterReference")}
                onChange={onChangeReference}
              />
            </div>
            <div style={classes.date2FilterContainer}>
              <h3 style={classes.filterLabelStyle}>{t("reports.price")}</h3>
              <GomakeTextInput
                style={classes.textInputStyle}
                placeholder={t("reports.enterPrice")}
                type="number"
                onChange={onChangePrice}
              />
            </div>
          </div>
          <SecondaryButton
            variant="contained"
            style={classes.createBtnStyle}
            onClick={createTransactionsApi}
          >
            {t("reports.createNewTransaction")}
          </SecondaryButton>
        </div>
      </GoMakeModal>
    </>
  );
};

export { CreateNewTransactionModal };
