import { Switch, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useStyle } from "./style";
import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { useTranslation } from "react-i18next";
import { Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IPaddressForm } from "./address-component";
import AddIcon from '@mui/icons-material/Add';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';


const EmployeeCardWidget = ({ openModal, modalTitle, onClose, employee }: any) => {
    const { t } = useTranslation();
    const { clasess } = useStyle();
    const [open, setOpen] = useState(false);
    const [IPaddresses, setIPaddresses] = useState([]);


    useEffect(() => {
        setOpen(openModal)
    }, [openModal])

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

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

    return (
        <GoMakeModal
            openModal={open}
            modalTitle={t(modalTitle)}
            onClose={handleClose}
            insideStyle={clasess.insideStyle}>
            <div >
                <Row style={{ marginBottom: '30px' }} >
                    <Col style={{ display: "flex", alignItems: "center" }} >
                        <h3 style={clasess.headersStyle} >{t("employees.modal.firstName")}</h3>
                        <input style={clasess.inputStyle} type="text" value={employee?.firstname} onChange={(e: any) => {
                            const updatedEmployee = { ...employee, firstname: e.target.value };
                        }} /></Col>
                    <Col style={{ display: "flex", alignItems: "center" }} >
                        <h3 style={clasess.headersStyle} >{t("employees.modal.lastName")}</h3>
                        <input style={clasess.inputStyle} type="text" value={employee?.lastname} /></Col>
                    <Col style={{ display: "flex", alignItems: "center" }} >
                        <h3 style={clasess.headersStyle} >{t("employees.modal.email")}</h3>
                        <input style={clasess.inputStyle} type="text" value={employee?.email} /></Col>
                    <Col style={{ display: "flex", alignItems: "center" }} >
                        <h3 style={clasess.headersStyle} >{t("employees.modal.phone")}:</h3>
                        <input style={clasess.inputStyle} type="text" value={employee?.phone} /></Col>
                </Row>
                <Row >
                    <Col style={{ display: "flex", alignItems: "center" }} >
                        <h3 style={clasess.headersStyle} >{t("employees.modal.isAgent")}</h3>
                        <Switch style={clasess.switchStyle} checked={employee?.isAgent} />
                    </Col>
                </Row>
                <Row >
                    <Col style={{ display: "flex", alignItems: "center" }} >
                        <h3 style={clasess.headersStyle} >{t("employees.modal.isGraphicArtist")}</h3>
                        <Switch style={clasess.switchStyle} checked={employee?.isGraphicArtist} />
                    </Col>
                </Row>
                <Row style={{ marginBottom: '30px' }}>
                    <Col style={{ display: "flex", alignItems: "center" }} >
                        <h3 style={clasess.headersStyle} >{t("employees.modal.isHaveFullKanbanPermission")}</h3>
                        <Switch style={clasess.switchStyle} checked={employee?.isHaveFullKanbanPermission} />
                    </Col>
                </Row>
                <Row >
                    <Col>
                        <h4>{t("employees.modal.ipAddresses")}</h4>
                        <a style={{ display: "flex", alignItems: "center" }} onClick={addEmptyIPAddress} >
                            <AddIcon style={{ fontSize: "1.1em", color: "#8283BE" }}></AddIcon>
                            <Button style={{ color: "#8283BE" }}>{t("employees.modal.newAddress")}</Button>
                        </a>
                        {
                            IPaddresses.map(x =>
                                <div key={x.index}>
                                    <IPaddressForm IPaddress={x} onDelete={deleteIPAddressForm}></IPaddressForm>
                                </div>)
                        }
                    </Col>
                </Row>
                <Row style={{ display: "flex", justifyContent: "center", position: "absolute", bottom: 10, left: 0, right: 0 }}>
                    <GomakePrimaryButton style={clasess.autoButtonStyle} >{t("employees.buttons.saveChanges")}</GomakePrimaryButton>
                </Row>
            </div>
        </GoMakeModal>
    );
};
export { EmployeeCardWidget };