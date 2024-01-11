import { Tab, Tabs, ThemeProvider, createMuiTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useStyle } from "./style";
import { GoMakeModal } from "@/components";
import { TextareaAutosize } from "@mui/base";
import { ContactForm } from "./components/contacts-tab";
import { AddressForm } from "./components/address-tab";
import { UserForm } from "./components/gomakeUser-tab/form";
import { AddIcon } from "@/components/icons/icons";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { useAddCustomer } from "@/pages/customers/add-customer/use-add-customer";
import { useEditCustomer } from "@/pages/customers/edit-customer/use-edit-customer";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { customerInputs } from "./inputs/customer-inputs";
import { generalInputs, lastOrderInputs } from "./inputs/general-inputs";
import { Stack } from "@mui/material";
import {
  CLIENT_TYPE,
  CLIENT_TYPE_Id,
  CUSTOMER_ACTIONS,
} from "@/pages/customers/enums";
import { useSnackBar } from "@/hooks";
import { useRecoilState, useRecoilValue } from "recoil";
import { gomakeUserState } from "./components/gomakeUser-tab/gomakeUserState";
import { useUserProfile } from "@/hooks/use-user-profile";
import { resetPassModalState } from "./state";
import { ChangePasswordComponent } from "@/components/change-password/change-password-component";
import { clientTypesCategoriesState } from "@/pages/customers/customer-states";

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
}: IProps) => {
  const [open, setOpen] = useState(false);
  const { addNewCustomer } = useAddCustomer();
  const { editCustomer } = useEditCustomer();
  const { updateUserPassword } = useUserProfile();
  const { t } = useTranslation();
  const { alertRequiredFields } = useSnackBar();
  const [resetPassModal, setResetPassModalModal] =
    useRecoilState<boolean>(resetPassModalState);
  const [gomakeUser, setGomakeUser] = useRecoilState<any>(gomakeUserState);

  const theme = createMuiTheme({
    palette: {
      secondary: {
        main: "#FFF",
      },
    },
  });

  const tabPanelTextArea = (
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
        ></TextareaAutosize>
      </Stack>
    );
  };

  const { classes } = useStyle();
  const [selectedTab, setSelectedTab] = useState(0);
  const [contacts, setContacts] = useState(
    customer && customer.contacts ? customer.contacts : []
  );
  const [addresses, setAddresses] = useState(
    customer && customer.addresses ? customer.addresses : []
  );
  const [users, setUsers] = useState(
    customer && customer.users ? customer.users : []
  );
  const clientTypesCategories = useRecoilValue(clientTypesCategoriesState);

  useEffect(() => {
    addInitContact();
    addInitAddress();
    addInitUser();
    setOpen(openModal);
    setSelectedTab(0);
  }, [openModal]);

  const handleClose = () => {
    setOpen(false);
    onClose();
    setCustomer(null);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Contact info
  const addEmptyContact = () => {
    var temp = [...contacts];
    const index = temp.length + 1;
    temp.push({ name: "", index: index });
    setContacts(temp);
  };

  const addInitContact = () => {
    var temp = [];
    if (customer && customer.contacts) {
      temp = [...customer.contacts];
    } else {
      const index = temp.length + 1;
      temp.push({ name: "", index: index });
    }
    setContacts(temp);
  };

  const deleteContactForm = (index) => {
    var temp = [...contacts];
    temp = temp.filter((x) => x.index != index);

    temp.forEach((contact, i) => {
      if (contact?.index > index) {
        contact.index -= 1;
      }
    });
    setContacts(temp);
  };

  const updateContact = (index, updatedContactData) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.index === index
          ? { ...contact, ...updatedContactData }
          : contact
      )
    );
  };

  // Address info
  const addEmptyAddress = () => {
    var temp = [...addresses];
    const index = temp.length + 1;
    temp.push({ name: "", index: index, city: " ", street: " " });
    setAddresses(temp);
  };

  const addInitAddress = () => {
    var temp = [];
    if (customer && customer.addresses) {
      temp = [...customer.addresses];
    } else {
      const index = temp.length + 1;
      temp.push({ name: "", index: index, city: " ", street: " " });
    }
    setAddresses(temp);
  };

  const deleteAddressForm = (index) => {
    var temp = [...addresses];
    temp = temp.filter((x) => x.index != index);
    temp.forEach((address, i) => {
      if (address.index > index) {
        address.index -= 1;
      }
    });
    setAddresses(temp);
  };

  const updateAddress = (index, updatedAddressData) => {
    setAddresses((prevAddresses) =>
      prevAddresses.map((address) =>
        address.index === index
          ? { ...address, ...updatedAddressData }
          : address
      )
    );
  };

  // User info
  const addEmptyClient = () => {
    var temp = [...users];
    const index = temp.length + 1;
    temp.push({ name: "", index: index });
    setUsers(temp);
  };

  const addInitUser = () => {
    var temp = [];
    if (customer && customer.users) {
      temp = [...customer.users];
    } else {
      const index = temp.length + 1;
      temp.push({ name: "", index: index });
    }
    setUsers(temp);
  };

  const deleteUserForm = (index) => {
    var temp = [...users];
    temp = temp.filter((x) => x.index != index);
    temp.forEach((user, i) => {
      if (user.index > index) {
        user.index -= 1;
      }
    });
    setUsers(temp);
  };

  const updateUser = (index, updatedUserData) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.index === index ? { ...user, ...updatedUserData } : user
      )
    );
  };

  // add customer button
  const handleAddCustomer = async () => {
    const filteredContacts = contacts.filter(
      (contact) => !isNameIndexOnly(contact)
    );
    const filteredAddresses = addresses.filter(
      (address) => !isNameIndexOnly(address)
    );
    const filteredUsers = users.filter((user) => !isNameIndexOnly(user));
    const cardTypeId =
      typeClient === "C" ? CLIENT_TYPE_Id.CUSTOMER : CLIENT_TYPE_Id.SUPPLIER;
    const updatedCustomer = {
      ...customer,
      contacts: filteredContacts,
      addresses: filteredAddresses,
      users: filteredUsers,
      CardTypeId: cardTypeId,
    };
    setCustomer(updatedCustomer);
    if (
      isValidCustomer(
        updatedCustomer,
        filteredContacts,
        filteredAddresses,
        filteredUsers
      )
    ) {
      addNewCustomer(updatedCustomer).then((x) => {
        onCustomerAdd(x);
        handleClose();
      });
    } else {
      alertRequiredFields();
    }
  };

  // edit customer button
  const handleEditCustomer = () => {
    const filteredContacts = contacts.filter(
      (contact) => !isNameIndexOnly(contact)
    );
    const filteredAddresses = addresses.filter(
      (address) => !isNameIndexOnly(address)
    );
    const filteredUsers = users.filter((user) => !isNameIndexOnly(user));
    const updatedCustomer = {
      ...customer,
      contacts: filteredContacts,
      addresses: filteredAddresses,
      users: filteredUsers,
    };
    setCustomer(updatedCustomer);
    if (
      isValidCustomer(
        updatedCustomer,
        filteredContacts,
        filteredAddresses,
        filteredUsers
      )
    ) {
      editCustomer(updatedCustomer, setCustomer).then((x) => {
        getAllCustomers();
        handleClose();
      });
    } else {
      alertRequiredFields();
    }
  };

  const onChangeInputs = (key, value) => {
    setCustomer({ ...customer, [key]: value });
  };

  const onUpdatePass = async (
    currentPass: any,
    newPass: any,
    confirmPass: any
  ) => {
    const res = await updateUserPassword(
      currentPass,
      newPass,
      confirmPass,
      gomakeUser?.id
    );
    setResetPassModalModal(!res);
  };

  // in order to avoid sending an empty object that include just name & index
  const isNameIndexOnly = (dataObject) => {
    const { name, index, ...otherProps } = dataObject;
    const emptyProps = Object.values(otherProps).every(
      (prop) => prop === null || prop === "" || prop === " "
    );
    return emptyProps;
  };
  const tabLabels = [
    t("customers.modal.general"),
    t("customers.modal.contacts"),
    t("customers.modal.addresses"),
  ];

  return (
    <GoMakeModal
      openModal={open}
      modalTitle={t(modalTitle)}
      onClose={handleClose}
      insideStyle={classes.insideStyle}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "#FDFDFD",
          marginBottom: 10,
        }}
      >
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
                input={item as IInput}
                changeState={onChangeInputs}
                error={item.required && !item.value}
                readonly={!!item.readonly}
              />
            </div>
          ))}
        </div>
        <ThemeProvider theme={theme}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            textColor="secondary"
            TabIndicatorProps={{ style: { display: "none" } }}
          >
            {tabLabels.map((label, index) => (
              <Tab
                key={index}
                sx={{
                  backgroundColor:
                    selectedTab === index ? "#ED028C" : "#EBECFF",
                  color: selectedTab === index ? "#FFF" : "#3F3F3F",
                  minHeight: "0px",
                  height: "40px",
                  borderRadius: "4px",
                  padding: "10px",
                  marginRight: "10px",
                  textTransform: "none",
                  fontStyle: "normal",
                  ...FONT_FAMILY.Lexend(500, 16),
                  lineHeight: "normal",
                  width: `${Math.min(label.length * 12, 180)}px`,
                }}
                label={label}
                disabled={typeClient === CLIENT_TYPE.CUSTOMER && index === 3}
              />
            ))}
            {typeClient === CLIENT_TYPE.CUSTOMER && (
              <Tab
                sx={{
                  backgroundColor: selectedTab === 3 ? "#ED028C" : "#EBECFF",
                  color: selectedTab === 3 ? "#FFF" : "#3F3F3F",
                  minWidth: "0px",
                  minHeight: "0px",
                  height: "40px",
                  borderRadius: "4px",
                  padding: "10px",
                  marginRight: "10px",
                  textTransform: "none",
                  fontStyle: "normal",
                  ...FONT_FAMILY.Lexend(500, 16),
                  lineHeight: "normal",
                  width: `${Math.min(
                    t("customers.modal.gomakeUsers").length * 12,
                    180
                  )}px`,
                }}
                label={t("customers.modal.gomakeUsers")}
              />
            )}
          </Tabs>
        </ThemeProvider>
      </div>
      {selectedTab == 0 && (
        <div style={classes.customerInfoStyle}>
          {generalInputs(typeClient, customer).map((item) => (
            <div style={{ marginBottom: 10 }}>
              <FormInput
                input={item as IInput}
                changeState={onChangeInputs}
                error={false}
                readonly={false}
              />
            </div>
          ))}
        </div>
      )}

      {selectedTab == 0 && (
        <div>
          <Stack
            direction={"row"}
            marginTop={"8px"}
            marginBottom={"8px"}
            gap="20px"
          >
            {tabPanelTextArea(
              t("customers.modal.generalComment"),
              customer?.generalNotes,
              (e) => setCustomer({ ...customer, generalNotes: e.target.value })
            )}
            {tabPanelTextArea(
              t("customers.modal.orderOpeningNotes"),
              customer?.newItemNotes,
              (e) => setCustomer({ ...customer, newItemNotes: e.target.value })
            )}
            {tabPanelTextArea(
              t("customers.modal.orderClosingNotes"),
              customer?.closeOrderNotes,
              (e) =>
                setCustomer({ ...customer, closeOrderNotes: e.target.value })
            )}
          </Stack>
          {codeFlag && (
            <>
              <Stack direction={"row"}>
                <span
                  style={{
                    color: "var(--second-500, #ED028C)",
                    fontStyle: "normal",
                    ...FONT_FAMILY.Lexend(500, 14),
                    lineHeight: "normal",
                    marginBottom: 10,
                  }}
                >
                  {t("customers.modal.lastOrderDetails")}
                </span>
              </Stack>
              <div style={classes.customerInfoStyle}>
                {lastOrderInputs(customer).map((item) => (
                  <div style={{ marginBottom: 10 }}>
                    <FormInput
                      input={item as IInput}
                      changeState={onChangeInputs}
                      error={false}
                      readonly={!!item.readonly}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <div>
        {
          //contacts info
          selectedTab == 1 && (
            <Stack direction={"column"} gap={"15px"}>
              <Stack direction={"column"}>
                <a
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "5px",
                    cursor: "pointer",
                  }}
                  onClick={addEmptyContact}
                >
                  <AddIcon />
                  <button style={classes.buttonsStyle}>
                    {t("customers.buttons.addContact")}
                  </button>
                </a>
              </Stack>
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
          )
        }
        {
          //address info
          selectedTab == 2 && (
            <Stack direction={"column"} gap={"15px"}>
              <Stack direction={"column"}>
                <a
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "3px",
                  }}
                  onClick={addEmptyAddress}
                >
                  <AddIcon></AddIcon>
                  <button style={classes.buttonsStyle}>
                    {t("customers.buttons.newAddress")}
                  </button>
                </a>
              </Stack>
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
          )
        }
        {
          //GOMAKEUSER info
          selectedTab == 3 && (
            <Stack direction={"column"} gap={"15px"}>
              <Stack direction={"column"}>
                <a
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "5px",
                  }}
                  onClick={addEmptyClient}
                >
                  <AddIcon></AddIcon>
                  <button style={classes.buttonsStyle}>
                    {t("customers.buttons.addUser")}
                  </button>
                </a>
              </Stack>
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
          )
        }
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={classes.footerStyle}>
            {showAddButton && (
              <button
                style={classes.autoButtonStyle}
                onClick={handleAddCustomer}
              >
                {typeClient == "C"
                  ? t("customers.buttons.addCustomer")
                  : t("suppliers.buttons.addSupplier")}
              </button>
            )}
            {showUpdateButton && (
              <button
                style={classes.autoButtonStyle}
                onClick={handleEditCustomer}
              >
                {typeClient == "C"
                  ? t("customers.buttons.updateChanges")
                  : t("suppliers.buttons.updateChanges")}
              </button>
            )}
          </div>
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
    </GoMakeModal>
  );
};
export { CustomerCardWidget };
