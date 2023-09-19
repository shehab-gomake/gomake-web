import { Tab, Tabs, ThemeProvider, createMuiTheme } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useStyle } from "./style";
import { GoMakeModal } from "@/components";
import { TextareaAutosize } from '@mui/base';
import { ContactForm } from "./components/contacts-tab";
import { AddressForm } from "./components/address-tab";
import { UserForm } from "./components/gomakeUser-tab/form";
import { AddIcon } from "@/components/icons/icons";
import { useTranslation } from "react-i18next";
import { Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FONT_FAMILY } from "@/utils/font-family";
import { useAddCustomer } from "@/pages/customers/add-customer/use-add-customer";
import { useEditCustomer } from "@/pages/customers/edit-customer/use-edit-customer";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { customerInputs, customerInputs2 } from "./inputs/customer-inputs";
import { generalInputs, generalInputs2, lastOrderInputs } from "./inputs/general-inputs";

const CustomerCardWidget = ({ typeClient, getAllCustomers, onCustomeradd, openModal, modalTitle, onClose, customer, setCustomer, showUpdateButton, showAddButton }: any) => {
  const [open, setOpen] = useState(false);
  const { addNewCustomer } = useAddCustomer();
  const { editCustomer } = useEditCustomer();
  const { t } = useTranslation();
  const theme = createMuiTheme({
    palette: {
      secondary: {
        main: '#FFF',
      },
    },
  });

  const tabPanelTextArea = (placeHolder = null, value = null, onchange = null) => {
    return (
      <Col  >
        <TextareaAutosize style={clasess.textAreaStyle} placeholder={placeHolder} value={value} onChange={onchange}></TextareaAutosize>
      </Col>
    );
  };

  const { clasess } = useStyle();
  const [selectedTab, setSelectedTab] = useState(0);
  const [contacts, setContacts] = useState(customer && customer.contacts ? customer.contacts : []);
  const [addresses, setAddresses] = useState(customer && customer.addresses ? customer.addresses : []);
  const [users, setUsers] = useState(customer && customer.users ? customer.users : []);

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
  }

  const addInitContact = () => {
    var temp = [];
    if (customer && customer.contacts) {
      temp = customer.contacts;
      if (temp) {
        let index = 0;
        temp.forEach(x => {
          x.index = index;
          index++;
        })
      }
    } else {
      const index = temp.length + 1;
      temp.push({ name: "", index: index });
    }
    setContacts(temp);
  }

  const deleteContactForm = (index) => {
    debugger;
    var temp = [...contacts];
    temp = temp.filter(x => x.index != index);
    setContacts(temp);
  }

  const updateContact = (index, updatedContactData) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.index === index ? { ...contact, ...updatedContactData } : contact
      )
    );
  };

  // Address info
  const addEmptyAdress = () => {
    var temp = [...addresses];
    const index = temp.length + 1;
    temp.push({ name: "", index: index });
    setAddresses(temp);
  }

  const addInitAddress = () => {
    var temp = [];
    if (customer && customer.addresses) {
      temp = customer.addresses;
      if (temp) {
        let index = 0;
        temp.forEach(x => {
          x.index = index;
          index++;
        })
      }
    } else {
      const index = temp.length + 1;
      temp.push({ name: "", index: index });
    }
    setAddresses(temp);
  }

  const deleteAddressForm = (index) => {
    debugger;
    var temp = [...addresses];
    temp = temp.filter(x => x.index != index);
    setAddresses(temp);
  }

  const updateAddress = (index, updatedAddressData) => {
    setAddresses((prevAddresses) =>
      prevAddresses.map((address) =>
        address.index === index ? { ...address, ...updatedAddressData } : address
      )
    );
  };

  // User info
  const addEmptyClient = () => {
    var temp = [...users];
    const index = temp.length + 1;
    temp.push({ name: "", index: index });
    setUsers(temp);
  }

  const addInitUser = () => {
    var temp = [];
    if (customer && customer.users) {
      temp = customer.users;
      if (temp) {
        let index = 0;
        temp.forEach(x => {
          x.index = index;
          index++;
        })
      }
    } else {
      const index = temp.length + 1;
      temp.push({ name: "", index: index });
    }
    setUsers(temp);
  }

  const deleteClientForm = (index) => {
    debugger;
    var temp = [...users];
    temp = temp.filter(x => x.index != index);
    setUsers(temp);
  }

  const updateUser = (index, updatedUserData) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.index === index ? { ...user, ...updatedUserData } : user
      )
    );
  };

  // add customer button
  const handleAddCustomer = async () => {
    const filteredContacts = contacts.filter(contact => !isNameIndexOnly(contact));
    const filteredAddresses = addresses.filter(address => !isNameIndexOnly(address));
    const filteredUserss = users.filter(user => !isNameIndexOnly(user));
    const cardTypeId = typeClient === "S" ? 2 : 1;

    const updatedCustomer = {
      ...customer,
      contacts: filteredContacts,
      addresses: filteredAddresses,
      users: filteredUserss,
      CardTypeId: cardTypeId,
    };
    setCustomer(updatedCustomer);
    addNewCustomer(updatedCustomer).then(x => {
      onCustomeradd(x);
      handleClose();
    });
  };

  // edit customer button
  const handleEditCustomer = () => {
    const filteredContacts = contacts.filter(contact => !isNameIndexOnly(contact));
    const filteredAddresses = addresses.filter(address => !isNameIndexOnly(address));
    const filteredUserss = users.filter(user => !isNameIndexOnly(user));
    const updatedCustomer = {
      ...customer,
      contacts: filteredContacts,
      addresses: filteredAddresses,
      users: filteredUserss,
    };
    setCustomer(updatedCustomer);
    console.log(updatedCustomer)
    editCustomer(updatedCustomer, setCustomer).then(x => {
      getAllCustomers();
      handleClose();
    });
  };

  const onChangeInputs = (key, value) => {
    setCustomer({ ...customer, [key]: value })
  }

  // in order to avoid sending an empty object that include just name & index
  const isNameIndexOnly = (dataObject) => {
    const { name, index, ...otherProps } = dataObject;
    const emptyProps = Object.values(otherProps).every(prop => prop === null || prop === "");
    return emptyProps;
  };


  // const customerInfo = useCallback(() => {
  //   return customerInputs(customer)
  //     }, [selectedTab]);

  return (
    <GoMakeModal
      openModal={open}
      modalTitle={t(modalTitle)}
      onClose={handleClose}
      insideStyle={clasess.insideStyle}
    >
      <div style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#FFF" }}>
        <Row>
          <Col>
            <span style={clasess.subTitleStyle} >{typeClient == "C" ? t("customers.modal.customerInfo") : t("suppliers.supplierInfo")}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: '16px', width: "90%", marginBottom: '24px' }}>
          {
            customerInputs(typeClient, customer).map(item => <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
              <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={!!item.readonly} /></Col>)
          }
        </Row>
        <Row style={{ marginTop: '16px', width: "90%", marginBottom: '24px' }}>
          {
            customerInputs2(customer).map(item => <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
              <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Col>)
          }
        </Row>
        <ThemeProvider theme={theme}>
          <Tabs sx={{ minHeight: 'unset', minWidth: 'unset' }} value={selectedTab} onChange={handleTabChange} textColor="secondary" TabIndicatorProps={{ style: { display: 'none' } }} >
            <Tab sx={{ backgroundColor: selectedTab === 0 ? '#ED028C' : '#EBECFF', color: selectedTab === 0 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "82px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "10px", marginRight: "10px", textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("customers.modal.general")} />
            <Tab sx={{ backgroundColor: selectedTab === 1 ? '#ED028C' : '#EBECFF', color: selectedTab === 1 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "90px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "10px", marginRight: "10px", textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("customers.modal.contacts")} />
            <Tab sx={{ backgroundColor: selectedTab === 2 ? '#ED028C' : '#EBECFF', color: selectedTab === 2 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "100px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "10px", marginRight: "10px", textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("customers.modal.addresses")} />
            {typeClient == "C" && <Tab sx={{ backgroundColor: selectedTab === 3 ? '#ED028C' : '#EBECFF', color: selectedTab === 4 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "137px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "7px", marginRight: "10px", textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("customers.modal.gomakeUsers")} />}
          </Tabs>
        </ThemeProvider>
      </div>
      {
        selectedTab == 0 &&
        <Row style={{ marginTop: '16px', width: "90%", marginBottom: '24px' }}>
          {
            generalInputs(customer).map(item => <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
              <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Col>)
          }
        </Row>
      }
      {
        selectedTab == 0 &&
        <Row style={{ marginTop: '16px', width: "90%", marginBottom: '24px' }}>
          {
            generalInputs2(typeClient,customer).map(item => <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
              <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Col>)
          }
        </Row>
      }
      {
        selectedTab == 0 &&
        <div>
          <Row style={{ marginBottom: '24px' }}>
            <span style={{ color: "var(--second-500, #ED028C)", fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 14), lineHeight: "normal" }}>{t("customers.modal.lastOrderDetails")}</span>
          </Row>
          <Row style={{ marginBottom: '24px', width: "72%" }}>
            {
              lastOrderInputs(customer).map(item => <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
                <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Col>)
            }
          </Row>
          <Row style={{ marginBottom: '24px', marginTop: '24px', width: "90%", display: "flex", justifyContent: "center", alignItems: "center" }} >
            {tabPanelTextArea(t("customers.modal.generalComment"), customer?.generalNotes, (e) => setCustomer({ ...customer, generalNotes: e.target.value }))}
            {tabPanelTextArea(t("customers.modal.orderOpeningNotes"), customer?.newItemNotes, (e) => setCustomer({ ...customer, newItemNotes: e.target.value }))}
            {tabPanelTextArea(t("customers.modal.orderClosingNotes"), customer?.closeOrderNotes, (e) => setCustomer({ ...customer, closeOrderNotes: e.target.value }))}
          </Row>
        </div>
      }
      <div>
        {
          //contacts info
          selectedTab == 1 &&
          <Row>
            <Col md={10} >
              {
                //to check before
                contacts.filter(contact => !contact.isMainContact).map(x =>
                  <ContactForm key={x.index} contact={x} onDelete={deleteContactForm} setContact={(updatedContactData) => updateContact(x.index, updatedContactData)} ></ContactForm>
                )
              }
            </Col>
            <Col style={{ marginTop: "52px", justifyContent: 'flex-end' }}>
              <a style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "7px" }} onClick={addEmptyContact} >
                <AddIcon></AddIcon>
                <button style={clasess.buttonsStyle} >{t("customers.buttons.addContact")}</button>
              </a>
            </Col>
          </Row>
        }
        {
          //address info
          selectedTab == 2 &&
          <Row>
            <Col md={10} >
              {
                addresses.map(x =>
                  <AddressForm key={x.index} address={x} onDelete={deleteAddressForm} setAddress={(updatedAddressData) => updateAddress(x.index, updatedAddressData)}></AddressForm>
                )
              }
            </Col>
            <Col style={{ marginTop: "52px", justifyContent: 'flex-end' }}>
              <a style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "7px" }} onClick={addEmptyAdress} >
                <AddIcon></AddIcon>
                <button style={clasess.buttonsStyle} >{t("customers.buttons.newAddress")}</button>
              </a>
            </Col>
          </Row>
        }
        {
          //GOMAKEUSER info
          selectedTab == 3 &&
          <Row style={{ display: "flex" }}>
            <Col md={10}>
              {
                users?.map(x =>
                  <UserForm key={x.index} user={x} onDelete={deleteClientForm} setUser={(updatedUserData) => updateUser(x.index, updatedUserData)}></UserForm>
                )
              }
            </Col>
            <Col style={{ marginTop: "63px", justifyContent: 'flex-end' }} >
              <a style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "7px" }} onClick={addEmptyClient} >
                <AddIcon></AddIcon>
                <button style={clasess.buttonsStyle} >{t("customers.buttons.addUser")}</button>
              </a>
            </Col>
          </Row>
        }
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={clasess.footerStyle} >
            {showAddButton && <button style={clasess.autoButtonStyle} onClick={handleAddCustomer} >{typeClient == "C" ? t("customers.buttons.addCustomer") : t("suppliers.buttons.addSupplier")}</button>}
            {showUpdateButton && <button style={clasess.autoButtonStyle} onClick={handleEditCustomer}>{typeClient == "C" ? t("customers.buttons.updateChanges") : t("suppliers.buttons.updateChanges")}</button>}
          </div>
        </div>
      </div>
    </GoMakeModal>
  );
};
export { CustomerCardWidget };