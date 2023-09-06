import * as React from "react";
import { useStyle } from "./style";
import { GomakePrimaryButton } from "@/components";
import {  Col, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

const IPaddressForm = ({ IPaddress, onDelete }: any) => {

    const { clasess } = useStyle();
    const [selectedDate, setSelectedDate] = React.useState(getCurrentDate());
    const { t } = useTranslation();


    function getCurrentDate() {
        const today = new Date();
        let month = (today.getMonth() + 1).toString();
        let day = today.getDate().toString();
        
        if (month.length === 1) {
          month = '0' + month;
        }
        
        if (day.length === 1) {
          day = '0' + day;
        }
    
        return `${today.getFullYear()}-${month}-${day}`;
      }

      function handleDateChange(event) {
        setSelectedDate(event.target.value);
      }

    return (
        <div   style={{  marginBottom: '10px'}}>
            <Row >
                <Col >
                    <h3 style={clasess.headersStyle} >{t("employees.modal.address")}:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col >
                <Col >
                    <h3 style={clasess.headersStyle} >{t("employees.modal.description")}:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col >
                    <h3 style={clasess.headersStyle} >{t("employees.modal.created")}:</h3>
                    <input style={clasess.inputStyle} type="date" value={selectedDate} onChange={handleDateChange} />
                </Col>
                <Col>
                    <h3 style={clasess.headersStyle} >{t("employees.modal.updated")}:</h3>
                    <input style={clasess.inputStyle} type="date" value={selectedDate} onChange={handleDateChange} />
                </Col>
                <Col>
                <br></br>
                <Button style={clasess.deleteButtonStyle} variant="outlined" startIcon={<DeleteIcon/>} onClick={() => onDelete(IPaddress.index)}>
                {t("employees.buttons.delete")}</Button>
                </Col>
            </Row>
        </div>
    );
};

export { IPaddressForm };