// Complete file - ready to copy and replace your existing CustomerCardWidget
// This version uses simple scroll for small lists (no virtualization issues!)
// For large lists (100+), uncomment the react-virtuoso section

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useStyle } from "./style";
import { GoMakeAutoComplate, GoMakeModal } from "@/components";
import { TextareaAutosize } from "@mui/base";
import { ContactForm } from "./components/contacts-tab";
import { AddressForm } from "./components/address-tab";
import { UserForm } from "./components/gomakeUser-tab/form";
import { AddIcon } from "@/components/icons/icons";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { customerInputs } from "./inputs/customer-inputs";
import { IconButton, Stack } from "@mui/material";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { ChangePasswordComponent } from "@/components/change-password/change-password-component";
import { SecondaryButton } from "@/components/button/secondary-button";
import { PrimaryButton } from "@/components/button/primary-button";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useCustomerCard } from "./use-customer-card";
import { TableFilter } from "./components/table-filter";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { ITab } from "@/components/tabs/interface";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { AccountingTab } from "./components/accounting-tab";
import { GeneralTab } from "./components/general-tab/form";
import { BudgetTab } from "./components/budget-tab";
import { LedgerReportWidget } from "@/pages-components/ledger-report/ledger-report";
import { ClientBalance } from "./components/client-balance/client-balance";
import { ClientTypeModal } from "../client-types/components/add-edit-client-type-modal";
import { PlusIcon } from "@/icons";

// OPTIONAL: Uncomment these imports if you have 100+ contacts and want virtualization
import { Virtuoso, VirtuosoHandle } from "react-virtuoso"; // npm install react-virtuoso

interface IProps {
  customerAction: CUSTOMER_ACTIONS;
  codeFlag?: boolean;
  typeClient: CLIENT_TYPE;
  getAllCustomers?: () => void;
  onCustomerAdd?: (value: any) => void;
  openModal?: boolean;
  onClose?: () => void;
  customer?: any;
  setCustomer?: (customer: any) => void;
  isgetAllCustomers?: boolean;
  isFromHomePage?: boolean;
  setOpenOfferModal?: any;
  userQuote?: any;
  isFromCartPage?: boolean;
  onChangeSelectBusiness?: any;
  selectedTabIndex?: number;
}

