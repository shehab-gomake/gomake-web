const basicInputs = (state: Record<string, any>) => {
    return [
        {
            name: "manufacturer",
            label: "adminAddMachine.manufacturer",
            type: "text",
            placeholder: "Manufacturer",
            required: true,
            key: "manufacturer",
            options: []
        },
        {
            name: "model",
            label: "adminAddMachine.model",
            type: "text",
            placeholder: "Model",
            required: true,
            key: "model",
            options: []
        },
        {
            name: "code",
            label: "adminAddMachine.code",
            type: "text",
            placeholder: "Code",
            required: true,
            key: "code",
            options: []
        },
        {
            name: "nickName",
            label: "adminAddMachine.nickName",
            type: "text",
            placeholder: "Nick name",
            required: true,
            key: "nickName",
            options: []
        },
        {
            name: "price",
            label: "adminAddMachine.price",
            type: "text",
            placeholder: "Price",
            required: true,
            key: "price",
            options: []
        },
        {
            name: "currency",
            label: "adminAddMachine.currency",
            type: "select",
            placeholder: "Currency",
            required: true,
            key: "currency",
            value: state["currency"],
            options: [{value: 1, text: 'adminAddMachine.dollar'}, {value: 2, text: 'adminAddMachine.euro'}]
        },
        {
            name: "monthlyMaintenanceCost",
            label: "adminAddMachine.monthlyMaintenanceCost",
            type: "text",
            placeholder: "Monthly maintenance cost",
            required: true,
            key: "monthlyMaintenanceCost",
            options: []
        },
        {
            name: "electricityCostPerWorkingHour",
            label: "adminAddMachine.electricityCostPerWorkingHour",
            type: "text",
            placeholder: "Electricity costPer working hour",
            required: true,
            key: "electricityCostPerWorkingHour",
            options: []
        },
        {
            name: "monthlyCostOfSpace",
            label: "adminAddMachine.monthlyCostOfSpace",
            type: "text",
            placeholder: "Monthly cost of space",
            required: true,
            key: "monthlyCostOfSpace",
            options: []
        },
        {
            name: "dailyProductivityInHours",
            label: "adminAddMachine.dailyProductivityInHours",
            type: "text",
            placeholder: "Daily productivity in hours",
            required: true,
            key: "dailyProductivityInHours",
            options: []
        },
        {
            name: "lifeExpectancyYears",
            label: "adminAddMachine.lifeExpectancyYears",
            type: "text",
            placeholder: "Life expectancy years",
            required: true,
            key: "lifeExpectancyYears",
            options: []
        },
        {
            name: "printLife",
            label: "adminAddMachine.printLife",
            type: "text",
            placeholder: "Print life",
            required: true,
            key: "printLife",
            options: []
        },
        {
            name: "minManpowerOperation",
            label: "adminAddMachine.minManpowerOperation",
            type: "text",
            placeholder: "Print life",
            required: true,
            key: "minManpowerOperation",
            options: []
        },
        {
            name: "resolution",
            label: "adminAddMachine.resolution",
            type: "select",
            placeholder: "Resolution",
            required: true,
            key: "resolution",
            value: state["resolution"],
            options: [{value: 1, text: '2438 X 2438 dpi'}, {value: 2, text: '2400 X 2400 dpi'}]
        },
        {
            name: "printingSides",
            label: "adminAddMachine.printingSides",
            type: "text",
            placeholder: "Sides",
            required: true,
            key: "printingSides",
            options: []
        },
        {
            name: "doubleHead",
            label: "adminAddMachine.doubleHead",
            type: "select",
            placeholder: "Insert Option",
            required: true,
            key: "doubleHead",
            value: state["doubleHead"],
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}]
        },
    ];
}

export {basicInputs};