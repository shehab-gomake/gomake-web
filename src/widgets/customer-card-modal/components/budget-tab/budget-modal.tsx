import React, { useState, useEffect } from "react";
// Import your custom components
import { GoMakeModal, GomakeTextInput, GoMakeAutoComplate, GomakePrimaryButton } from "@/components";
import { Checkbox, FormControlLabel } from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";

const BudgetModal = ({ isOpen, onClose, onSave, budget }) => {
    console.log("budget", budget)
    const [formData, setFormData] = useState({
        budgetName: "",
        vatIncluded: false,
        total: "",
        period: "",
        paymentStatus: "",
        invoiceNumber: "",
        status: ""
    });

    useEffect(() => {
        if (budget) {
            setFormData(budget);
        } else {
            setFormData({
                budgetName: "",
                vatIncluded: false,
                total: "",
                period: "",
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

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <GoMakeModal open={isOpen} onClose={onClose} insideStyle={{ width: 500 }}>
            <div style={{ display: "flex", flexDirection: "column", padding: 20, marginTop: "10%", width: "100%", gap: 20 }}>
                <h2>{budget ? "Edit Budget" : "New Budget"}</h2>
                <GomakeTextInput
                    placeholder="Budget Name"
                    value={formData.budgetName}
                    onChange={(e) => handleTextInputChange("budgetName", e.target.value)}
                />
                <GomakeTextInput
                    placeholder="Total"
                    value={formData.total}
                    onChange={(e) => handleTextInputChange("total", e.target.value)}
                />
                <GomakeTextInput
                    placeholder="Period"
                    type="text"
                    value={formData.period}
                    onChange={(e) => handleTextInputChange("period", e.target.value)}
                />
                <GomakeTextInput
                    placeholder="Invoice Number"
                    value={formData.invoiceNumber}
                    onChange={(e) => handleTextInputChange("invoiceNumber", e.target.value)}
                />
                <GoMakeAutoComplate
                    key={`paymentStatus-${formData.paymentStatus}`}
                    options={[{ label: "Paid", value: "Paid" }, { label: "Pending", value: "Pending" }]}
                    value={formData.paymentStatus}
                    onChange={(e, item) => {
                        handleTextInputChange("paymentStatus", item.value)
                    }}
                    style={{ border: "none" }}
                    placeholder="Payment Status"
                />
                <GoMakeAutoComplate
                    key={`status-${formData.status}`}
                    options={[{ label: "Approved", value: "Approved" }, { label: "Pending Approval", value: "Pending Approval" }]}
                    value={formData.status}
                    onChange={(e, item) => {
                        handleTextInputChange("status", item.value)
                    }}
                    style={{ border: "none" }}
                    placeholder="Status"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            icon={<CheckboxIcon />}
                            checkedIcon={<CheckboxCheckedIcon />}
                            checked={formData.vatIncluded}
                            onChange={handleChange}
                            name="vatIncluded"
                        />
                    }
                    label="VAT Included"
                />
                <GomakePrimaryButton onClick={handleSubmit} color="primary" variant="contained" >
                    Save
                </GomakePrimaryButton>
            </div>
        </GoMakeModal >
    );
};

export { BudgetModal }