import { useEffect } from "react";
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
import { generalInputs, lastOrderInputs } from "./inputs/general-inputs";
import { Stack } from "@mui/material";
import {
  CLIENT_TYPE,
  CUSTOMER_ACTIONS,
} from "@/pages/customers/enums";
import { ChangePasswordComponent } from "@/components/change-password/change-password-component";
import { ClientTypeModal } from "./components/add-client-type-modal/add-client-type-modal";
import { SettingIcon } from "../shared-admin-customers/add-product/icons/setting";
import { SecondaryButton } from "@/components/button/secondary-button";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useCustomerCard } from "./use-customer-card";
import { TableFilter } from "./components/table-filter";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { ITab } from "@/components/tabs/interface";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { AccountingTab } from "./components/accounting-tab";
import { GeneralTab } from "./components/general-tab/form";

interface IProps {
  isValidCustomer?: (
    value: any,
    value1: any,
    value2: any,
    value3: any
  ) => boolean;
  customerAction?: CUSTOMER_ACTIONS;
  codeFlag?: boolean;
  typeClient?: string;
  getAllCustomers?: () => void;
  onCustomerAdd?: (value: any) => void;
  openModal?: boolean;
  modalTitle?: string;
  onClose?: () => void;
  customer?: any;
  setCustomer?: (customer: any) => void;
  showUpdateButton?: boolean;
  showAddButton?: boolean;
  isgetAllCustomers?: boolean;
  isFromHomePage?: boolean;
  setOpenOfferModal?: any;
  userQuote?: any;
  isFromCartPage?: boolean;
  onChangeSelectBusiness?: any;
}

