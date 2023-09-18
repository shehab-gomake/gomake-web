
import { useStyle } from "./style";
import { TextareaAutosize } from '@mui/base';
import { useTranslation } from "react-i18next";
import { Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SecondSwitch } from "@/components/switch/second";
import { FONT_FAMILY } from "@/utils/font-family";
import { HeaderFilter } from "../header-filter";
const GeneralForm = ({ customer, setCustomer, agentsCategores, agentName, onChangeAgent }: any) => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const tabPanelInput = (label, val = null, onchange = null) => {
        return (
            <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
                <h3 style={classes.headerStyle}>{label}</h3>
                <input style={classes.inputStyle1} type="text" placeholder="placeholder" value={val} onChange={onchange} /></Col>
        );
    };
    const tabPanelTextArea = (placeHolder = null, value = null, onchange = null) => {
        return (
            <Col  >
                <TextareaAutosize style={classes.textAreaStyle} placeholder={placeHolder} value={value} onChange={onchange}></TextareaAutosize>
            </Col>
        );
    };
    return (
        <div>
            <Row style={{ marginBottom: '24px', marginTop: '24px', width: "90%" }}>
                {tabPanelInput(t("customers.modal.phone1"), customer?.tel1, (e) => setCustomer({ ...customer, tel1: e.target.value }))}
                {tabPanelInput(t("customers.modal.phone2"), customer?.tel2, (e) => setCustomer({ ...customer, tel2: e.target.value }))}
                {tabPanelInput(t("customers.modal.site"), customer?.internetSite, (e) => setCustomer({ ...customer, internetSite: e.target.value }))}
                {tabPanelInput(t("customers.modal.mainContactName"), customer?.mainContactName, (e) => setCustomer({ ...customer, mainContactName: e.target.value }))}
                {tabPanelInput(t("customers.modal.mobile"), customer?.phone, (e) => setCustomer({ ...customer, phone: e.target.value }))}
            </Row>
            <Row style={{ marginBottom: '24px', width: "72.5%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                {tabPanelInput(t("customers.modal.email"), customer?.mail, (e) => setCustomer({ ...customer, mail: e.target.value }))}
                {tabPanelInput(t("customers.modal.fax"), customer?.fax, (e) => setCustomer({ ...customer, fax: e.target.value }))}
                <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
                    <h3 style={classes.headerStyle}>{t("customers.modal.agent")}</h3>
                    <HeaderFilter style={classes.autoComplateStyle} setPlaceholder="placeholder" setAllOptions={agentsCategores} val={agentName} onchange={onChangeAgent}></HeaderFilter>
                </Col>
                <Col style={{ display: "flex", flexDirection: "column", marginTop: "45px" }}>
                    <Col style={{ display: "flex", width: "170px", height: "14px", justifyContent: "flex-start", gap: "8px" }}>
                        <SecondSwitch checked={customer?.isActive} size="small" onChange={(e) => setCustomer({ ...customer, isActive: e.target.checked })} />
                        <h3 style={classes.switchHeaderStyle} >{t("customers.modal.active")}</h3>
                    </Col>
                    <Col style={{ display: "flex", width: "190px", height: "14px", justifyContent: "flex-start", gap: "8px" }}>
                        <SecondSwitch checked={customer?.isOccasional} size="small" onChange={(e) => setCustomer({ ...customer, isOccasional: e.target.checked })} />
                        <h3 style={classes.switchHeaderStyle} >{t("customers.modal.anOccasionalCustomer")}</h3>
                    </Col>
                </Col>
            </Row>
            <Row style={{ marginBottom: '24px' }}>
                <span style={{ color: "var(--second-500, #ED028C)", fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 14), lineHeight: "normal" }}>{t("customers.modal.lastOrderDetails")}</span>
            </Row>
            <Row style={{ marginBottom: '24px', width: "90%" }}>
                {tabPanelInput(t("customers.modal.name"), customer?.lastOrderContactName, (e) => setCustomer({ ...customer, lastOrderContactName: e.target.value }))}
                {tabPanelInput(t("customers.modal.phone"), customer?.lastOrderContactPhone, (e) => setCustomer({ ...customer, lastOrderContactPhone: e.target.value }))}
                {tabPanelInput(t("customers.modal.email"), customer?.lastOrderContactMail, (e) => setCustomer({ ...customer, lastOrderContactMail: e.target.value }))}
                {tabPanelInput(t("customers.modal.address"), customer?.lastOrderContactAddress, (e) => setCustomer({ ...customer, lastOrderContactAddress: e.target.value }))}
                {tabPanelInput(t("customers.modal.mobile"))}
            </Row>
            <Row style={{ marginBottom: '24px', marginTop: '24px', width: "90%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                {tabPanelTextArea(t("customers.modal.generalComment"), customer?.generalNotes, (e) => setCustomer({ ...customer, generalNotes: e.target.value }))}
                {tabPanelTextArea(t("customers.modal.orderOpeningNotes"), customer?.newItemNotes, (e) => setCustomer({ ...customer, newItemNotes: e.target.value }))}
                {tabPanelTextArea(t("customers.modal.orderClosingNotes"), customer?.closeOrderNotes, (e) => setCustomer({ ...customer, closeOrderNotes: e.target.value }))}
            </Row>
        </div>

    );
};

export { GeneralForm };

