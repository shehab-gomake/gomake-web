import { Tab, Tabs, ThemeProvider, createMuiTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useStyle } from "./style";
import { GoMakeModal } from "@/components";
import { HeaderFilter } from "./header-filter";
import { TextareaAutosize } from '@mui/base';
import { ContactForm } from "./components/contacts-tab";
import { AddressForm } from "./components/address-tab";
import { UserForm } from "./components/gomakeUser-tab/form";
import { AddIcon } from "@/components/icons/icons";
import { useTranslation } from "react-i18next";
import { Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SecondSwitch } from "@/components/switch/second";
import { FONT_FAMILY } from "@/utils/font-family";
import { useCustomersModal } from "./use-customer-modal";
import { useAddCustomer } from "@/pages/customers/add-customer/use-add-customer";
import { useEditCustomer } from "@/pages/customers/edit-customer/use-edit-customer";
import { customerInputs } from "./inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";



const CustomerCardWidget = ({ getAllCustomers, onCustomeradd, openModal, modalTitle, onClose, customer, setCustomer, showUpdateButton, showAddButton }: any) => {
  const [open, setOpen] = useState(false);
  const { addNewCustomer } = useAddCustomer();
  const { editCustomer } = useEditCustomer();
  const { clientTypesCategores , agentsCategores } = useCustomersModal();
  const { t } = useTranslation();
  const theme = createMuiTheme({
    palette: {
      secondary: {
        main: '#FFF',
      },
    },
  });

  const tabPanelInput = (label, val = null, onchange = null, placeHolder = "placeholder") => {
    return (
      <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
        <h3 style={clasess.headerStyle}>{label}</h3>
        <input style={clasess.inputStyle1} type="text" placeholder={placeHolder} value={val} onChange={onchange} /></Col>
    );
  };

  const tabPanelTextArea = (placeHolder = null, value = null, onchange = null) => {
    return (
      <Col  >
        <TextareaAutosize style={clasess.textAreaStyle} placeholder={placeHolder} value={value} onChange={onchange}></TextareaAutosize>
      </Col>
    );
  };

  const [agentName, setAgentName] = useState([]);
  const onChangeAgent = useCallback(async (e: any, value: any) => {
    setAgentName(value?.label);
    setCustomer({ ...customer, agentId: value?.id })
  }, [customer]);

  // const [currencyText, setCurrencyText] = useState([]);
  // const onChangeCurrency = useCallback(async (e: any, value: any) => {
  //   setCurrencyText(value?.label);
  //   setCustomer({ ...customer, currency: value?.id })
  // }, [customer]);

  const [clientType, setClientType] = useState([]);
  const onChangeClientType = useCallback(async (e: any, value: any) => {
    setClientType(value?.label);
    setCustomer({ ...customer, clientTypeId: value?.id })
  }, [customer]);

  useEffect(() => {
    setAgentName(customer && customer.agentId ? agentsCategores.find((agent) => agent.id == customer?.agentId)?.label : []);
    //setCurrencyText(customer && customer.currency ? currencyCategores.find((currency) => currency.id == customer?.currency)?.label : []);
    setClientType(customer && customer.clientTypeId ? clientTypesCategores.find((clientType) => clientType.id == customer?.clientTypeId)?.label : []);
  }, [customer]);


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

  // add customer buttone
  const handleAddCustomer = async () => {
    const filteredContacts = contacts.filter(contact => !isNameIndexOnly(contact));
    const filteredAddresses = addresses.filter(address => !isNameIndexOnly(address));
    const filteredUserss = users.filter(user => !isNameIndexOnly(user));
    const updatedCustomer = {
      ...customer,
      contacts: filteredContacts,
      addresses: filteredAddresses,
      users: filteredUserss
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
      users: filteredUserss
    };
    setCustomer(updatedCustomer);
    console.log(updatedCustomer);
    editCustomer(updatedCustomer, setCustomer).then(x => {
      getAllCustomers();
      handleClose();
    });
  };

  const onChangeInputs= (key,value)=>{
    setCustomer({...customer, [key]:value})
  }

  // in order to avoid sending an empty object that include just name & index
  const isNameIndexOnly = (dataObject) => {
    const { name, index, ...otherProps } = dataObject;
    const emptyProps = Object.values(otherProps).every(prop => prop === null || prop === "");
    return emptyProps;
  };

  return (
    <GoMakeModal
      openModal={open}
      modalTitle={t(modalTitle)}
      onClose={handleClose}
      insideStyle={clasess.insideStyle}
    >
      <div style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#FFF" }}>
        <Row>
          <Col><span style={clasess.subTitleStyle} >{t("customers.modal.customerInfo")}</span>
          </Col>
        </Row>
        <Row style={{ marginTop: '16px', width: "90%" , marginBottom: '24px'}}>

        {
          customerInputs(customer).map(item=><Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
          <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={!!item.readonly} /></Col>)
        }
                </Row>

        {/*<Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
            <h3 style={clasess.headerStyle} >{t("customers.modal.clientType")}</h3>
            <HeaderFilter style={clasess.autoComplateStyle} setPlaceholder={t("customers.modal.clientType")} setAllOptions={clientTypesCategores} val={clientType} onchange={onChangeClientType}></HeaderFilter>
          </Col>*/}
        <ThemeProvider theme={theme}>
          <Tabs sx={{ minHeight: 'unset', minWidth: 'unset' }} value={selectedTab} onChange={handleTabChange} textColor="secondary" TabIndicatorProps={{ style: { display: 'none' } }} >
            <Tab sx={{ backgroundColor: selectedTab === 0 ? '#ED028C' : '#EBECFF', color: selectedTab === 0 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "82px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "10px", marginRight: "10px", textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("customers.modal.general")} />
            <Tab sx={{ backgroundColor: selectedTab === 1 ? '#ED028C' : '#EBECFF', color: selectedTab === 1 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "90px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "10px", marginRight: "10px", textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("customers.modal.contacts")} />
            <Tab sx={{ backgroundColor: selectedTab === 2 ? '#ED028C' : '#EBECFF', color: selectedTab === 2 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "100px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "10px", marginRight: "10px", textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("customers.modal.addresses")} />
            <Tab sx={{ backgroundColor: selectedTab === 3 ? '#ED028C' : '#EBECFF', color: selectedTab === 4 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "137px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "7px", marginRight: "10px", textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("customers.modal.gomakeUsers")} />
          </Tabs>
        </ThemeProvider>
      </div>
      <div>
        {
          //general info
          selectedTab == 0 &&
          <div>
            <Row style={{ marginBottom: '24px', marginTop: '24px', width: "90%" }}>
              {tabPanelInput(t("customers.modal.phone1"), customer?.tel1, (e) => setCustomer({ ...customer, tel1: e.target.value }), t("customers.modal.phone1"))}
              {tabPanelInput(t("customers.modal.phone2"), customer?.tel2, (e) => setCustomer({ ...customer, tel2: e.target.value }), t("customers.modal.phone2"))}
              {tabPanelInput(t("customers.modal.site"), customer?.internetSite, (e) => setCustomer({ ...customer, internetSite: e.target.value }), t("customers.modal.site"))}
              {tabPanelInput(t("customers.modal.mainContactName"), customer?.mainContactName, (e) => setCustomer({ ...customer, mainContactName: e.target.value }), t("customers.modal.mobile"))}
              {tabPanelInput(t("customers.modal.mobile"), customer?.phone, (e) => setCustomer({ ...customer, phone: e.target.value }), t("customers.modal.mobile"))}
            </Row>
            <Row style={{ marginBottom: '24px', width: "72.5%", display: "flex", justifyContent: "center", alignItems: "center" }} >
              {tabPanelInput(t("customers.modal.email"), customer?.mail, (e) => setCustomer({ ...customer, mail: e.target.value }), t("customers.modal.email"))}
              {tabPanelInput(t("customers.modal.fax"), customer?.fax, (e) => setCustomer({ ...customer, fax: e.target.value }), t("customers.modal.fax"))}
              <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
                <h3 style={clasess.headerStyle}>{t("customers.modal.agent")}</h3>
                <HeaderFilter style={clasess.autoComplateStyle} setPlaceholder={t("customers.modal.agent")} setAllOptions={agentsCategores} val={agentName} onchange={onChangeAgent}></HeaderFilter>
              </Col>
              <Col style={{ display: "flex", flexDirection: "column", marginTop: "45px" }}>
                <Col style={{ display: "flex", width: "170px", height: "14px", justifyContent: "flex-start", gap: "8px" }}>
                  <SecondSwitch checked={customer?.isActive} size="small" onChange={(e) => setCustomer({ ...customer, isActive: e.target.checked })} />
                  <h3 style={clasess.switchHeaderStyle} >{t("customers.modal.active")}</h3>
                </Col>
                <Col style={{ display: "flex", width: "190px", height: "14px", justifyContent: "flex-start", gap: "8px" }}>
                  <SecondSwitch checked={customer?.isOccasional} size="small" onChange={(e) => setCustomer({ ...customer, isOccasional: e.target.checked })} />
                  <h3 style={clasess.switchHeaderStyle} >{t("customers.modal.anOccasionalCustomer")}</h3>
                </Col>
              </Col>
            </Row>
            <Row style={{ marginBottom: '24px' }}>
              <span style={{ color: "var(--second-500, #ED028C)", fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 14), lineHeight: "normal" }}>{t("customers.modal.lastOrderDetails")}</span>
            </Row>
            <Row style={{ marginBottom: '24px', width: "90%" }}>
              {tabPanelInput(t("customers.modal.name"), customer?.lastOrderContactName, (e) => setCustomer({ ...customer, lastOrderContactName: e.target.value }), t("customers.modal.name"))}
              {tabPanelInput(t("customers.modal.phone"), customer?.lastOrderContactPhone, (e) => setCustomer({ ...customer, lastOrderContactPhone: e.target.value }), t("customers.modal.phone"))}
              {tabPanelInput(t("customers.modal.email"), customer?.lastOrderContactMail, (e) => setCustomer({ ...customer, lastOrderContactMail: e.target.value }), t("customers.modal.email"))}
              {tabPanelInput(t("customers.modal.address"), customer?.lastOrderContactAddress, (e) => setCustomer({ ...customer, lastOrderContactAddress: e.target.value }), t("customers.modal.address"))}
              {tabPanelInput(t("customers.modal.mobile"), customer?.lastOrderContactPhone, (e) => setCustomer({ ...customer, lastOrderContactPhone: e.target.value }), t("customers.modal.mobile"))}
            </Row>
            <Row style={{ marginBottom: '24px', marginTop: '24px', width: "90%", display: "flex", justifyContent: "center", alignItems: "center" }} >
              {tabPanelTextArea(t("customers.modal.generalComment"), customer?.generalNotes, (e) => setCustomer({ ...customer, generalNotes: e.target.value }))}
              {tabPanelTextArea(t("customers.modal.orderOpeningNotes"), customer?.newItemNotes, (e) => setCustomer({ ...customer, newItemNotes: e.target.value }))}
              {tabPanelTextArea(t("customers.modal.orderClosingNotes"), customer?.closeOrderNotes, (e) => setCustomer({ ...customer, closeOrderNotes: e.target.value }))}
            </Row>
          </div>
        }
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
        <div style={{display: "flex" , justifyContent: "flex-end" }}>
        <div style={clasess.footerStyle} >
          {showAddButton && <button style={clasess.autoButtonStyle} onClick={handleAddCustomer} >{t("customers.buttons.addCustomer")}</button>}
          {showUpdateButton && <button style={clasess.autoButtonStyle} onClick={handleEditCustomer}>{t("customers.buttons.updateChanges")}</button>}
        </div>
        </div>
      </div>
    </GoMakeModal>
  );
};
export { CustomerCardWidget };