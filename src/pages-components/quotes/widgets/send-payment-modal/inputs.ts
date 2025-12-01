import { emailRegex } from "@/utils/regex";

const PaymentInputs = (state) => {
  // Safely get selected contact - handle undefined selectedContactIndex
  const contactIndex = 
    state?.selectedContactIndex !== undefined && state?.selectedContactIndex >= 0
      ? state.selectedContactIndex
      : (state?.documentContacts && state.documentContacts.length > 0 ? 0 : -1);
  
  const selectedContact =
    state?.documentContacts &&
    contactIndex >= 0 &&
    contactIndex < state.documentContacts.length
      ? state.documentContacts[contactIndex]
      : null;
  
  // Prioritize contact data from selectedContact, then fallback to state-level fields
  const contactName = selectedContact?.contactName || state?.contactName || "";
  const contactPhone = selectedContact?.contactPhone || state?.contactPhone || "";
  const contactMail = selectedContact?.contactMail || state?.contactMail || "";
  
  return [
    {
      name: "contactName",
      label: "sales.quote.contactName",
      type: "text",
      placeholder: "sales.quote.contactName",
      required: false,
      parameterKey: "contactName",
      value: contactName,
      options: [],
      isValid: true,
      readOnly: true,
    },
    {
      name: "contactPhone",
      label: "sales.quote.contactPhone",
      type: "phone",
      placeholder: "sales.quote.contactPhone",
      required: false,
      parameterKey: "contactPhone",
      value: contactPhone,
      options: [],
      isValid: true,
      readOnly: false,
    },
    {
      name: "contactMail",
      label: "sales.quote.contactEmail",
      type: "text",
      placeholder: "sales.quote.contactEmail",
      required: false,
      parameterKey: "contactMail",
      value: contactMail,
      options: [],
      isValid: true,
      readOnly: false,
      regex: emailRegex,
    },
    {
      name: "documentContacts",
      type: "select",
      placeholder: "prePayment.selectContact",
      required: false,
      parameterKey: "documentContacts",
      value:
        state?.documentContacts &&
        state?.documentContacts[state.selectedContactIndex]?.id,
      options:
        state?.documentContacts &&
        state?.documentContacts?.map((contact) => ({
          value: contact.id,
          text: contact.contactName,
        })),
      isValid: true,
      readOnly: false,
    },
    {
      name: "percentageOfTotal",
      label: "prePayment.percentageOfTotal",
      type: "text",
      placeholder: "prePayment.percentageOfTotal",
      required: false,
      parameterKey: "percentageOfTotal",
      value: state?.percentageOfTotal,
      options: [],
      isValid: true,
      readOnly: false,
    },
    {
      name: "totalToPay",
      label: "prePayment.totalToPay",
      type: "text",
      placeholder: "prePayment.totalToPay",
      required: false,
      parameterKey: "totalPayment",
      value: state?.totalPayment,
      options: [],
      isValid: true,
      readOnly: false,
    },
    {
      name: "numberOfInstallments",
      label: "prePayment.numberOfInstallments",
      type: "number",
      placeholder: "prePayment.numberOfInstallments",
      required: false,
      parameterKey: "numberOfInstallments",
      value: state?.numberOfInstallments,
      options: [],
      isValid: true,
    },
    {
      name: "invoiceDate",
      label: "prePayment.invoiceDate",
      type: "date",
      placeholder: "prePayment.invoiceDate",
      required: false,
      parameterKey: "invoiceDate",
      value: state?.invoiceDate
        ? new Date(state.invoiceDate).toISOString().split("T")[0]
        : "",
      options: [],
      isValid: true,
    },
  ];
};

export { PaymentInputs };
