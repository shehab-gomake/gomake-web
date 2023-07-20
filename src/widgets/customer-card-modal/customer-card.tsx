import { Button, Tab, Tabs, ThemeProvider, createMuiTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useStyle } from "./style";
import { GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { HeaderFilter } from "./header-filter";
import { TextareaAutosize } from '@mui/base';
import { ContactForm } from "./components/contacts-tab";
import { AddressForm } from "./components/address-tab";
import { Table } from "@/widgets/table/table";
import { PriceListForm } from "./components/priceList-tab/form";
import { UserForm } from "./components/gomakeUser-tab/form";
import { AddIcon } from "@/components/icons/icons";
import { useTranslation } from "react-i18next";
import { Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { BookKeepingForm } from "./components/bookKeeping-tab/form";
import Switch from "./components/switch-component";
import { BudgetForm } from "./components/budget-tab/add-budget/form";

const CustomerCardWidget = ({ openModal, modalTitle, onClose, customer, setCustomer, showUpdateButton, showAddButton }: any) => {

  const theme = createMuiTheme({
    palette: {
      secondary: {
        main: '#FFF',
      },
    },
  });

  const { t } = useTranslation();


  const TestOptions = useMemo(
    () => [t("USD (US Dollar): $"),
    t("aaa"),
    t("bbb"),],
    []
  );

  const tabelHeaders = useMemo(
    () => [
      t("customers.modal.budget"),
      t("customers.modal.sum"),
      t("customers.modal.balance"),
      t("customers.modal.invoiceNumber"),
      t("customers.modal.period"),
      t("customers.modal.paymentStatus"),
      t("customers.modal.status"),
      t("customers.modal.more"),
    ],
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

  const tabPanelSelect = (label, options = null, placeHold = null) => {
    return (
      <Col style={{ width: "181px", height: "68px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
        <h3 style={clasess.headerStyle}>{label}</h3>
        <HeaderFilter style={clasess.autoComplateStyle} setPlaceholder={placeHold} setAllOptions={options} ></HeaderFilter>
      </Col>
    );
  };

  const tabPanelTextArea = (placeHolder = null, value = null, onchange = null) => {
    return (
      <Col  >
        <TextareaAutosize style={clasess.textAreaStyle} placeholder={placeHolder}></TextareaAutosize>
      </Col>
    );
  };

  const { clasess } = useStyle();
  const [selectedTab, setSelectedTab] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [useres, setUsers] = useState([]);
  const [IPaddresses, setIPaddresses] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(openModal)
  }, [openModal])


  useEffect(() => {
    setSelectedTab(0)
  }, [openModal])


  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const addEmptyContact = () => {
    var temp = [...contacts];
    const index = temp.length + 1;
    temp.push({ name: "", index: index });
    setContacts(temp);
  }

  const deleteContactForm = (index) => {
    debugger;
    var temp = [...contacts];
    temp = temp.filter(x => x.index != index);
    setContacts(temp);
  }

  const addEmptyAdress = () => {
    var temp = [...addresses];
    const index = temp.length + 1;
    temp.push({ name: "", index: index });
    setAddresses(temp);
  }

  const deleteAddressForm = (index) => {
    debugger;
    var temp = [...addresses];
    temp = temp.filter(x => x.index != index);
    setAddresses(temp);
  }

  const addEmptyClient = () => {
    var temp = [...useres];
    const index = temp.length + 1;
    temp.push({ name: "", index: index });
    setUsers(temp);
  }

  const deleteClientForm = (index) => {
    debugger;
    var temp = [...useres];
    temp = temp.filter(x => x.index != index);
    setUsers(temp);
  }

  const addEmptyIPAddress = () => {
    var temp = [...IPaddresses];
    const index = temp.length + 1;
    temp.push({ name: "", index: index });
    setIPaddresses(temp);
  }

  
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <GoMakeModal
      openModal={open}
      modalTitle={t(modalTitle)}
      onClose={handleClose}
      insideStyle={clasess.insideStyle}
    >
      <div  >
        <Row >
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
            <input style={clasess.inputStyle1} type="text" placeholder="placeholder" />
          </Col>
          <Col style={{ width: "180px", height: "68px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
            <h3 style={clasess.headerStyle}>{t("customers.modal.clientName")}</h3>
            <input style={clasess.inputStyle1} type="text" placeholder="placeholder" value={customer?.name} onChange={(e: any) => setCustomer({ ...customer, name: e.target.value })} />
          </Col>
          <Col style={{ width: "180px", height: "68px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
            <h3 style={clasess.headerStyle}>{t("customers.modal.vatNO")}</h3>
            <input style={clasess.inputStyle1} type="text" placeholder="placeholder" value={customer?.buisnessNumber} onChange={(e) => setCustomer({ ...customer, buisnessNumber: e.target.value })} />
          </Col>
          <Col style={{ width: "180px", height: "68px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
            <h3 style={clasess.headerStyle}>{t("customers.modal.amountBalance")}</h3>
            <input style={clasess.inputStyle1} readOnly={true} type="text" placeholder="placeholder" />
          </Col>
        </Row>
        <Row style={{ marginBottom: '16px', marginTop: '16px', width: "54%" }}>
          <Col style={{ width: "180px", height: "68px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
            <h3 style={clasess.headerStyle}>{t("customers.modal.shippingCertificate")}</h3>
            <input style={clasess.inputStyle1} readOnly={true} type="text" placeholder="placeholder" />
          </Col>
          <Col style={{ width: "180px", height: "68px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
            <h3 style={clasess.headerStyle}>{t("customers.modal.openInvitations")}</h3>
            <input style={clasess.inputStyle1} readOnly={true} type="text" placeholder="placeholder" />
          </Col>
          <Col style={{ width: "180px", height: "68px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
            <h3 style={clasess.headerStyle} >{t("customers.modal.currency")}</h3>
            <input style={clasess.inputStyle1} type="text" placeholder="placeholder" />
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
            <Tab sx={{ backgroundColor: selectedTab === 3 ? '#ED028C' : '#EBECFF', color: selectedTab === 3 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "129px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "7px", marginRight: "10px", textTransform: 'none', fontFamily: "Lexend", fontSize: "16px", fontStyle: "normal", fontWeight: 500, lineHeight: "normal", }} label={t("customers.modal.bookKeeping")} />
            <Tab sx={{ backgroundColor: selectedTab === 4 ? '#ED028C' : '#EBECFF', color: selectedTab === 4 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "188px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "5px", marginRight: "10px", textTransform: 'none', fontFamily: "Lexend", fontSize: "16px", fontStyle: "normal", fontWeight: 500, lineHeight: "normal", }} label={t("customers.modal.budgetManagment")} />
            <Tab sx={{ backgroundColor: selectedTab === 5 ? '#ED028C' : '#EBECFF', color: selectedTab === 5 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "206px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "4px", marginRight: "10px", textTransform: 'none', fontFamily: "Lexend", fontSize: "16px", fontStyle: "normal", fontWeight: 500, lineHeight: "normal", }} label={t("customers.modal.priceLists")} />
            <Tab sx={{ backgroundColor: selectedTab === 6 ? '#ED028C' : '#EBECFF', color: selectedTab === 6 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "137px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "7px", marginRight: "10px", textTransform: 'none', fontFamily: "Lexend", fontSize: "16px", fontStyle: "normal", fontWeight: 500, lineHeight: "normal", }} label={t("customers.modal.gomakeUsers")} />
            <Tab sx={{ backgroundColor: selectedTab === 7 ? '#ED028C' : '#EBECFF', color: selectedTab === 7 ? '#FFF' : '#3F3F3F', minWidth: '0px', width: "106px", minHeight: '0px', height: '40px', borderRadius: "4px", padding: "7px", marginRight: "10px", textTransform: 'none', fontFamily: "Lexend", fontSize: "16px", fontStyle: "normal", fontWeight: 500, lineHeight: "normal", }} label={t("customers.modal.cardIndex")} />
          </Tabs>
          {
            //general info
            selectedTab == 0 &&
            <div>
              <Row style={{ marginBottom: '24px', marginTop: '24px', width: "90%" }}>
                {tabPanelInput(t("customers.modal.phone1"), customer?.tel1)}
                {tabPanelInput(t("customers.modal.phone2"), customer?.tel2)}
                {tabPanelInput(t("customers.modal.site"), customer?.site)}
                {tabPanelInput(t("customers.modal.mainContactName"))}
                {tabPanelInput(t("customers.modal.mobile"), customer?.phone, (e) => setCustomer({ ...customer, phone: e.target.value }))}
              </Row>
              <Row style={{ marginBottom: '24px', width: "90%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                {tabPanelInput(t("customers.modal.email"), customer?.mail, (e) => setCustomer({ ...customer, mail: e.target.value }))}
                {tabPanelInput(t("customers.modal.fax"), customer?.fax, (e) => setCustomer({ ...customer, fax: e.target.value }))}
                {tabPanelSelect(t("customers.modal.agent"), TestOptions, "select agent")}
                {tabPanelSwich(t("customers.modal.active"), customer?.isActive, (e) => setCustomer({ ...customer, isActive: e.target.checked }))}
                {tabPanelSwich(t("customers.modal.anOccasionalCustomer"), customer?.isOccasional, (e) => setCustomer({ ...customer, isOccasional: e.target.checked }))}
              </Row>
              <Row style={{ marginBottom: '24px', width: "90%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                {tabPanelSelect(t("customers.modal.typeOfDelivery"), TestOptions, "placeholder")}
                {tabPanelSelect(t("customers.modal.responsibleGraphicArtist"), TestOptions, "placeholder")}
                {tabPanelSelect(t("customers.modal.closingOrder"), TestOptions, "placeholder")}
                {tabPanelSelect(t("customers.modal.howToCloseInvoicing"), TestOptions, "placeholder")}
                {tabPanelSelect(t("customers.modal.messageGroup"), TestOptions, "placeholder")}
              </Row>
              <Row style={{ marginBottom: '24px' }}>
                <Col><h3 style={{ color: "var(--second-500, #ED028C)", fontFamily: "Lexend", fontSize: "14px", fontStyle: "normal", fontWeight: 500, lineHeight: "normal" }}>{t("customers.modal.lastOrderDetails")}</h3></Col>
              </Row>
              <Row style={{ marginBottom: '24px', width: "90%" }}>
                {tabPanelInput(t("customers.modal.name"))}
                {tabPanelInput(t("customers.modal.phone"))}
                {tabPanelInput(t("customers.modal.email"))}
                {tabPanelInput(t("customers.modal.address"))}
                {tabPanelInput(t("customers.modal.mobile"))}
              </Row>
              <Row style={{ marginBottom: '24px', marginTop: '24px', width: "90%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                {tabPanelTextArea(t("customers.modal.generalComment"))}
                {tabPanelTextArea(t("customers.modal.orderOpeningNotes"))}
                {tabPanelTextArea(t("customers.modal.orderClosingNotes"))}
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
                    <ContactForm key={x.index} contact={x} onDelete={deleteContactForm}></ContactForm>
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
                    <AddressForm key={x.index} address={x} onDelete={deleteAddressForm}></AddressForm>
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
            selectedTab == 3 &&
            <BookKeepingForm></BookKeepingForm>
          }
          {
            //budget info
            selectedTab == 4 &&
              <BudgetForm></BudgetForm>
          }
          {
            //price list info
            selectedTab == 5 &&
            <PriceListForm></PriceListForm>
          }
          {
            //GOMAKEUSER info
            selectedTab == 6 &&
            <Row  style={{display: "flex"  }}>
              <Col  md={10}>
                {
                  useres.map(x =>
                    <UserForm key={x.index} user={x} onDelete={deleteClientForm}></UserForm>
                  )
                }
              </Col>
              <Col  style={{marginTop:"68px" , justifyContent: 'flex-end'}} >
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