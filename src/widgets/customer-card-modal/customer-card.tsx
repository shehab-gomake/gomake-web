import { Box, Button, Dialog, Switch, Tab, Tabs, ThemeProvider, createMuiTheme, styled } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useStyle } from "./style";
import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton } from "@/components";
import { HeaderFilter } from "./header-filter";
import { TextareaAutosize } from '@mui/base';
import { ContactForm } from "./components/contacts-tab";
import { AddressForm } from "./components/address-tab";
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import AddHomeRoundedIcon from '@mui/icons-material/AddHomeRounded';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Table } from "@/widgets/table/table";
import { PriceListForm } from "./components/priceList-tab/form";
import { CustomerForm } from "./components/gomakeUser-tab/CustomerForm";
import AddIcon from '@mui/icons-material/Add';
import { IPaddressForm } from "./components/gomakeUser-tab/IPAddressForm";
import { Col, Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { useTranslation } from "react-i18next";

const CustomerCardWidget = ({ openModal, modalTitle, onClose, customer, showUpdateButton, showAddButton

}: any) => {

  const theme = createMuiTheme({
    palette: {
      secondary: {
        main: '#F135A3',
      },
    },
  });

  const { t } = useTranslation();

  const statuses = useMemo(
    () => [
      { label: t("customers.active"), value: "true" },
      { label: t("customers.inactive"), value: "false" },
    ],
    []
  );

  const CurrencyOptions = useMemo(
    () => [t("USD (US Dollar): $"),
    t("EUR (Euro): €"),
    t("ILS (Israeli Shekel ): ₪"),],
    []
  );

  const tabelHeaders = useMemo(
    () => [
      t("customers.modal.budget"),
      t("customers.modal.sum"),
      t("customers.modal.balance"),
      t("customers.modal.invoiceNumber"),
      t("customers.modal.status"),
      t("customers.modal.hashtag"),
    ],
    []
  );

  const tabPanelInput = (label, val = null) => {
    return (
      <Box sx={{ p: 3 }} >
        <h3 style={clasess.headersStyle} >{label}</h3>
        <input style={clasess.inputStyle} type="text" value={val} />
      </Box>
    );
  };

  const tabPanelSwich = (label) => {
    return (
      <Box sx={{ p: 3 }} >
        <h3 style={clasess.headersStyle} >{label}</h3>
        <Switch style={clasess.switchStyle} />
      </Box>
    );
  };

  const tabPanelSelect = (label, options=null, placeHold=null) => {
    return (
      <Box sx={{ p: 3 }} >
        <h3 style={clasess.headersStyle} >{label}</h3>
        <HeaderFilter style={clasess.autoComplateStyle} setPlaceholder={placeHold} setAllOptions={options} ></HeaderFilter>
      </Box>
    );
  };

  const tabPanelTextArea = (label) => {
    return (
      <Box sx={{ p: 3 }} >
        <h3 style={clasess.headersStyle} >{label}</h3>
        <TextareaAutosize style={clasess.textAreaStyle}></TextareaAutosize>
      </Box>
    );
  };
  const { clasess } = useStyle();
  const [selectedTab, setSelectedTab] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [budgets, setBudgets] = useState([]);
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

  const addEmptyBudget = () => {
    var temp = [...budgets];
    const index = temp.length + 1;
    temp.push({ name: "", index: index });
    setBudgets(temp);
  }

  const deleteBudgetForm = (index) => {
    debugger;
    var temp = [...budgets];
    temp = temp.filter(x => x.index != index);
    setBudgets(temp);
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

  const deleteIPAddressForm = (index) => {
    debugger;
    var temp = [...IPaddresses];
    temp = temp.filter(x => x.index != index);
    setIPaddresses(temp);
  }

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <GoMakeModal
        openModal={open}
        modalTitle={t(modalTitle)}
        onClose={handleClose}
        insideStyle={clasess.insideStyle}>
        <div style={{ width: "25%", marginBottom: '15px' }} >
          <Row style={{ marginBottom: '8px' }} >
            <Col style={{ display: "flex", alignItems: "center" }} >
              <h3 style={clasess.headersStyle} >{t("customers.modal.code")}</h3>
              <input readOnly={true} style={clasess.inputStyle} type="text" value={customer?.code} />
            </Col>
            <Col style={{ display: "flex", alignItems: "center" }} >
              <h3 style={clasess.headersStyle} >{t("customers.modal.name")}</h3>
              <input style={clasess.inputStyle} type="text" value={customer?.name} /></Col>
          </Row>
          <Row style={{ marginBottom: '8px' }}>
            <Col style={{ display: "flex", alignItems: "center" }} >
              <h3 style={clasess.headersStyle} >{t("customers.modal.vatNumber")}</h3>
              <input style={clasess.inputStyle} type="text" /></Col>
            <Col style={{ display: "flex", alignItems: "center" }} >
              <h3 style={clasess.headersStyle} >{t("customers.modal.openOrders")}</h3>
              <input readOnly={true} style={clasess.inputStyle} type="text" /></Col>
          </Row>
          <Row>
            <Col>
              <h3 style={clasess.headersStyle} >{t("customers.modal.currency")}</h3>
              <GoMakeAutoComplate style={{ width: convertWidthToVW(100), height: convertHeightToVH(30), }} placeholder={null} options={CurrencyOptions} />
            </Col>
          </Row>
        </div>
        <div>
          <ThemeProvider theme={theme}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={selectedTab} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary" >
                <Tab label="General" />
                <Tab label="Contacts" />
                <Tab label="Addresses" />
                <Tab label="Budget managment" />
                <Tab label="Price lists" />
                <Tab label="GOMAKE USERS" />
              </Tabs>
              {
                //general info
                selectedTab == 0 &&
                <div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {tabPanelInput(t("customers.modal.phone1"), customer?.tel1)}
                    {tabPanelInput(t("customers.modal.phone2"), customer?.tel2)}
                    {tabPanelInput(t("customers.modal.site"), customer?.name)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {tabPanelInput(t("customers.modal.mainContactName"))}
                    {tabPanelInput(t("customers.modal.mobile"))}
                    {tabPanelInput(t("customers.modal.email"))}
                    {tabPanelInput(t("customers.modal.fax"))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {tabPanelSwich(t("customers.modal.anOccasionalCustomer"))}
                    {tabPanelSwich(t("customers.modal.sendingReadyEmail"))}
                    {tabPanelSelect(t("customers.modal.status"), statuses, null)}
                    {tabPanelSelect(t("customers.modal.shipmentType"),)}
                    {tabPanelSelect(t("customers.modal.agent"), null , "select agent")}
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {tabPanelTextArea(t("customers.modal.generalNotes"))}
                    {tabPanelTextArea(t("customers.modal.openOrdersNotes"))}
                    {tabPanelTextArea(t("customers.modal.closeOrdersNotes"))}
                  </div>
                </div>
              }
              {
                //contacts info
                selectedTab == 1 &&
                <div>
                  <a style={{ display: "flex", justifyContent: 'flex-end', alignItems: "center" }} onClick={addEmptyContact} >
                    <PersonAddAltRoundedIcon style={{ fontSize: "1.1em", color: "#8283BE" }} > </PersonAddAltRoundedIcon>
                    <Button style={{ color: "#8283BE" }} >{t("customers.buttons.addContact")}</Button>
                  </a>
                  {
                    contacts.map(x =>
                      <div key={x.index}>
                        <ContactForm contact={x} onDelete={deleteContactForm}></ContactForm>
                      </div>)
                  }
                </div>
              }
              {
                //address info
                selectedTab == 2 &&
                <div>
                  <a style={{ display: "flex", justifyContent: 'flex-end', alignItems: "center" }} onClick={addEmptyAdress} >
                    <AddHomeRoundedIcon style={{ fontSize: "1.1em", color: "#8283BE" }}></AddHomeRoundedIcon>
                    <Button style={{ color: "#8283BE" }}>{t("customers.buttons.newAddress")}</Button>
                  </a>
                  {
                    addresses.map(x =>
                      <div key={x.index}>
                        <AddressForm address={x} onDelete={deleteAddressForm}></AddressForm>
                      </div>)
                  }
                </div>
              }
              {
                //budget info
                selectedTab == 3 &&
                <div>
                  <a style={{ display: "flex", justifyContent: 'flex-end', alignItems: "center" }} onClick={addEmptyBudget}  >
                    <AddBoxIcon style={{ fontSize: "1.1em", color: "#8283BE" }}></AddBoxIcon>
                    <Button style={{ color: "#8283BE" }}>{t("customers.buttons.newBudget")}</Button>
                  </a>
                  <div style={clasess.tableContainer}>
                    <Table tableHeaders={tabelHeaders} tableRows={null} ></Table>
                  </div>
                </div>
              }
              {
                //price list info
                selectedTab == 4 &&
                <PriceListForm></PriceListForm>
              }
              {
                //GOMAKEUSER info
                selectedTab == 5 &&
                <div >
                  <div>
                    <a style={{ display: "flex", justifyContent: 'flex-end', alignItems: "center" }} onClick={addEmptyClient} >
                      <AddIcon style={{ fontSize: "1.1em", color: "#8283BE" }}></AddIcon>
                      <Button style={{ color: "#8283BE" }}>{t("customers.buttons.newClient")}</Button>
                    </a>
                    {
                      useres.map(x =>
                        <div key={x.index}>
                          <CustomerForm user={x} onDelete={deleteClientForm}></CustomerForm>
                        </div>)
                    }
                  </div>
                  <div>
                    <a style={{ display: "flex", justifyContent: 'flex-end', alignItems: "center" }} onClick={addEmptyIPAddress} >
                      <AddIcon style={{ fontSize: "1.1em", color: "#8283BE" }}></AddIcon>
                      <Button style={{ color: "#8283BE" }}>{t("customers.buttons.newAddress")}</Button>
                    </a>
                    {
                      IPaddresses.map(x =>
                        <div key={x.index}>
                          <IPaddressForm IPaddress={x} onDelete={deleteIPAddressForm}></IPaddressForm>
                        </div>)
                    }
                  </div>
                </div>
              }
              <div style={{ display: "flex", justifyContent: "center", marginTop: "70px", marginBottom: "10px" }} >
                {showAddButton && <GomakePrimaryButton style={clasess.autoButtonStyle} >{t("customers.modal.add")}</GomakePrimaryButton>}
                {showUpdateButton && <GomakePrimaryButton style={clasess.autoButtonStyle} >{t("customers.modal.update")}</GomakePrimaryButton>}
              </div>
            </Box>
          </ThemeProvider>
        </div>
      </GoMakeModal>
    </div>

  );

};
export { CustomerCardWidget };