import { PrimaryButton } from "@/components/button/primary-button";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { selectedClientState } from "@/pages-components/quotes/states";
import { getAllSimilarCustomerApi } from "@/services/api-service/customers/customers-api";
import { FONT_FAMILY } from "@/utils/font-family";
import { useCallback, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { prevSelectedClientState } from "@/pages-components/admin/home/widgets/quote-widget/states";
import { systemCurrencyState } from "@/store/user";
import { resetPassModalState } from "./state";
import { clientTypesCategoriesState } from "@/pages/customers/customer-states";
import { gomakeUserState } from "./components/gomakeUser-tab/gomakeUserState";
import { languagesState } from "@/store/languages";
import { useEditCustomer } from "@/pages/customers/edit-customer/use-edit-customer";
import { useAddCustomer } from "@/pages/customers/add-customer/use-add-customer";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { emailRegex } from "@/utils/regex";
import { useUserProfile } from "@/hooks/use-user-profile";

const useCustomerCard = ({ t, customer, setCustomer, onClose, setOpenOfferModal, userQuote, typeClient, isValidCustomer,
  getAllCustomers,
  onCustomerAdd,
  isgetAllCustomers,
  isFromCartPage,
  onChangeSelectBusiness }) => {
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();
  const [showTable, setShowTable] = useState(false);
  const [customerTableRows, setCustomerTableRows] = useState([]);
  const [showInActiveCustomers, setShowInActiveCustomers] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useRecoilState(selectedClientState);
  const { alertRequiredFields, alertFault } = useSnackBar();
  const systemCurrency = useRecoilValue<any>(systemCurrencyState);
  const [resetPassModal, setResetPassModalModal] = useRecoilState<boolean>(resetPassModalState);
  const clientTypesCategories = useRecoilValue(clientTypesCategoriesState);
  const gomakeUser = useRecoilValue<any>(gomakeUserState);
  const languagesOptions = useRecoilValue(languagesState);

  const customerTableHeaders = [
    t("customers.customerCode"),
    t("customers.name"),
    t("customers.email"),
    t("customers.phone"),
    t("customers.status"),
    t("home.headers.more"),
  ];

  const handleHideTable = () => setShowTable(false);

  const [previousClient, setPreviousClient] = useRecoilState<any>(prevSelectedClientState);

  const handleOpenModal = (newClient) => {
    //setPreviousClient(selectedClient ? selectedClient : previousClient );
    setPreviousClient(selectedClient);
    setSelectedClient(newClient);
    setOpenOfferModal(true);
  };

  const handleChooseCustomer = (customer) => {
    if (userQuote?.client?.id != null && customer?.id != null && userQuote?.client?.id !== customer?.id) {
      handleOpenModal(customer);
    }
    else {
      setSelectedClient(customer)
    }
    onClose();
    handleHideTable();
    setCustomer(null);

  }

  const getAllSimilarCustomer = async (customer) => {
    const handleResponse = (res) => {
      if (res?.success) {
        const mapData = res.data;
        setCustomerTableRows(mapData);
      } else {
        alertFaultGetData();
      }
    };

    await getAllSimilarCustomerApi(callApi, handleResponse, customer);
  };

  const mapCustomerData = (customer) => {
    const { code, name, mail, phone, isActive } = customer;
    const statusText = isActive ? t("usersSettings.active") : t("usersSettings.inactive");
    const statusColor = isActive ? "#40CC4E" : "#D92C2C";

    return [
      code,
      name,
      mail,
      phone,
      <div style={{ display: "inline-flex", ...FONT_FAMILY.Lexend(500, 14), color: statusColor }}>
        {statusText}
      </div>,
      <PrimaryButton onClick={() => handleChooseCustomer(customer)} variant="outlined" style={{ width: "fit-content", height: "fit-content" }}>
        {t("datepicker.choose")}
      </PrimaryButton>,
    ];
  };

  const getAllSimilarCustomersData = useCallback(() => {
    let customersArray = [...customerTableRows];
    if (customersArray?.length > 0) {
      return showInActiveCustomers ? customersArray : customersArray.filter((user: any) => user.isActive);
    }
    return customersArray
  }, [customerTableRows, showInActiveCustomers])

  const onShowInActiveCustomers = (value: boolean) => {
    setShowInActiveCustomers(value);
  }


  const [open, setOpen] = useState(false);
  const validateEmail = (state: any, fieldName: string) => !!state?.[fieldName] ? emailRegex.test(state?.[fieldName]) : true;
  const { addNewCustomer } = useAddCustomer();
  const { editCustomer } = useEditCustomer();
  const { updateUserPassword } = useUserProfile();

  // in order to avoid sending an empty object that include just name & index
  const isNameIndexOnly = (dataObject) => {
    const { name, index, ...otherProps } = dataObject;
    const emptyProps = Object.values(otherProps).every(
      (prop) => prop === null || prop === "" || prop === " "
    );
    return emptyProps;
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
    setCustomer(null);
    handleHideTable();
    setCustomerTableRows([]);
    setShowInActiveCustomers(false);
  };


  const clientTypeLabel = typeClient === "C"
    ? t("customers.modal.clientType")
    : t("suppliers.supplierType");

  const clientTypeId = typeClient === "C"
    ? CLIENT_TYPE_Id.CUSTOMER
    : CLIENT_TYPE_Id.SUPPLIER;

  const handleAddCustomer = async () => {
    const filteredContacts = contacts.filter(
      (contact) => !isNameIndexOnly(contact)
    );
    const filteredAddresses = addresses.filter(
      (address) => !isNameIndexOnly(address)
    );
    const filteredUsers = users.filter((user) => !isNameIndexOnly(user));
    const cardTypeId = typeClient === "C" ? CLIENT_TYPE_Id.CUSTOMER : CLIENT_TYPE_Id.SUPPLIER;
    const updatedCustomer = {
      ...customer,
      contacts: filteredContacts,
      addresses: filteredAddresses,
      users: filteredUsers,
      cardTypeId: cardTypeId,
      currency: customer?.currency ? customer?.currency : systemCurrency
    };

    // Check if email is valid
    const areEmailsValid = filteredUsers.every(user => validateEmail(user, "email"));
    if (!areEmailsValid) {
      alertFault("customers.invalidEmail");
      return;
    }

    const isEmailValid = validateEmail(customer, "mail");
    if (!isEmailValid) {
      alertFault("customers.invalidEmail");
      return;
    }
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
        isFromCartPage && onChangeSelectBusiness(x);
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

    // Check if email is valid
    const areEmailsValid = filteredUsers.every(user => validateEmail(user, "email"));
    if (!areEmailsValid) {
      alertFault("customers.invalidEmail");
      return;
    }

    const isClientEmailValid = validateEmail(customer, "mail");
    if (!isClientEmailValid) {
      alertFault("customers.invalidEmail");
      return;
    }

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
        if (isgetAllCustomers) {
          getAllCustomers();
        }
        handleClose();
      });
    } else {
      alertRequiredFields();
    }
  };

  const [contacts, setContacts] = useState(
    customer && customer.contacts ? customer.contacts : []
  );
  const [addresses, setAddresses] = useState(
    customer && customer.addresses ? customer.addresses : []
  );
  const [users, setUsers] = useState(
    customer && customer.users ? customer.users : []
  );


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
    //  temp.push({ name: "", index: index, city: " ", street: " " });
    temp.push({ name: "", index: index });
    setAddresses(temp);
  };

  const addInitAddress = () => {
    var temp = [];
    if (customer && customer.addresses) {
      temp = [...customer.addresses];
    } else {
      const index = temp.length + 1;
      // temp.push({ name: "", index: index, city: " ", street: " " });
      temp.push({ name: "", index: index });
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

  const [isClientType, setClientType] = useState(false);
  const onClickCloseClientType = () => {
    setClientType(false);
  };
  const onClickOpenClientType = () => {
    setClientType(true);
  };

  const validCustomerName = (customer) => {
    if (!customer || !customer.name) {
      return false;
    }
    return true;
  };

  const handleShowTable = async () => {
    const filteredContacts = contacts.filter(
      (contact) => !isNameIndexOnly(contact)
    );
    const filteredAddresses = addresses.filter(
      (address) => !isNameIndexOnly(address)
    );
    const filteredUsers = users.filter((user) => !isNameIndexOnly(user));
    const cardTypeId = typeClient === "C" ? CLIENT_TYPE_Id.CUSTOMER : CLIENT_TYPE_Id.SUPPLIER;
    const updatedCustomer = {
      ...customer,
      contacts: filteredContacts,
      addresses: filteredAddresses,
      users: filteredUsers,
      cardTypeId: cardTypeId,
    };

    // Check if email is valid
    const areEmailsValid = filteredUsers.every(user => validateEmail(user, "email"));
    if (!areEmailsValid) {
      alertFault("customers.invalidEmail");
      return;
    }

    const isValidCustomerName = validCustomerName(customer);
    if (!isValidCustomerName) {
      alertFault("modal.clientNameIsRequired");
      return;
    }

    setCustomer(updatedCustomer);
    getAllSimilarCustomer(updatedCustomer).then((x) => {
      setShowTable(true);
    });

  };

  return {
    customerTableHeaders,
    customerTableRows,
    showTable,
    handleHideTable,
    setCustomerTableRows,
    getAllSimilarCustomersData,
    onShowInActiveCustomers,
    mapCustomerData,
    setShowInActiveCustomers,
    getAllSimilarCustomer,
    setShowTable,
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
    isNameIndexOnly,
    validateEmail,
    alertFault,
    clientTypeId,
    clientTypeLabel,
    setResetPassModalModal,
    resetPassModal,
    clientTypesCategories,
    handleClose,
    languagesOptions,
    gomakeUser,
    isClientType,
    onClickCloseClientType,
    onClickOpenClientType,
    handleShowTable,
    updateUserPassword,
    onUpdatePass,
    onChangeInputs
  };
};

export { useCustomerCard };