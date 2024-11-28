
const laminationMachine = (state: Record<string, any>) => {
    return [
        {
            name: "",
            label: "machineAttributes.available",
            type: "switch",
            placeholder: "machineAttributes.available",
            required: true,
            parameterKey: "isAvailableFoilUnit",
            options: [],
            value: state?.attributes?.isAvailableFoilUnit
        }
    ]
}

export {laminationMachine};