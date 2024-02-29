import { useStyle } from "./style";
import { DepositHeaderSection } from "./components/header-section";
import { useDeposit } from "./use-deposit";
import { DepositTable } from "./components/table-prices-section";

interface IProps {
  actionType: "create" | "show";
}

const DepositPageWidget = ({ actionType }: IProps) => {
  const { classes } = useStyle();

  const {tableHeaders} = useDeposit();
  return (
    <>
      <div style={classes.mainContainer}>
        <div style={classes.secondContainer}>
          <div style={{ paddingLeft: 20, paddingRight: 12 }}>
            <DepositHeaderSection actionType={actionType} />
          
            {/* <div style={classes.borderSecondContainer}>
           
                <ContactNewWidget
                  handleShowLess={handleShowLess}
                  items={items}
                  displayedItems={displayedItems}
                  setIsDisplayWidget={setIsDisplayWidget}
                  onOpenDeleteModalContact={onOpenDeleteModalContact}
                  changeItems={changeItems}
                  updateClientContact={updateClientContact}
                  setIsUpdateContactName={setIsUpdateContactName}
                  isUpdateContactMobile={isUpdateContactMobile}
                  setIsUpdateContactMobile={setIsUpdateContactMobile}
                  isUpdateContactEmail={isUpdateContactEmail}
                  setIsUpdateContactEmail={setIsUpdateContactEmail}
                  handleShowMore={handleShowMore}
                  isDisplayWidget={isDisplayWidget}
                  clientContactsValue={clientContactsValue}
                  onBlurContactName={onBlurContactName}
                  setSelectedContactById={setSelectedContactById}
                  selectedContactById={selectedContactById}
                  onBlurContactMobile={onBlurContactMobile}
                  onInputChangePhone={onInputChangePhone}
                  onBlurContactEmail={onBlurContactEmail}
                  onInputChangeMail={onInputChangeMail}
                  onClickAddNewContact={onClickAddNewContact}
                  openDeleteModalContact={openDeleteModalContact}
                  onCloseDeleteModalContact={onCloseDeleteModalContact}
                  onClickDeleteContact={onClickDeleteContact}
                  selectedContact={selectedContact}
                  isQuoteConfirmation={isQuoteConfirmation}
                />
              </div> */}
          </div>
          <div
              style={{
                flex: 0.9,
                overflow: "auto",
                paddingLeft: 20,
                paddingRight: 12,
              }}
            >
              {/* <DepositTable tableHeaders={tableHeaders} /> */}
            </div>
        </div>

      </div>

    </>
  );
};

export { DepositPageWidget };
