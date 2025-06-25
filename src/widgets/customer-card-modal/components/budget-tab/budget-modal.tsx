import React, { useState, useEffect } from "react";
import {
  GoMakeModal,
  GomakeTextInput,
  GoMakeAutoComplate,
  GomakePrimaryButton,
} from "@/components";
import { Checkbox, FormControlLabel } from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import {
  BudgetStatus,
  getBudgetStatusText,
  getPaymentStatusText,
  PaymentStatus,
} from "./helpers-budget";
import { DateRangePicker } from "rsuite";
import { useTranslation } from "react-i18next";
import { predefinedRanges } from "@/utils/dateRanges";
3;
const BudgetModal = ({ isOpen, onClose, onSave, budget }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    isAmountWithVat: false,
    amount: "",
    fromDate: null,
    toDate: null,
    paymentStatus: "",
    invoiceNumber: "",
    status: "",
  });

  useEffect(() => {
    if (budget) {
      setFormData(budget);
    } else {
      setFormData({
        name: "",
        isAmountWithVat: false,
        amount: "",
        fromDate: null,
        toDate: null,
        paymentStatus: "",
        invoiceNumber: "",
        status: "",
      });
    }
  }, [budget]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTextInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setFormData({
        ...formData,
        fromDate: new Date(dates[0]), // Save as new Date
        toDate: new Date(dates[1]),
      });
    }
  };

  const handleSubmit = () => {
    onSave(formData);
  };
  const BudgetStatusList: any = [
    {
      label: getBudgetStatusText(BudgetStatus.Active),
      value: BudgetStatus.Active,
    },
    {
      label: getBudgetStatusText(BudgetStatus.InActive),
      value: BudgetStatus.InActive,
    },
  ];
  const paymentStatusList: any = [
    {
      label: getPaymentStatusText(PaymentStatus.FullyPaid),
      value: PaymentStatus.FullyPaid,
    },
    {
      label: getPaymentStatusText(PaymentStatus.PayWhenOrderCreation),
      value: PaymentStatus.PayWhenOrderCreation,
    },
    {
      label: getPaymentStatusText(PaymentStatus.PayWhenOrderFinished),
      value: PaymentStatus.PayWhenOrderFinished,
    },
    {
      label: getPaymentStatusText(PaymentStatus.ByClientPaymentTerms),
      value: PaymentStatus.ByClientPaymentTerms,
    },
  ];
  return (
    <GoMakeModal
      open={isOpen}
      onClose={onClose}
      insideStyle={{ width: 500, height: "fit-contact" }}
      modalTitle={
        budget
          ? t("customers.modal.editBudget")
          : t("customers.modal.newBudgetModal")
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 20,
          width: "100%",
          gap: 20,
        }}
      >
        <GomakeTextInput
          placeholder={t("customers.modal.budgetName")}
          value={formData.name}
          onChange={(e) => handleTextInputChange("name", e.target.value)}
          style={{ height: 40 }}
        />
        <GomakeTextInput
          placeholder={t("deposits.total")}
          value={formData.amount}
          onChange={(e) => handleTextInputChange("amount", e.target.value)}
          style={{ height: 40 }}
        />
        {/* !here */}
        <DateRangePicker
          onChange={handleDateRangeChange}
          value={
            formData.fromDate
              ? [new Date(formData.fromDate), new Date(formData.toDate)]
              : null
          }
          ranges={predefinedRanges}
        />

        <GomakeTextInput
          placeholder={t("customers.modal.invoiceNumber")}
          value={formData.invoiceNumber}
          onChange={(e) =>
            handleTextInputChange("invoiceNumber", e.target.value)
          }
          style={{ height: 40 }}
        />
        <GoMakeAutoComplate
          options={paymentStatusList}
          defaultValue={paymentStatusList.find(
            (option) => option.value === budget?.paymentStatus
          )}
          onChange={(e, item) => {
            handleTextInputChange("paymentStatus", item?.value);
          }}
          style={{ border: "none", height: 40 }}
          placeholder={t("customers.modal.paymentStatus")}
        />
        <GoMakeAutoComplate
          options={BudgetStatusList}
          defaultValue={BudgetStatusList.find(
            (option) => option.value === budget?.status
          )}
          onChange={(e, item) => {
            handleTextInputChange("status", item?.value);
          }}
          style={{ border: "none", height: 40 }}
          placeholder={t("customers.modal.status")}
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
          label={t("customers.modal.vatIncluded")}
        />
        <GomakePrimaryButton
          onClick={handleSubmit}
          color="primary"
          variant="contained"
        >
          {budget ? t("materials.buttons.edit") : t("materials.buttons.save")}
        </GomakePrimaryButton>
      </div>
    </GoMakeModal>
  );
};

export { BudgetModal };
