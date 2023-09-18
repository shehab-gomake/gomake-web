import { useEffect, useMemo, useState } from "react";
import { useStyle } from "./style";
import { GoMakeModal } from "@/components";
import { useTranslation } from "react-i18next";
import { Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HeaderFilter } from "../../header-filter";

const BudgetWidget = ({ openModal, onClose }: any) => {

    const { t } = useTranslation();
    const { clasess } = useStyle();
    const [open, setOpen] = useState(false);
    const testOptions = useMemo(
        () => [
            "option1",
            "option2",
        ],
        []
    );

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
            onClose={handleClose}
            insideStyle={clasess.insideStyle}
        >
            <div style={{ width: "572px", height: "370px", display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: "24px" }}>
            <Row style={{ display: "flex", width: "572px", height: "30px",alignItems: "flex-start"}}>
                    <h6 style={{color: "var(--primary-500, #2E3092)",fontFamily: "Lexend",fontSize: "24px",fontStyle: "normal",fontWeight: 500, lineHeight: "normal"}}>{t("customers.modal.newBudget")}</h6>
                    </Row>
                <Row style={{ display: "flex", width: "572px", height: "68px",alignItems: "flex-start", gap: "16px", }}>
                    <Col style={{ display: "flex", width: "180px", height: "68px" ,flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
                        <h3 style={clasess.headerStyle}>{t("customers.modal.budgetName")}</h3>
                        <input style={clasess.inputStyle} type="text" placeholder="placeholder" /></Col>
                    <Col style={{ display: "flex", width: "180px", height: "68px" ,flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
                        <h3 style={clasess.headerStyle}>{t("customers.modal.amount")}</h3>
                        <input style={clasess.inputStyle} type="text" placeholder="placeholder" /></Col>
                    <Col style={{ display: "flex", width: "180px", height: "68px" ,flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
                        <h3 style={clasess.headerStyle}>{t("customers.modal.balanceNIS")}</h3>
                        <input style={clasess.inputStyle} type="text" placeholder="placeholder" /></Col>
                </Row>
                <Row style={{ display: "flex", width: "572px", height: "68px", alignItems: "flex-start", gap: "16px", }}>
                    <Col style={{ display: "flex", width: "180px", height: "68px" ,flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
                        <h3 style={clasess.headerStyle}>{t("customers.modal.attack")}</h3>
                        <input style={clasess.inputStyle} type="text" placeholder="placeholder" /></Col>
                    <Col style={{ display: "flex", width: "180px", height: "68px" ,flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
                        <h3 style={clasess.headerStyle} >{t("customers.modal.paymentStatus")}</h3>
                        <HeaderFilter setAllOptions={testOptions} style={clasess.autoComplateStyle} setPlaceholder="placeholder" ></HeaderFilter>
                    </Col>
                    <Col style={{ display: "flex", width: "180px", height: "68px" ,flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
                        <h3 style={clasess.headerStyle}>{t("customers.modal.invoiceNumber")}</h3>
                        <input style={clasess.inputStyle} type="text" placeholder="placeholder" /></Col>
                </Row>
                <Row style={{ display: "inline-flex", width: "376px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "16px" }}>
                    <Col style={{ display: "flex", width: "180px", height: "68px" ,flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
                        <h3 style={clasess.headerStyle} >{t("customers.modal.status")}</h3>
                        <HeaderFilter setAllOptions={testOptions} style={clasess.autoComplateStyle} setPlaceholder="placeholder" ></HeaderFilter>
                    </Col>
                    <Col style={{ display: "flex", width: "180px", height: "68px" ,flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
                        <h3 style={clasess.headerStyle} >{t("customers.modal.associatingBudget")}</h3>
                        <HeaderFilter setAllOptions={testOptions} style={clasess.autoComplateStyle} setPlaceholder="placeholder" ></HeaderFilter>
                    </Col>
                </Row>
                <Row style={{ display: "flex", width: "572px", height: "40px", justifyContent: "flex-end", alignItems: "flex-end", gap: "10px", alignSelf: "stretch", }}>
                    <button style={{ display: "flex", width: "308px", height: "40px", padding: "10px 32px", justifyContent: "flex-end", alignItems: "flex-end", gap: "10px", borderRadius: "4px", background: "var(--medium-500, #504FA1)" ,color: "var(--puree, #FFF)",textAlign: "center",fontFamily: "Lexend",fontSize: "16px",fontStyle: "normal",fontWeight: 500,lineHeight: "normal" ,border:"none"}}>{t("customers.buttons.addAndCreate")}</button>
                    <button style={{ display: "flex", width: "157px", height: "40px", padding: "10px 32px", justifyContent: "flex-end", alignItems: "flex-end", gap: "10px", borderRadius: "4px", background: "var(--second-500, #ED028C)",color: "var(--puree, #FFF)",textAlign: "center",fontFamily: "Lexend",fontSize: "16px",fontStyle: "normal",fontWeight: 500,lineHeight: "normal", border:"none"}}>{t("customers.buttons.addBudget")}</button>
                </Row>
            </div>
        </GoMakeModal>
    );
};
export { BudgetWidget };

