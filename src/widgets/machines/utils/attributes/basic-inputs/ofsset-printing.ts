const ofssetPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "monthlyMaintenanceCost",
            label: "machineAttributes.monthlyMaintenanceCost",
            type: "text",
            placeholder: "machineAttributes.monthlyMaintenanceCost",
            required: true,
            parameterKey: "monthlyMaintenanceCost",
            options: [],
            value: state.attributes?.monthlyMaintenanceCost ? state.attributes?.monthlyMaintenanceCost : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.monthlyMaintenanceCost,
        },
        {
            name: "electricityCostPerWorkingHour",
            label: "machineAttributes.electricityCostPerWorkingHour",
            type: "text",
            placeholder: "machineAttributes.electricityCostPerWorkingHour",
            required: true,
            parameterKey: "electricityCostPerWorkingHour",
            options: [],
            value: state.attributes?.electricityCostPerWorkingHour ? state.attributes?.electricityCostPerWorkingHour : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.electricityCostPerWorkingHour,
        },
        {
            name: "monthlyCostOfSpace",
            label: "machineAttributes.monthlyCostOfSpace",
            type: "text",
            placeholder: "machineAttributes.monthlyCostOfSpace",
            required: true,
            parameterKey: "monthlyCostOfSpace",
            options: [],
            value: state.attributes?.monthlyCostOfSpace ? state.attributes?.monthlyCostOfSpace : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.monthlyCostOfSpace,
        },
        {
            name: "dailyProductivityInHours",
            label: "machineAttributes.dailyProductivityInHours",
            type: "text",
            placeholder: "machineAttributes.dailyProductivityInHours",
            required: true,
            parameterKey: "dailyProductivityInHours",
            options: [],
            value: state.attributes?.dailyProductivityInHours ? state.attributes?.dailyProductivityInHours : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.dailyProductivityInHours,

        },
        {
            name: "lifeExpectancyYears",
            label: "machineAttributes.lifeExpectancyYears",
            type: "text",
            placeholder: "machineAttributes.lifeExpectancyYears",
            required: true,
            parameterKey: "lifeExpectancyYears",
            options: [],
            value: state.attributes?.lifeExpectancyYears ? state.attributes?.lifeExpectancyYears : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.lifeExpectancyYears,
        },
        {
            name: "printLife",
            label: "machineAttributes.printLife",
            type: "text",
            placeholder: "machineAttributes.printLife",
            required: true,
            parameterKey: "printLife",
            options: [],
            value: state.attributes?.printLife ? state.attributes?.printLife : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.printLife,

        },
        {
            name: "minManpowerOperation",
            label: "machineAttributes.minManpowerOperation",
            type: "text",
            placeholder: "machineAttributes.minManpowerOperation",
            required: true,
            parameterKey: "minManpowerOperation",
            options: [],
            value: state.attributes?.minManpowerOperation ? state.attributes?.minManpowerOperation : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.minManpowerOperation,

        },
        {
            name: "resolution",
            label: "machineAttributes.resolution",
            type: "select",
            placeholder: "machineAttributes.resolution",
            required: true,
            parameterKey: "resolution",
            value: state.attributes?.resolution,
            options: [{value: 0, text: '2438 X 2438 dpi'}, {value: 1, text: '2400 X 2400 dpi'}],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "printingSides",
            label: "machineAttributes.printingSides",
            type: "text",
            placeholder: "Sides",
            required: true,
            parameterKey: "printingSides",
            options: [],
            value: state.attributes?.printingSides ? state.attributes?.printingSides : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.printingSides,
        },
    ];
}

export {ofssetPrinting};