const CustomerCardWidget = ({
  isValidCustomer,
  codeFlag,
  typeClient,
  getAllCustomers,
  onCustomerAdd,
  openModal,
  modalTitle,
  onClose,
  customer,
  setCustomer,
  showUpdateButton,
  showAddButton,
  isgetAllCustomers = true,
  isFromHomePage = false,
  setOpenOfferModal,
  userQuote,
  isFromCartPage = false,
  onChangeSelectBusiness
}: IProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
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
    onChangeInputs
  } = useCustomerCard({
    t, customer, setCustomer, onClose, setOpenOfferModal, userQuote, typeClient,
    isValidCustomer,
    getAllCustomers,
    onCustomerAdd,
    isgetAllCustomers,
    isFromCartPage,
    onChangeSelectBusiness
  });

  useEffect(() => {
    if (customer) {
      setContacts(customer.contacts ? customer.contacts : [])
      setAddresses(customer.addresses ? customer.addresses : [])
      setUsers(customer.users ? customer.users : [])
    }
  }, [])

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

  const renderAddButton = (onClick, labelKey) => (
    <div style={classes.addNewStyle}>
    <AddIcon onClick={onClick} />
    <button style={classes.buttonsStyle} onClick={onClick}>
      {t(labelKey)}
    </button>
  </div>
  );

  const renderTableSearch = <>{(isFromHomePage && showTable) &&
    <Stack>
      <TableFilter onChangeShowInActive={onShowInActiveCustomers} />
      <PrimaryTable
        rows={getAllSimilarCustomersData().map(mapCustomerData)}
        headers={customerTableHeaders}
        maxHeight={300}
        stickyHeader={true}
      />
    </Stack>
  }</>

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
          renderTableSearch={renderTableSearch} />
      ),
    },
    {
      title: t("customers.modal.contacts"),
      component: (
        <Stack direction={"column"} gap={"15px"}>
          {renderAddButton(addEmptyContact, "customers.buttons.addContact")}
          <Stack direction={"column"}>
            {contacts
              .filter((contact) => !contact.isMainContact)
              .map((x) => (
                <ContactForm
                  key={x.index}
                  contact={x}
                  onDelete={deleteContactForm}
                  setContact={(updatedContactData) =>
                    updateContact(x.index, updatedContactData)
                  }
                />
              ))}
          </Stack>
        </Stack>
      ),
    },
    {
      title: t("customers.modal.addresses"),
      component: (
        <Stack direction={"column"} gap={"15px"}>
          {renderAddButton(addEmptyAddress, "customers.buttons.newAddress")}
          <Stack direction={"column"}>
            {addresses.map((x) => (
              <AddressForm
                key={x.index}
                address={x}
                onDelete={deleteAddressForm}
                setAddress={(updatedAddressData) =>
                  updateAddress(x.index, updatedAddressData)
                }
              ></AddressForm>
            ))}
          </Stack>
        </Stack>
      ),
    },
    {
      title: t("customers.modal.accounting"),
      component: (
        <AccountingTab clientType={typeClient} onChangeInputs={onChangeInputs} state={customer} />
      ),
    },
    typeClient === CLIENT_TYPE.CUSTOMER && {
      title: t("customers.modal.gomakeUsers"),
      component: (
        <Stack direction={"column"} gap={"15px"}>
          {renderAddButton(addEmptyClient, "customers.buttons.addUser")}
          <Stack direction={"column"}>
            {users?.map((x) => (
              <UserForm
                key={x.index}
                user={x}
                onDelete={deleteUserForm}
                setUser={(updatedUserData) =>
                  updateUser(x.index, updatedUserData)
                }
              ></UserForm>
            ))}
          </Stack>
        </Stack>
      ),
    },
  ].filter(Boolean);

  return (
    <GoMakeModal
      openModal={open}
      modalTitle={t(modalTitle)}
      onClose={handleClose}
      insideStyle={classes.insideStyle}
    >
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", overflow: "hidden", justifyContent: "flex-end" }}>
        <div style={classes.mainContainerStyle} >
          <Stack direction={"row"}>
            <span style={classes.subTitleStyle}>
              {typeClient == "C"
                ? t("customers.modal.customerInfo")
                : t("suppliers.supplierInfo")}
            </span>
          </Stack>
          <div style={classes.customerInfoStyle}>
            {customerInputs(
              typeClient,
              codeFlag,
              customer,
              clientTypesCategories
            ).map((item) => (
              <div style={{ marginBottom: 10 }}>
                <FormInput
                  key={"customer-input"}
                  input={item as IInput}
                  changeState={onChangeInputs}
                  error={item.required && !item.value}
                  readonly={!!item.readonly}
                />
              </div>
            ))}
            <div style={classes.itemOnFirstContainer}>
              <div style={classes.labelTitleStyle}>
                <div style={classes.inputLbl}>
                  <Stack
                    direction={"row"}
                    gap={"7px"}
                    alignItems={"flex-end"}
                    padding={"0 5px"}
                  >{clientTypeLabel}</Stack>
                  <span style={classes.required}>*</span>
                </div>
                <span onClick={onClickOpenClientType} style={classes.plusInput}>
                  <SettingIcon
                    width={20}
                    height={20}
                  />
                </span>
              </div>
              <div style={{ width: "180px" }}>
                <GoMakeAutoComplate
                  key={customer}
                  options={clientTypesCategories}
                  placeholder={typeClient === "C" ? t("customers.modal.clientType") : t("suppliers.supplierType")}
                  style={classes.dropDownListStyle}
                  getOptionLabel={(option: any) => option.label}
                  value={clientTypesCategories?.find((option: any) => option?.id === customer?.clientTypeId)}
                  onChange={(e: any, value: any) => onChangeInputs("clientTypeId", value?.id)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* bottom section */}
        <div style={classes.bottomSectionStyle}>
          <PrimaryTabsComponent variant="ButtonedTabs" tabs={tabs} withBackGround={true} />
        </div>
        <div style={classes.footerStyle}>
          {isFromHomePage && !showTable ?
            <SecondaryButton variant="contained" style={{ width: "fit-content" }} onClick={handleShowTable} >{t("customers.buttons.search")}</SecondaryButton>
            :
            showAddButton && (
              <SecondaryButton variant="contained" style={{ width: "fit-content" }}
                onClick={handleAddCustomer}
              >
                {typeClient == "C"
                  ? t("customers.buttons.addCustomer")
                  : t("suppliers.buttons.addSupplier")}
              </SecondaryButton>
            )
          }
          <PermissionCheck userPermission={Permissions.EDIT_CLIENT}>
            {showUpdateButton && (
              <SecondaryButton variant="contained"
                style={{ width: "fit-content" }}
                onClick={handleEditCustomer}
              >
                {typeClient == "C"
                  ? t("customers.buttons.updateChanges")
                  : t("suppliers.buttons.updateChanges")}
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
      <ClientTypeModal
        openModal={isClientType}
        onClose={onClickCloseClientType}
        modalTitle={typeClient === "C"
          ? t("customers.customerTypes")
          : t("suppliers.supplierTypes")}
        clientTypeId={clientTypeId}
      />
    </GoMakeModal>
  );
};

export { CustomerCardWidget };