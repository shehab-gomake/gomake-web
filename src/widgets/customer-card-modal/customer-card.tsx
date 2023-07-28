import { Tab, Tabs, ThemeProvider, createMuiTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useStyle } from "./style";
import { GoMakeModal } from "@/components";
import { HeaderFilter } from "./header-filter";
import { TextareaAutosize } from '@mui/base';
import { ContactForm } from "./components/contacts-tab";
import { AddressForm } from "./components/address-tab";
import { PriceListForm } from "./components/priceList-tab/form";
import { UserForm } from "./components/gomakeUser-tab/form";
import { AddIcon } from "@/components/icons/icons";
import { useTranslation } from "react-i18next";
import { Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BookKeepingForm } from "./components/bookKeeping-tab/form";
import Switch from "./components/switch-component";
import { BudgetForm } from "./components/budget-tab/add-budget/form";

import { useSupplier } from "@/hooks/use-supplier";

const CustomerCardWidget = ({ openModal, modalTitle, onClose, customer, setCustomer, showUpdateButton, showAddButton }: any) => {

  const { t } = useTranslation();
  const theme = createMuiTheme({
    palette: {
      secondary: {
        main: '#FFF',
      },
    },
  });

  const { suppliersCurrencies , getSupplierCurrencies} = useSupplier();


  const TestOptions = useMemo(
    () => [t("USD (US Dollar): $"),
    t("aaa"),
    t("bbb"),],
    []
  );

  const tabPanelInput = (label, val = null, onchange = null) => {
    return (
      <Col style={{ width: "180px", height: "68px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
        <h3 style={clasess.headerStyle}>{label}</h3>
        <input style={clasess.inputStyle1} type="text" placeholder="placeholder" value={val} onChange={onchange} /></Col>
    );
  };

  const tabPanelSwich = (label, value = null, onchange = null) => {
    return (
      <Col style={{ display: "flex", width: "170px", height: "14px", justifyContent: "flex-start", gap: "8px" }}>
        <Switch  checked={value} onChange={onchange} />
        <h3 style={clasess.switchHeaderStyle} >{label}</h3>
      </Col>
    );
  };

  const tabPanelSelect = (label, options = null, placeHold = "placeholder" ,  val = null , onChange= null , flag="flex") => {
    return (
      <Col style={{ width: "181px", height: "68px", display: flag, flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
        <h3 style={clasess.headerStyle}>{label}</h3>
        <HeaderFilter style={clasess.autoComplateStyle} setPlaceholder={placeHold} setAllOptions={options} value={val} onChange={onChange}></HeaderFilter>
      </Col>
    );
  };

  const tabPanelTextArea = (placeHolder = null, value = null, onchange = null) => {
    return (
      <Col  >
        <TextareaAutosize style={clasess.textAreaStyle} placeholder={placeHolder} value={value} onChange={onchange}></TextareaAutosize>
      </Col>
    );
  };

  const { clasess } = useStyle();
  const [selectedTab, setSelectedTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState( customer && customer.contacts ? customer.contacts : [] );
  const [addresses, setAddresses] = useState(customer && customer.addresses ? customer.addresses : []);

  useEffect(() => {
    addInitContact();
    addInitAddress();
  }, [openModal]);

  useEffect(() => {
    setOpen(openModal);
    setSelectedTab(0);
  }, [openModal])

  const handleClose = () => {
    setOpen(false);
    onClose();
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
    if(customer && customer.contacts){
      temp = customer.contacts;
      if(temp){
        let index = 0;
        temp.forEach(x=>{
          x.index = index;
          index++;
        })
      }
    }else{
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
    if(customer && customer.addresses){
      temp = customer.addresses;
      if(temp){
        let index = 0;
        temp.forEach(x=>{
          x.index = index;
          index++;
        })
      }
    }else{
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
    var temp = [...customer?.users];
    const index = temp.length + 1;
    temp.push({ name: "", index: index });
    const updatedCustomer = { ...customer, users: temp };
    setCustomer(updatedCustomer);
  }
  
  const deleteClientForm = (index) => {
    debugger;
    var temp = [...customer?.users];
    temp = temp.filter(x => x.index != index);
    const updatedCustomer = { ...customer, users: temp };
    setCustomer(updatedCustomer);
  }
  
  return (
    <GoMakeModal
      openModal={open}
      modalTitle={t(modalTitle)}
      onClose={handleClose}
      insideStyle={clasess.insideStyle}
    >
      <div>
        <Row>
          <Col><h3 style={clasess.subTitleStyle} >{t("customers.modal.customerInfo")}</h3>
          </Col>
        </Row>
        <Row style={{ marginBottom: '16px', marginTop: '16px', width: "90%" }}>
          <Col style={{ width: "180px", height: "68px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
            <h3 style={clasess.headerStyle}>{t("customers.modal.code")}</h3>
            <input style={clasess.inputStyle1} readOnly={true} type="text" placeholder="placeholder" value={customer?.code} />
          </Col>
          <Col style={{ width: "180px", height: "68px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
            <h3 style={clasess.headerStyle}>{t("customers.modal.CPAcode")}</h3>
            <input style={clasess.inputStyle1} type="text" placeholder="placeholder" value={customer?.cpaClientCode} onChange={(e: any) => setCustomer({ ...customer, cpaClientCode: e.target.value })}/>
          </Col>
          <Col style={{ width: "180px", height: "68px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
            <h3 style={clasess.headerStyle}>{t("customers.modal.clientName")}</h3>
            <input style={clasess.inputStyle1} type="text" placeholder="placeholder" value={customer?.name} onChange={(e: any) => setCustomer({ ...customer, name: e.target.value })} />
          </Col>
          <Col style={{ width: "180px", height: "68px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
            <h3 style={clasess.headerStyle}>{t("customers.modal.vatNO")}</h3>
            <input style={clasess.inputStyle1} type="text" placeholder="placeholder" value={customer?.buisnessNumber} onChange={(e) => setCustomer({ ...customer, buisnessNumber: e.target.value })} />
          </Col>
          <Col style={{ display: 'none' , width: "180px", height: "68px",  flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
            <h3 style={clasess.headerStyle}>{t("customers.modal.amountBalance")}</h3>
            <input style={clasess.inputStyle1} readOnly={true} type="text" placeholder="placeholder" />
          </Col>
          <Col style={{ width: "180px", height: "68px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
            <h3 style={clasess.headerStyle} >{t("customers.modal.currency")}</h3>
            <HeaderFilter style={clasess.autoComplateStyle} setPlaceholder="placeholder" setAllOptions={suppliersCurrencies} value={customer?.currency} ></HeaderFilter>
          </Col>
        </Row>
        <Row style={{ marginBottom: '16px', marginTop: '16px', width: "54%" }}>
          <Col style={{ display: 'none' , width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
            <h3 style={clasess.headerStyle}>{t("customers.modal.shippingCertificate")}</h3>
            <input style={clasess.inputStyle1} readOnly={true} type="text" placeholder="placeholder" />
          </Col>
          <Col style={{ display: 'none' , width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
            <h3 style={clasess.headerStyle}>{t("customers.modal.openInvitations")}</h3>
            <input style={clasess.inputStyle1} readOnly={true} type="text" placeholder="placeholder" />
          </Col>
        </Row>
      </div>
      <Row style={{ display: "flex", marginTop: "24px", marginBottom: '24px' }}>
        <Col><h3 style={clasess.subTitleStyle} >{t("customers.modal.categories")}</h3>
        </Col>
      </Row>
      <div >
        <ThemeProvider theme={theme}>
          <Tabs sx={{ minHeight: 'unset', minWidth: 'unset' }} value={selectedTab} onChange={handleTabChange} textColor="secondary" TabIndicatorProps={{ style: { display: 'none' }, }} >
            <Tab sx={{ backgroundColor: selectedTab === 0 ? '#ED028C' : '#EBECFF', color: selectedTab === 0 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "82px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "10px", marginRight: "10px", textTransform: 'none', fontFamily: "Lexend", fontSize: "16px", fontStyle: "normal", fontWeight: 500, lineHeight: "normal", }} label={t("customers.modal.general")} />
            <Tab sx={{ backgroundColor: selectedTab === 1 ? '#ED028C' : '#EBECFF', color: selectedTab === 1 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "90px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "10px", marginRight: "10px", textTransform: 'none', fontFamily: "Lexend", fontSize: "16px", fontStyle: "normal", fontWeight: 500, lineHeight: "normal", }} label={t("customers.modal.contacts")} />
            <Tab sx={{ backgroundColor: selectedTab === 2 ? '#ED028C' : '#EBECFF', color: selectedTab === 2 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "100px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "10px", marginRight: "10px", textTransform: 'none', fontFamily: "Lexend", fontSize: "16px", fontStyle: "normal", fontWeight: 500, lineHeight: "normal", }} label={t("customers.modal.addresses")} />
            <Tab sx={{ backgroundColor: selectedTab === 3 ? '#ED028C' : '#EBECFF', color: selectedTab === 3 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "206px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "4px", marginRight: "10px", textTransform: 'none', fontFamily: "Lexend", fontSize: "16px", fontStyle: "normal", fontWeight: 500, lineHeight: "normal", }} label={t("customers.modal.priceLists")} />
            <Tab sx={{ backgroundColor: selectedTab === 4 ? '#ED028C' : '#EBECFF', color: selectedTab === 4 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "137px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "7px", marginRight: "10px", textTransform: 'none', fontFamily: "Lexend", fontSize: "16px", fontStyle: "normal", fontWeight: 500, lineHeight: "normal", }} label={t("customers.modal.gomakeUsers")} />
          </Tabs>
          {
            //general info
            selectedTab == 0 &&
            <div>
              <Row style={{ marginBottom: '24px', marginTop: '24px', width: "90%" }}>
                {tabPanelInput(t("customers.modal.phone1"), customer?.tel1 , (e) => setCustomer({ ...customer, tel1: e.target.value }))}
                {tabPanelInput(t("customers.modal.phone2"), customer?.tel2 , (e) => setCustomer({ ...customer, tel2: e.target.value }))}
                {tabPanelInput(t("customers.modal.site"), customer?.site ,(e) => setCustomer({ ...customer, site: e.target.value }))}
                {tabPanelInput(t("customers.modal.mainContactName"),customer?.mainContactName,(e) => setCustomer({ ...customer, mainContactName: e.target.value }))}
                {tabPanelInput(t("customers.modal.mobile"), customer?.phone, (e) => setCustomer({ ...customer, phone: e.target.value }))}
              </Row>
              <Row style={{ marginBottom: '24px', width: "90%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                {tabPanelInput(t("customers.modal.email"), customer?.mail, (e) => setCustomer({ ...customer, mail: e.target.value }))}
                {tabPanelInput(t("customers.modal.fax"), customer?.fax, (e) => setCustomer({ ...customer, fax: e.target.value }))}
                {tabPanelSelect(t("customers.modal.agent"), TestOptions, "select agent" , customer?.agent)}
                {tabPanelSwich(t("customers.modal.active"), customer?.isActive, (e) => setCustomer({ ...customer, isActive: e.target.checked }))}
                {tabPanelSwich(t("customers.modal.anOccasionalCustomer"), customer?.isOccasional, (e) => setCustomer({ ...customer, isOccasional: e.target.checked }))}
              </Row>
              <Row style={{ marginBottom: '24px', width: "72%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                {tabPanelSelect(t("customers.modal.typeOfDelivery"), TestOptions, "placeholder" , customer?.shipmentType ,(e) => setCustomer({ ...customer, shipmentType: e.target.value }) )}
                {tabPanelSelect(t("customers.modal.responsibleGraphicArtist"), TestOptions, "placeholder")}
                {tabPanelSelect(t("customers.modal.closingOrder"), TestOptions, "placeholder" )}
                {tabPanelSelect(t("customers.modal.howToCloseInvoicing"), TestOptions, "placeholder")}
                {tabPanelSelect(t("customers.modal.messageGroup"), TestOptions, "placeholder", customer?.messageGroup,(e) => setCustomer({ ...customer, messageGroup: e.target.value }),"none")}
              </Row>
              <Row style={{ marginBottom: '24px' }}>
                <Col><h3 style={{ color: "var(--second-500, #ED028C)", fontFamily: "Lexend", fontSize: "14px", fontStyle: "normal", fontWeight: 500, lineHeight: "normal" }}>{t("customers.modal.lastOrderDetails")}</h3></Col>
              </Row>
              <Row style={{ marginBottom: '24px', width: "90%" }}>
                {tabPanelInput(t("customers.modal.name"), customer?.lastOrderContactName , (e) => setCustomer({ ...customer, lastOrderContactName: e.target.value }))}
                {tabPanelInput(t("customers.modal.phone") , customer?.lastOrderContactPhone , (e) => setCustomer({ ...customer, lastOrderContactPhone: e.target.value }))}
                {tabPanelInput(t("customers.modal.email"), customer?.lastOrderContactMail , (e) => setCustomer({ ...customer, lastOrderContactMail: e.target.value }))}
                {tabPanelInput(t("customers.modal.address") , customer?.lastOrderContactAddress , (e) => setCustomer({ ...customer, lastOrderContactAddress: e.target.value }))}
                {tabPanelInput(t("customers.modal.mobile"))}
              </Row>
              <Row style={{ marginBottom: '24px', marginTop: '24px', width: "90%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                {tabPanelTextArea(t("customers.modal.generalComment") , customer?.generalNotes , (e) => setCustomer({ ...customer, generalNotes: e.target.value }))}
                {tabPanelTextArea(t("customers.modal.orderOpeningNotes"))}
                {tabPanelTextArea(t("customers.modal.orderClosingNotes") , customer?.closeOrderNotes , (e) => setCustomer({ ...customer, closeOrderNotes: e.target.value }))}
              </Row>
            </div>
          }
          {
            //contacts info
            selectedTab == 1 &&
            <Row>
              <Col md={10} >
                {
                   contacts.map(x =>
                    <ContactForm key={x.index} contact={x} onDelete={deleteContactForm} setContact={(updatedContactData) => updateContact(x.index, updatedContactData)} ></ContactForm>
                  )
                }
              </Col>
              <Col style={{ marginTop: "42px", marginRight: "30px", justifyContent: 'flex-end' }}>
                <a onClick={addEmptyContact} >
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
              <Col style={{ marginTop: "42px", marginRight: "30px", justifyContent: 'flex-end' }}>
                <a onClick={addEmptyAdress} >
                  <AddIcon></AddIcon>
                  <button style={clasess.buttonsStyle} >{t("customers.buttons.newAddress")}</button>
                </a>
              </Col>
            </Row>
          }
          {
            //bookKeeping info
            selectedTab == 5 &&
            <BookKeepingForm></BookKeepingForm>
          }
          {
            //budget info
            selectedTab == 5 &&
              <BudgetForm></BudgetForm>
          }
          {
            //price list info
            selectedTab == 3 &&
            <PriceListForm></PriceListForm>
          }
           {
            //GOMAKEUSER info
            selectedTab == 4 &&
            <Row  style={{display: "flex"  }}>
              <Col  md={10}>
                {
                  customer?.users.length === 0 ? (
                    <UserForm key={0} user={{ name: "", index: 1 }} onDelete={deleteClientForm} />
                  ) : (
                    customer?.users.map(x =>
                    <UserForm key={x.index} user={x} onDelete={deleteClientForm}></UserForm>
                  ))
                }
              </Col>
              <Col  style={{marginTop:"42px" , justifyContent: 'flex-end'}} >
                <a onClick={addEmptyClient} >
                  <AddIcon></AddIcon>
                  <button style={clasess.buttonsStyle} >{t("customers.buttons.addContact")}</button>
                </a>
              </Col>
            </Row>
          }
         
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end", alignSelf: "stretch", marginTop: "24px" }} >
            {showAddButton && <button style={clasess.autoButtonStyle} >{t("customers.buttons.updateChanges")}</button>}
            {showUpdateButton && <button style={clasess.autoButtonStyle} >{t("customers.buttons.updateChanges")}</button>}
          </div>
        </ThemeProvider>
      </div>
    </GoMakeModal>
  );

};
export { CustomerCardWidget };