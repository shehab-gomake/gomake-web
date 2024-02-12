const TransferInputs = (state , accountCodes) => {
    return [
        {
            name: "accountCode",
            label: "payment.accountCode",
            type: "select",
            required: false,
            placeholder: "payment.accountCode",
            parameterKey: "accountCode",
            options: accountCodes.map((code) => ({
                value: code.value,
                text: code.label,
              })),   
              
            value: state?.accountCode,
            isValid: true,
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
            name: "referenceNumber",
            label: "payment.referenceNumber",
            type: "text",
            placeholder: "payment.referenceNumber",
            required: false,
            parameterKey: "referenceNumber",
            value: state?.referenceNumber,
            options: [],
            isValid: true,
          },
          {
            name: "totalTransfer",
            label: "payment.totalTransfer",
            type: "number",
            placeholder: "payment.totalTransfer",
            required: false,
            parameterKey: "totalTransfer",
            value: state?.totalTransfer,
            options: [],
            isValid: true,
          },
    ]
}

export { TransferInputs };