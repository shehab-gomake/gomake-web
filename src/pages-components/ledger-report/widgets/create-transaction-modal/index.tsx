
import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";

import { useCreateNewTransaction } from "./use-create-transaction";
import { useStyle } from "./style";
import { DateFormatter } from "@/utils/adapter";


const CreateNewTransactionModal = ({ openModal, onCloseModal }) => {
  const { clasess } = useStyle();
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
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <div style={clasess.inputsRowStyle}>
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
            <div style={clasess.date2FilterContainer}>
              <h3 style={clasess.filterLabelStyle}>Account Code</h3>
              <GoMakeAutoComplate
                key={selectErpAccount?.code}
                options={erpAccountsList}
                getOptionLabel={(option: any) => `${option.name}`}
                style={clasess.textInputStyle}
                placeholder="Select Account Code"
                onChange={handleERPAccountChange}
                value={selectErpAccount}
              />
            </div>
            <div style={clasess.date2FilterContainer}>
              <h3 style={clasess.filterLabelStyle}>Type</h3>
              <GoMakeAutoComplate
                key={selectAccountType?.id}
                options={accountTypeList}
                getOptionLabel={(option: any) => `${option.name}`}
                style={clasess.textInputStyle}
                placeholder="Select Type"
                onChange={handleAccountTypeChange}
                value={selectAccountType}
              />
            </div>
            <div style={clasess.date2FilterContainer}>
              <h3 style={clasess.filterLabelStyle}>{t("reports.price")}</h3>
              <GomakeTextInput style={clasess.textInputStyle} placeholder="Enter Price" type="number" onChange={onChangePrice} />

            </div>
            <div style={clasess.date2FilterContainer}>
              <h3 style={clasess.filterLabelStyle}>Reference</h3>
              <GomakeTextInput style={clasess.textInputStyle} placeholder="Enter Reference" onChange={onChangeReference} />
            </div>
            <div style={clasess.date2FilterContainer}>
              <h3 style={clasess.filterLabelStyle}>Reference Date</h3>
              <div style={clasess.datePickerinvidualContainer} onClick={handleClickSelectDate}>
                <div
                  style={clasess.dateStyle}

                >
                  {selectDate ? DateFormatter(selectDate) : t("sales.quote.selectDate")}
                  <div style={clasess.datePickerContainer}>
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
          <GomakePrimaryButton style={clasess.createBtnStyle} onClick={createTransactionsApi}>Create New Transaction</GomakePrimaryButton>
        </div>
      </GoMakeModal>
    </>
  );
};

export { CreateNewTransactionModal };