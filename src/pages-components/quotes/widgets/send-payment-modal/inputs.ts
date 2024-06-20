const PaymentInputs = (state) => {
    return [
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
        readOnly: true,
      },
      {
        name: "totalToPay",
        label: "prePayment.totalToPay",
        type: "text",
        placeholder: "prePayment.totalToPay",
        required: false,
        parameterKey: "totalToPay",
        value: state?.totalToPay,
        options: [],
        isValid: true,
        readOnly: true,
      },
      {
        name: "numberOfInstallments",
        label: "prePayment.numberOfInstallments",
        type: "text",
        placeholder: "prePayment.numberOfInstallments",
        required: false,
        parameterKey: "numberOfInstallments",
        value: state?.numberOfInstallments ,
        options: [],
        isValid: true,
        readOnly: true,
      },
      {
        name: "invoiceDate",
        label: "prePayment.invoiceDate",
        type: "date",
        placeholder: "prePayment.invoiceDate",
        required: false,
        parameterKey: "invoiceDate",
        value: state?.invoiceDate,
        options: [],
        isValid: true,
        readOnly: true,
      }
    ]
  }
  
  export { PaymentInputs }