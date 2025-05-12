import { GoMakeAutoComplate, GoMakeModal, GomakeTextInput } from "@/components";
import { useCreateNewTransaction } from "./use-create-transaction";
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { DateFormatter } from "@/utils/date-formatters";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { CLIENT_TYPE } from "@/pages/customers/enums";

interface CreateNewTransactionModalProps {
  openModal: boolean;
  onCloseModal: () => void;
  erpAccountsList?: any;
  isPurchaseReport?: boolean;
}

const CreateNewTransactionModal = ({
  openModal,
  onCloseModal,
  erpAccountsList,
  isPurchaseReport,
}: CreateNewTransactionModalProps) => {
  const { classes } = useStyle();
  const {
    t,
    // erpAccountsList,
    renderOptions,
    checkWhatRenderArray,
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
    handleClickSelectDueDate,
    selectedDueDate,
    setSelectedDueDate,
    dueDateRef,
    onChangeDescription,
    description,
  } = useCreateNewTransaction({ onCloseModal, isPurchaseReport });

  const getFromSelectedValue = () => {
    if (fromAccountType === "client") {
      return (
        renderOptions()?.find((option) => option?.id === fromClientId) || null
      );
    }
    return (
      erpAccountsList?.find((option) => option?.code === fromAccountCode) ||
      null
    );
  };

  const getToSelectedValue = () => {
    if (toAccountType === "client") {
      return (
        renderOptions()?.find((option) => option?.id === toClientId) || null
      );
    }
    return (
      erpAccountsList?.find((option) => option?.code === toAccountCode) || null
    );
  };

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("reports.newTransaction")}
        onClose={onCloseAndRemoveState}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <div
            className="custom-scrollbar"
            style={{
              maxHeight: "340px",
              overflow: "scroll",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={classes.inputsRowStyle}>
              <div style={classes.inputsColumnStyle}>
                <div style={classes.inputsRowStyle}>
                  <div style={classes.date2FilterContainer}>
                    <h3 style={classes.filterLabelStyle}>
                      {t("reports.debitAccount")}
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
                          ? t(
                              `sales.quote.${
                                isPurchaseReport
                                  ? "chooseSupplier"
                                  : "chooseCustomer"
                              }`
                            )
                          : t("reports.selectAccountCode")}
                      </h3>
                      {fromAccountType === "client" ? (
                        <ClientAutocomplete
                          key={fromAccountType}
                          value={getFromSelectedValue()}
                          clientType={
                            isPurchaseReport
                              ? CLIENT_TYPE.SUPPLIER
                              : CLIENT_TYPE.CUSTOMER
                          }
                          options={renderOptions() ? renderOptions() : []}
                          getOptionLabel={(option: any) => `${option.name}`}
                          onChangeTextField={checkWhatRenderArray}
                          style={classes.textInputStyle}
                          onChange={handleFromChange}
                          loading={isFetching}
                        />
                      ) : (
                        <GoMakeAutoComplate
                          key={fromAccountType}
                          getOptionLabel={(option: any) => option?.name || ""}
                          options={erpAccountsList}
                          style={classes.textInputStyle}
                          placeholder={t("reports.selectAccountCode")}
                          value={getFromSelectedValue()}
                          onChange={handleFromChange}
                        />
                      )}
                    </div>
                  )}
                </div>
                <div style={classes.inputsRowStyle}>
                  <div style={classes.date2FilterContainer}>
                    <h3 style={classes.filterLabelStyle}>
                      {t("reports.creditAccount")}
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
                          ? t(
                              `sales.quote.${
                                isPurchaseReport
                                  ? "chooseSupplier"
                                  : "chooseCustomer"
                              }`
                            )
                          : t("reports.selectAccountCode")}
                      </h3>
                      {toAccountType === "client" ? (
                        <ClientAutocomplete
                          key={toAccountType}
                          value={getFromSelectedValue()}
                          clientType={
                            isPurchaseReport
                              ? CLIENT_TYPE.SUPPLIER
                              : CLIENT_TYPE.CUSTOMER
                          }
                          options={renderOptions() ? renderOptions() : []}
                          getOptionLabel={(option: any) => `${option.name}`}
                          onChangeTextField={checkWhatRenderArray}
                          style={classes.textInputStyle}
                          onChange={handleToChange}
                          loading={isFetching}
                        />
                      ) : (
                        <GoMakeAutoComplate
                          key={toAccountType}
                          options={erpAccountsList}
                          getOptionLabel={(option: any) => option.name}
                          style={classes.textInputStyle}
                          placeholder={t("reports.selectAccountCode")}
                          value={getToSelectedValue()}
                          onChange={handleToChange}
                        />
                      )}
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
                <h3 style={classes.filterLabelStyle}>{t("reports.dueDate")}</h3>
                <div
                  style={classes.datePickerinvidualContainer}
                  onClick={handleClickSelectDueDate}
                >
                  <div style={classes.dateStyle}>
                    {selectedDueDate
                      ? DateFormatter(selectedDueDate)
                      : t("sales.quote.selectDate")}
                    <div style={classes.datePickerContainer}>
                      <input
                        type="date"
                        onChange={(e) => {
                          setSelectedDueDate(e.target.value);
                        }}
                        ref={dueDateRef}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div style={classes.date2FilterContainer}>
                <h3 style={classes.filterLabelStyle}>
                  {t("reports.reference")}
                </h3>
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

            <div style={{ width: "80%", gap: "10px" }}>
              <h3 style={classes.filterLabelStyle}>
                {t("usersSettings.description")}
              </h3>
              <GomakeTextInput
                placeholder={t("preferences.enterDescription")}
                multiline
                style={classes.descriptionStyle}
                value={description}
                onChange={onChangeDescription}
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
