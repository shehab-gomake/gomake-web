import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const generalBasicSettings = (state: Record<string, any>) => {
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
            unit: EMeasurementUnits.METER

        },
        {
            name: "machineAttributes",
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
    ];
}

export {generalBasicSettings};