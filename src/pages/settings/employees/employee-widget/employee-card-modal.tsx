import { Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { useStyle } from "./style";
import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { useTranslation } from "react-i18next";
import { Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeeCardWidget = ({ openModal, modalTitle, onClose, employee, showUpdateButton, showAddButton }: any) => {
    const { t } = useTranslation();
    const { clasess } = useStyle();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(openModal)
    }, [openModal])

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    return (
        <GoMakeModal
            openModal={open}
            modalTitle={t(modalTitle)}
            onClose={handleClose}
            insideStyle={clasess.insideStyle}>                
                <div >
                    <Row style={{ marginBottom: '8px' }} >
                        <Col style={{ display: "flex", alignItems: "center" }} >
                            <h3 style={clasess.headersStyle} >{t("employees.modal.firstName")}</h3>
                            <input style={clasess.inputStyle} type="text" value={employee?.firstname} /></Col>
                        <Col style={{ display: "flex", alignItems: "center" }} >
                            <h3 style={clasess.headersStyle} >{t("employees.modal.lastName")}</h3>
                            <input style={clasess.inputStyle} type="text" value={employee?.lastname} /></Col>
                        <Col style={{ display: "flex", alignItems: "center" }} >
                            <h3 style={clasess.headersStyle} >{t("employees.modal.email")}</h3>
                            <input style={clasess.inputStyle} type="text" value={employee?.email} /></Col>
                        <Col style={{ display: "flex", alignItems: "center" }} >
                            <h3 style={clasess.headersStyle} >{t("employees.modal.phone")}</h3>
                            <input style={clasess.inputStyle} type="text" value={employee?.phone} /></Col>
                    </Row>
                    <Row style={{ marginBottom: '8px' }}>
                        <Col style={{ display: "flex", alignItems: "center" }} >
                            <h3 style={clasess.headersStyle} >{t("employees.modal.isAgent")}</h3>
                            <Switch style={clasess.switchStyle} checked={employee?.isAgent} />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '8px' }}>
                        <Col style={{ display: "flex", alignItems: "center" }} >
                            <h3 style={clasess.headersStyle} >{t("employees.modal.isGraphicArtist")}</h3>
                            <Switch style={clasess.switchStyle} checked={employee?.isGraphicArtist} />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '8px' }}>
                        <Col style={{ display: "flex", alignItems: "center" }} >
                            <h3 style={clasess.headersStyle} >{t("employees.modal.isHaveFullKanbanPermission")}</h3>
                            <Switch style={clasess.switchStyle} checked={employee?.isHaveFullKanbanPermission} />
                        </Col>
                    </Row>
                </div>
                <div style={{display: "flex", justifyContent: "center"}}>
                    {showAddButton && <GomakePrimaryButton style={clasess.autoButtonStyle} >{t("employees.modal.add")}</GomakePrimaryButton>}
                    {showUpdateButton && <GomakePrimaryButton style={clasess.autoButtonStyle} >{t("employees.modal.update")}</GomakePrimaryButton>}
                </div>
        </GoMakeModal>
    );
};
export { EmployeeCardWidget };