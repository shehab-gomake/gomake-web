import { Box, Button, Dialog, Switch, Tab, Tabs, ThemeProvider, createMuiTheme, styled } from "@mui/material";
import { useMemo, useState } from "react";
import { t } from "i18next";
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


const ButtonsWidget = () => {

  const theme = createMuiTheme({
    palette: {
      secondary: {
        main: '#F135A3',
      },
    },
  });

  // not final 
  const AgentsOptions = useMemo(
    () => [t("agent1"),
    t("agent2222"),
    t("agent34r5"),],
    []
  );
  const StatusOptions = useMemo(
    () => [t("Active"),
    t("Not active"),
    ],
    []
  );
  const ShipmentTypeOptions = useMemo(
    () => [t("Pickup"),
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
      t("Budget"),
      t("Sum"),
      t("Balance"),
      t("Invoice number"),
      t("Status"),
      t("#"),
    ],
    []
  );

  const renderTabPanelInput = (index, label) => {
    return (
      <Box hidden={selectedTab !== index} sx={{ p: 3 }} >
        <h3 style={clasess.headersStyle} >{label}</h3>
        <input style={clasess.inputStyle} type="text" />
      </Box>
    );
  };

  const renderTabPanelSwich = (index, label) => {
    return (
      <Box hidden={selectedTab !== index} sx={{ p: 3 }} >
        <h3 style={clasess.headersStyle} >{label}</h3>
        <Switch style={clasess.switchStyle} />
      </Box>
    );
  };

  const renderTabPanelSelect = (index, label, options, placeHold) => {
    return (
      <Box hidden={selectedTab !== index} sx={{ p: 3 }} >
        <h3 style={clasess.headersStyle} >{label}</h3>
        <HeaderFilter style={clasess.autoComplateStyle} setPlaceholder={placeHold} setAllOptions={options} ></HeaderFilter>
      </Box>
    );
  };

  const renderTabPanelTextArea = (index, label) => {
    return (
      <Box hidden={selectedTab !== index} sx={{ p: 3 }} >
        <h3 style={clasess.headersStyle} >{label}</h3>
        <TextareaAutosize style={clasess.textAreaStyle }></TextareaAutosize>
      </Box>
    );
  };


  const { clasess } = useStyle();
  const [openModal, setOpenModal] = useState(false);
  const onCloseModal = () => {
    setOpenModal(false);
  };

  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [useres, setUsers] = useState([]);
  const [IPaddresses, setIPaddresses] = useState([]);


  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [selectedTab, setSelectedTab] = useState(0);

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
      <div>
        <GomakePrimaryButton variant="contained" onClick={handleOpen} style={clasess.buttonStyle}>
          Add Customer
        </GomakePrimaryButton>
        <GomakePrimaryButton variant="contained" style={clasess.buttonStyle}>
          Update Customer
        </GomakePrimaryButton>
      </div>
      <Dialog open={open} onClose={onCloseModal}>
        <GoMakeModal
          openModal={handleOpen}
          modalTitle={t("Add Customer")}
          onClose={handleClose}
          insideStyle={clasess.insideStyle}
        >
          <div style={{ marginBottom: '20px' }} >
            <div style={clasess.filterStyle}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3 style={clasess.headersStyle} >Code:</h3>
                <input readOnly={true} style={clasess.inputStyle} type="text" />
              </div>
              <div style={{ display: "flex", alignItems: "center", marginRight: "495px" }}>
                <h3 style={clasess.headersStyle} >Name1:</h3>
                <input style={clasess.inputStyle} type="text" />
              </div>
            </div>
            <div style={clasess.filterStyle}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3 style={clasess.headersStyle} >Name2:</h3>
                <input style={clasess.inputStyle} type="text" />
              </div>
              <div style={{ display: "flex", alignItems: "center", marginRight: "457px" }}>
                <h3 style={clasess.headersStyle} >Open Orders:</h3>
                <input readOnly={true} style={clasess.inputStyle} type="text" />
              </div>
            </div>
            <div style={clasess.filterStyle}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3 style={clasess.headersStyle} >Vat number:</h3>
                <input style={clasess.inputStyle} type="text" />
              </div>
              <div style={{ display: "flex", alignItems: "center", marginRight: "416px", }}>
                <h3 style={clasess.headersStyle} >Currency</h3>
                <GoMakeAutoComplate style={clasess.selectStyle} placeholder={null} options={CurrencyOptions}
                />
              </div>
            </div>
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
                      {renderTabPanelInput(0, "Phone1:")}
                      {renderTabPanelInput(0, "Phone2:")}
                      {renderTabPanelInput(0, "Site:")}
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {renderTabPanelInput(0, "Main contact name:")}
                      {renderTabPanelInput(0, "Mobile:")}
                      {renderTabPanelInput(0, "Email:")}
                      {renderTabPanelInput(0, "Fax:")}
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {renderTabPanelSwich(0, "An occasional customer")}
                      {renderTabPanelSwich(0, "Sending a ready email")}
                      {renderTabPanelSelect(0, "Active:", StatusOptions, null)}
                      {renderTabPanelSelect(0, "Shipment Type:", ShipmentTypeOptions, "select shipment type")}
                      {renderTabPanelSelect(0, "Agent:", AgentsOptions, "select agent")}
                    </div>
                    <Box hidden={selectedTab !== 0} sx={{ p: 3 }} >
                      <h3 style={clasess.headers3Style} >Last order details</h3>
                    </Box>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {renderTabPanelInput(0, "Name:")}
                      {renderTabPanelInput(0, "Phone:")}
                      {renderTabPanelInput(0, "E-mail:")}
                      {renderTabPanelInput(0, "Address:")}
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {renderTabPanelTextArea(0, "General notes")}
                      {renderTabPanelTextArea(0, "Open Orders notes")}
                      {renderTabPanelTextArea(0, "Close Orders notes")}
                    </div>
                  </div>
                }
                {
                  //contacts info
                  selectedTab == 1 &&
                  <div>
                    <a style={{ display: "flex", justifyContent: 'flex-end', alignItems: "center" }} onClick={addEmptyContact} >
                      <PersonAddAltRoundedIcon style={{ fontSize: "1.1em", color: "#8283BE" }} > </PersonAddAltRoundedIcon>
                      <Button style={{ color: "#8283BE" }} >add contact</Button>
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
                      <Button style={{ color: "#8283BE" }}>new address</Button>
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
                      <Button style={{ color: "#8283BE" }}>new budget</Button>
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
                      <Button style={{ color: "#8283BE" }}>new client</Button>
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
                    <Button style={{ color: "#8283BE" }}>new address</Button>
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
                  <GomakePrimaryButton style={clasess.autoButtonStyle} >add</GomakePrimaryButton>
                </div>
              </Box>
            </ThemeProvider>
          </div>
        </GoMakeModal>
      </Dialog>
    </div>

  );

};
export { ButtonsWidget };
