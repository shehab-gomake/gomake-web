const widePrinting = (state: Record<string, any>) => {
    return [
        {
            name: "available ",
            label: "machineAttributes.available",
            type: "switch",
            placeholder: "machineAttributes.available",
            required: true,
            parameterKey: "available",
            options: [],
            value: state?.attributes?.available
        },
    ];
}

export {widePrinting};