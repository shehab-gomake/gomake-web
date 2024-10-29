import React, { useState, useEffect } from "react";
import { GoMakeModal, GomakeTextInput, GoMakeAutoComplate, GomakePrimaryButton } from "@/components";
import { Checkbox, FormControlLabel } from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { BudgetStatus, getBudgetStatusText, getPaymentStatusText, PaymentStatus } from "./helpers-budget";
import { DateRangePicker } from "rsuite";
3
const BudgetModal = ({ isOpen, onClose, onSave, budget }) => {
    console.log("budget", budget)
    const [formData, setFormData] = useState({
        name: "",
        isAmountWithVat: false,
        amount: "",
        fromDate: new Date(),
        toDate: new Date(),
        paymentStatus: "",
        invoiceNumber: "",
        status: ""
    });

    useEffect(() => {
        if (budget) {
            setFormData(budget);
        } else {
            setFormData({
                name: "",
                isAmountWithVat: false,
                amount: "",
                fromDate: new Date(),
                toDate: new Date(),
                paymentStatus: "",
                invoiceNumber: "",
                status: ""
            });
        }
    }, [budget]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleTextInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleDateRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            setFormData({
                ...formData,
                fromDate: new Date(dates[0]), // Save as new Date
                toDate: new Date(dates[1]),
                // Adjust as needed
            });
        }
    };

    const handleSubmit = () => {
        console.log("formData", formData)
        onSave(formData);
    };
    const BudgetStatusList: any = [
        { label: getBudgetStatusText(BudgetStatus.Active), value: BudgetStatus.Active },
        { label: getBudgetStatusText(BudgetStatus.InActive), value: BudgetStatus.InActive }
    ]
    const paymentStatusList: any = [
        { label: getPaymentStatusText(PaymentStatus.FullyPaid), value: PaymentStatus.FullyPaid },
        { label: getPaymentStatusText(PaymentStatus.PayWhenOrderCreation), value: PaymentStatus.PayWhenOrderCreation },
        { label: getPaymentStatusText(PaymentStatus.PayWhenOrderFinished), value: PaymentStatus.PayWhenOrderFinished },
        { label: getPaymentStatusText(PaymentStatus.ByClientPaymentTerms), value: PaymentStatus.ByClientPaymentTerms }
    ]
    return (
        <GoMakeModal open={isOpen} onClose={onClose} insideStyle={{ width: 500, height: "fit-contact" }} modalTitle={budget ? "Edit Budget" : "New Budget"}>
            <div style={{ display: "flex", flexDirection: "column", padding: 20, width: "100%", gap: 20 }}>
                <GomakeTextInput
                    placeholder="Budget Name"
                    value={formData.name}
                    onChange={(e) => handleTextInputChange("name", e.target.value)}
                    style={{ height: 40 }}
                />
                <GomakeTextInput
                    placeholder="Total"
                    value={formData.amount}
                    onChange={(e) => handleTextInputChange("amount", e.target.value)}
                    style={{ height: 40 }}
                />
                <DateRangePicker
                    onChange={handleDateRangeChange}
                    value={formData.fromDate ? [new Date(formData.fromDate), new Date(formData.toDate)] : null}
                />

                <GomakeTextInput
                    placeholder="Invoice Number"
                    value={formData.invoiceNumber}
                    onChange={(e) => handleTextInputChange("invoiceNumber", e.target.value)}
                    style={{ height: 40 }}
                />
                <GoMakeAutoComplate
                    options={paymentStatusList}
                    defaultValue={paymentStatusList.find(option => option.value === budget?.paymentStatus)}
                    onChange={(e, item) => {
                        handleTextInputChange("paymentStatus", item?.value)
                    }}
                    style={{ border: "none", height: 40 }}
                    placeholder="Payment Status"
                />
                <GoMakeAutoComplate
                    options={BudgetStatusList}
                    defaultValue={BudgetStatusList.find(option => option.value === budget?.status)}
                    onChange={(e, item) => {
                        handleTextInputChange("status", item?.value)
                    }}
                    style={{ border: "none", height: 40 }}
                    placeholder="Status"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            icon={<CheckboxIcon />}
                            checkedIcon={<CheckboxCheckedIcon />}
                            checked={formData.isAmountWithVat}
                            onChange={handleChange}
                            name="isAmountWithVat"
                        />
                    }
                    label="VAT Included"
                />
                <GomakePrimaryButton onClick={handleSubmit} color="primary" variant="contained" >
                    {budget ? "Edit" : "Save"}
                </GomakePrimaryButton>
            </div>
        </GoMakeModal >
    );
};

export { BudgetModal }