const FinancialPeriodInputs = (state: any , months , years ,monthStatues) => {
    return [
        {
            name: "financialMonth",
            label: "financesWidget.month",
            type: "select",
            required: false,
            parameterKey: "month",
            options: months.map((item) => ({
              value: item?.value,
              text: item?.label,
            })),
            value: state?.month,
            isValid: true,
            disableClearable:true
        },
        {
            name: "financialYear",
            label: "financesWidget.year",
            type: "select",
            required: false,
            parameterKey: "year",
            options: years.map((item) => ({
              value: item.value,
              text: item.label,
            })),
            value: state?.year,
            isValid: true,
            disableClearable:true

        },
        {
            name: "statusMonth",
            label: "financesWidget.statusMonth",
            type: "select",
            required: false,
            parameterKey: "status",
            options: monthStatues.map((item) => ({
              value: item.value,
              text: item.label,
            })),
            value: state?.status,
            isValid: true,
            disableClearable:true
        },
    ]
}

export { FinancialPeriodInputs  };