const CustomerCardWidget = ({
  codeFlag,
  typeClient,
  getAllCustomers,
  onCustomerAdd,
  openModal,
  onClose,
  customer,
  setCustomer,
  customerAction,
  isgetAllCustomers = true,
  isFromHomePage = false,
  setOpenOfferModal,
  userQuote,
  isFromCartPage = false,
  onChangeSelectBusiness,
  selectedTabIndex = undefined,
}: IProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const isCustomer = typeClient === CLIENT_TYPE.CUSTOMER;
  const isSupplier = typeClient === CLIENT_TYPE.SUPPLIER;
  const showUpdateButton = customerAction === CUSTOMER_ACTIONS.Edit;
  const showAddButton = customerAction === CUSTOMER_ACTIONS.Add;
  const contactListRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const {
    customerTableHeaders,
    mapCustomerData,
    showTable,
    getAllSimilarCustomersData,
    onShowInActiveCustomers,
    users,
    setUsers,
    addresses,
    setAddresses,
    contacts,
    setContacts,
    addInitUser,
    addInitAddress,
    addInitContact,
    deleteUserForm,
    deleteContactForm,
    deleteAddressForm,
    updateContact,
    updateAddress,
    updateUser,
    addEmptyContact,
    addEmptyClient,
    addEmptyAddress,
    open,
    setOpen,
    handleEditCustomer,
    handleAddCustomer,
    clientTypeId,
    setResetPassModalModal,
    resetPassModal,
    clientTypesCategories,
    handleClose,
    clientTypeLabel,
    languagesOptions,
    isClientType,
    onClickCloseClientType,
    onClickOpenClientType,
    handleShowTable,
    onUpdatePass,
    onChangeInputs,
    clientGroupList,
    addGroupName,
    newGroupId,
    setNewGroupId,
    CheckPermission,
    profileState,
    systemCurrency,
    defaultPaymentTerm,
    getAllShipmentTypes,
    shipmentTypes,
    primaryColor,
    secondaryColor,
  } = useCustomerCard({
    t,
    customer,
    setCustomer,
    onClose,
    setOpenOfferModal,
    userQuote,
    typeClient,
    getAllCustomers,
    onCustomerAdd,
    isgetAllCustomers,
    isFromCartPage,
    onChangeSelectBusiness,
    openModal,
  });

  const [inputValue, setInputValue] = useState("");
  const dir: "rtl" | "ltr" = t("direction");

  useEffect(() => {
    if (newGroupId) {
      const newlyAddedGroup = clientGroupList.find(
        (option: any) => option?.id === newGroupId
      );
      if (newlyAddedGroup) {
        onChangeInputs("clientGroupId", newGroupId);
        setNewGroupId(null);
      }
    }
  }, [newGroupId, clientGroupList, onChangeInputs]);

  useEffect(() => {
    if (customer) {
      if (customer?.contacts && customer?.contacts?.length > 0) {
        const contactsWithIndex = customer.contacts.map((contact, i) => ({
          ...contact,
          index: contact.index ?? i + 1,
        }));
        setContacts(contactsWithIndex);
      }
      if (customer?.addresses && customer?.addresses?.length > 0) {
        const addressesWithIndex = customer.addresses.map((address, i) => ({
          ...address,
          index: address.index ?? i + 1,
        }));
        setAddresses(addressesWithIndex);
      }
      if (customer?.users && customer?.users?.length > 0) {
        const usersWithIndex = customer.users.map((user, i) => ({
          ...user,
          index: user.index ?? i + 1,
        }));
        setUsers(usersWithIndex);
      }
    }
  }, [customer]);

  useEffect(() => {
    addInitContact();
    addInitAddress();
    addInitUser();
    setOpen(openModal);
  }, [openModal]);

  const renderTabPanelTextArea = (
    placeHolder = null,
    value = null,
    onchange = null
  ) => {
    return (
      <Stack direction={"column"} width={"33.33%"}>
        <TextareaAutosize
          style={classes.textAreaStyle}
          placeholder={placeHolder}
          value={value}
          onChange={onchange}
        />
      </Stack>
    );
  };

  const handleAddEmptyContact = useCallback(() => {
    addEmptyContact();

    // Auto-scroll to the last item after adding
    setTimeout(() => {
      const filteredContacts =
        contacts?.filter((contact) => !contact.isMainContact) || [];
      if (virtuosoRef.current && filteredContacts.length > 0) {
        virtuosoRef.current.scrollToIndex({
          index: filteredContacts.length - 1,
          behavior: "smooth",
          align: "end",
        });
      }
    }, 100);
  }, [addEmptyContact, contacts]);

  const renderAddButton = (onClick, labelKey) => (
    <div style={classes.addNewStyle}>
      <AddIcon onClick={onClick} color={primaryColor(500)} />
      <button style={classes.buttonsStyle} onClick={onClick}>
        {t(labelKey)}
      </button>
    </div>
  );

  // // Handle adding new contact with auto-scroll to bottom
  // const handleAddEmptyContact = useCallback(() => {
  //   addEmptyContact();

  //   // Scroll to bottom after adding new contact
  //   setTimeout(() => {
  //     if (contactListRef.current) {
  //       contactListRef.current.scrollTop = contactListRef.current.scrollHeight;
  //     }
  //   }, 100);
  // }, [addEmptyContact]);

  const renderTableSearch = (
    <>
      {isFromHomePage && showTable && (
        <Stack>
          <TableFilter onChangeShowInActive={onShowInActiveCustomers} />
          <PrimaryTable
            rows={getAllSimilarCustomersData().map(mapCustomerData)}
            headers={customerTableHeaders}
            maxHeight={300}
            stickyHeader={true}
          />
        </Stack>
      )}
    </>
  );

  const tabs: ITab[] = [
    {
      title: t("customers.modal.general"),
      component: (
        <GeneralTab
          customer={customer}
          setCustomer={setCustomer}
          codeFlag={codeFlag}
          onChangeInputs={onChangeInputs}
          typeClient={typeClient}
          renderTabPanelTextArea={renderTabPanelTextArea}
          languagesOptions={languagesOptions}
          renderTableSearch={renderTableSearch}
          showTable={showTable}
          profileState={profileState}
          customerAction={customerAction}
          ShipmentTypesList={shipmentTypes}
        />
      ),
    },
    {
      title: t("customers.modal.contacts"),
      component: (
        <Stack direction={"column"} gap={"15px"} style={{ height: "100%" }}>
          {renderAddButton(
            handleAddEmptyContact,
            "customers.buttons.addContact"
          )}

          {/* OPTIONAL: Virtualized solution for 100+ contacts */}
          {/* Uncomment this section and comment out the above div if you have many contacts */}

          <Virtuoso
            ref={virtuosoRef}
            style={{
              height: "400px",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
            }}
            data={contacts?.filter((contact) => !contact.isMainContact) || []}
            itemContent={(index, contact) => (
              <div style={{ padding: "10px" }}>
                <ContactForm
                  key={`contact-${contact.index}-${contact.id || index}`}
                  contact={contact}
                  onDelete={deleteContactForm}
                  setContact={(updatedContactData) =>
                    updateContact(contact.index, updatedContactData)
                  }
                />
              </div>
            )}
            // overscan={200}
            // increaseViewportBy={{ top: 100, bottom: 100 }}
            // defaultItemHeight={280}
            // followOutput="smooth"
            components={{
              EmptyPlaceholder: () => (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#999",
                  }}
                >
                  {t("customers.noContactsAdded")}
                </div>
              ),
            }}
          />
        </Stack>
      ),
    },
    {
      title: t("customers.modal.addresses"),
      component: (
        <Stack direction={"column"} gap={"15px"}>
          {renderAddButton(addEmptyAddress, "customers.buttons.newAddress")}
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              overflowX: "hidden",
              scrollBehavior: "smooth",
            }}
          >
            <Stack direction={"column"} gap={"15px"}>
              {addresses?.map((x) => (
                <AddressForm
                  key={`address-${x.index}-${x.isDefault}`}
                  address={x}
                  onDelete={deleteAddressForm}
                  setAddress={(updatedAddressData) =>
                    updateAddress(x.index, updatedAddressData)
                  }
                />
              ))}
            </Stack>
          </div>
        </Stack>
      ),
    },
    {
      title: t("customers.modal.accounting"),
      component: (
        <AccountingTab
          clientType={typeClient}
          onChangeInputs={onChangeInputs}
          state={customer}
          defaultPaymentTerm={defaultPaymentTerm}
          isAddAction={customerAction === CUSTOMER_ACTIONS.Add}
        />
      ),
    },
    {
      title: t("budget"),
      component: <BudgetTab state={customer} />,
    },
    isCustomer && {
      title: t("customers.modal.gomakeUsers"),
      component: (
        <Stack direction={"column"} gap={"15px"}>
          {renderAddButton(addEmptyClient, "customers.buttons.addUser")}
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              overflowX: "hidden",
              scrollBehavior: "smooth",
            }}
          >
            <Stack direction={"column"} gap={"15px"}>
              {users?.map((x) => (
                <UserForm
                  key={`user-${x.index}`}
                  user={x}
                  onDelete={deleteUserForm}
                  setUser={(updatedUserData) =>
                    updateUser(x.index, updatedUserData)
                  }
                />
              ))}
            </Stack>
          </div>
        </Stack>
      ),
    },
    {
      title: t("tabs.ledgerReport"),
      component: (
        <LedgerReportWidget
          clientType={CLIENT_TYPE.CUSTOMER}
          customerId={customer?.id}
          isFromCustomerCard={true}
          autoShowCard={true}
        />
      ),
    },
  ].filter(Boolean);

  useEffect(() => {
    if (!customer?.currency && systemCurrency) {
      setCustomer((prev) => ({
        ...prev,
        currency: systemCurrency,
      }));
    }
  }, [customer?.currency, systemCurrency]);

  const getModalTitle = () => {
    if (isSupplier) {
      return customerAction === CUSTOMER_ACTIONS.Edit
        ? t("suppliers.editModalTitle")
        : t("suppliers.addModalTitle");
    }

    return customerAction === CUSTOMER_ACTIONS.Edit
      ? t("customers.modal.editTitle")
      : t("customers.modal.addTitle");
  };

  useEffect(() => {
    if (openModal) {
      getAllShipmentTypes();
    }
  }, [openModal]);

  return (
    <>
      {/* Optional: Add custom scrollbar styles */}
      <style jsx global>{`
        .contact-list-container::-webkit-scrollbar {
          width: 8px;
        }

        .contact-list-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .contact-list-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        .contact-list-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>

      <GoMakeModal
        openModal={open}
        modalTitle={getModalTitle()}
        onClose={handleClose}
        insideStyle={classes.insideStyle}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            justifyContent: "flex-end",
          }}
        >
          <div style={classes.mainContainerStyle}>
            <Stack direction={"row"}>
              <span style={classes.subTitleStyle}>
                {isCustomer
                  ? t("customers.modal.customerInfo")
                  : t("suppliers.supplierInfo")}
              </span>
            </Stack>
            <div style={classes.customerInfoStyle}>
              {customerInputs(typeClient, customer, showUpdateButton).map(
                (item, index) => (
                  <div
                    key={`customer-input-${index}`}
                    style={{ marginBottom: 10 }}
                  >
                    <FormInput
                      input={item as IInput}
                      changeState={onChangeInputs}
                      error={item.required && !item.value}
                      readonly={!!item.readonly}
                    />
                  </div>
                )
              )}
              <div style={classes.itemOnFirstContainer}>
                <div style={classes.labelTitleStyle}>
                  <div style={classes.inputLbl}>
                    <Stack
                      direction={"row"}
                      gap={"7px"}
                      alignItems={"flex-end"}
                      padding={"0 5px"}
                    >
                      {clientTypeLabel}
                    </Stack>
                    <span style={classes.required}>*</span>
                  </div>
                  <IconButton
                    onClick={onClickOpenClientType}
                    size="small"
                    sx={{ padding: "4px" }}
                  >
                    <PlusIcon color={secondaryColor(500)} />
                  </IconButton>
                </div>
                {/* !here */}
                <div style={{ width: "180px" }}>
                  <GoMakeAutoComplate
                    key={customer?.clientTypeId || "default"}
                    options={clientTypesCategories}
                    placeholder={
                      isCustomer
                        ? t("customers.modal.clientType")
                        : t("suppliers.supplierType")
                    }
                    style={classes.dropDownListStyle}
                    getOptionLabel={(option: any) => option.label}
                    value={clientTypesCategories?.find(
                      (option: any) => option?.id === customer?.clientTypeId
                    )}
                    onChange={(e: any, value: any) =>
                      onChangeInputs("clientTypeId", value?.id)
                    }
                  />
                </div>
              </div>
              {CheckPermission(Permissions.SHOW_GROUPS) && (
                <div style={classes.itemOnFirstContainer}>
                  <div style={classes.labelTitleStyle}>
                    <div style={classes.inputLbl}>
                      <Stack
                        direction={"row"}
                        gap={"7px"}
                        alignItems={"flex-end"}
                        padding={"0 5px"}
                      >
                        {t("products.profits.exceptions.groupBy")}
                      </Stack>
                    </div>
                  </div>
                  <div style={{ width: "180px" }}>
                    <GoMakeAutoComplate
                      key={customer?.clientGroupId}
                      options={
                        clientGroupList.find(
                          (option: any) => option.groupName === inputValue
                        ) || inputValue === ""
                          ? clientGroupList
                          : [
                              {
                                groupName: `Add "${inputValue}" as a new group`,
                                id: "new",
                              },
                              ...clientGroupList,
                            ]
                      }
                      placeholder={t("products.profits.exceptions.groupBy")}
                      style={classes.dropDownListStyle}
                      getOptionLabel={(option: any) => option.groupName}
                      value={clientGroupList?.find(
                        (option: any) => option?.id === customer?.clientGroupId
                      )}
                      onChange={(e: any, value: any) => {
                        if (value?.id === "new") {
                          addGroupName(inputValue);
                          setInputValue("");
                        } else {
                          onChangeInputs("clientGroupId", value?.id);
                          setInputValue("");
                        }
                      }}
                      onInputChange={(event: any, newInputValue: string) => {
                        setInputValue(newInputValue);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* bottom section */}
          <div style={classes.bottomSectionStyle}>
            <PrimaryTabsComponent
              variant="ButtonedTabs"
              tabs={tabs}
              withBackGround={true}
              selectedTabIndex={selectedTabIndex}
            >
              <ClientBalance clientId={customer?.id} />
            </PrimaryTabsComponent>
          </div>
          <div style={classes.footerStyle}>
            {isFromHomePage && showAddButton && (
              <Stack direction="row" gap={2}>
                <PrimaryButton
                  variant="contained"
                  style={{ width: "fit-content" }}
                  onClick={handleShowTable}
                >
                  {t("customers.buttons.search")}
                </PrimaryButton>
                {showTable && (
                  <SecondaryButton
                    variant="contained"
                    style={{ width: "fit-content" }}
                    onClick={handleAddCustomer}
                  >
                    {isCustomer
                      ? t("customers.buttons.addCustomer")
                      : t("suppliers.buttons.addSupplier")}
                  </SecondaryButton>
                )}
              </Stack>
            )}
            {!isFromHomePage && showAddButton && (
              <SecondaryButton
                variant="contained"
                style={{ width: "fit-content" }}
                onClick={handleAddCustomer}
              >
                {isCustomer
                  ? t("customers.buttons.addCustomer")
                  : t("suppliers.buttons.addSupplier")}
              </SecondaryButton>
            )}
            <PermissionCheck userPermission={Permissions.EDIT_CLIENT}>
              {showUpdateButton && (
                <SecondaryButton
                  variant="contained"
                  style={{ width: "fit-content" }}
                  onClick={handleEditCustomer}
                >
                  {t("customers.buttons.updateChanges")}
                </SecondaryButton>
              )}
            </PermissionCheck>
          </div>
        </div>
        <GoMakeModal
          insideStyle={classes.secondInsideStyle}
          headerPadding={20}
          openModal={resetPassModal}
          onClose={() => setResetPassModalModal(false)}
          modalTitle={t("customers.buttons.changePassword")}
        >
          <ChangePasswordComponent onChangePassword={onUpdatePass} />
        </GoMakeModal>
        {isClientType && (
          <ClientTypeModal
            openModal={isClientType}
            onClose={onClickCloseClientType}
            modalTitle={
              isCustomer
                ? t("customers.buttons.addClientType")
                : t("suppliers.addSupplierType")
            }
            cardTypeId={clientTypeId}
            actionType="add"
          />
        )}
      </GoMakeModal>
    </>
  );
};

export { CustomerCardWidget };
