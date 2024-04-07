const FinancialPeriodInputs = (state: any , months , years ,monthStatues) => {
    return [
        {
            name: "financialMonth",
            label: "Month",
            type: "select",
            placeholder: "select month",
            required: false,
            parameterKey: "month",
            options: months.map((item) => ({
              value: item?.value,
              text: item?.label,
            })),
            value: state?.month,
            isValid: true,
        },
        {
            name: "financialYear",
            label: "Year",
            type: "select",
            placeholder: "select month",
            required: false,
            parameterKey: "year",
            options: years.map((item) => ({
              value: item.value,
              text: item.label,
            })),
            value: state?.year,
            isValid: true,
        },
        {
            name: "financialStatus",
            label: "Status of the month",
            type: "select",
            required: false,
            parameterKey: "status",
            options: monthStatues.map((item) => ({
              value: item.value,
              text: item.label,
            })),
            value: state?.status,
            isValid: true,
        },
    ]
}

export { FinancialPeriodInputs  };