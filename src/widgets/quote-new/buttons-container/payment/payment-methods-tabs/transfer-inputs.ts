const TransferInputs = (state , formattedOptions) => {
 
    return [
        {
            name: "transferAccount",
            label: "payment.accountCode",
            type: "select",
            required: false,
            placeholder: "payment.accountCode",
            parameterKey: "transferAccount",
            options: formattedOptions,
            value:state?.transferAccount,
            isValid: true,
            readOnly: false,
        },
        {
            name: "transferDate",
            label: "payment.transferDate",
            type: "date",
            placeholder: "payment.transferDate",
            required: false,
            parameterKey: "transferDate",
            value: state?.transferDate,
            options: [],
            isValid: true,
          },
          {
            name: "transferReference",
            label: "payment.referenceNumber",
            type: "text",
            placeholder: "payment.referenceNumber",
            required: false,
            parameterKey: "transferReference",
            value: state?.transferReference,
            options: [],
            isValid: true,
          },
          {
            name: "transferSum",
            label: "payment.totalTransfer",
            type: "number",
            placeholder: "payment.totalTransfer",
            required: false,
            parameterKey: "transferSum",
            value: state?.transferSum,
            options: [],
            isValid: true,
          },
    ]
}

export { TransferInputs };