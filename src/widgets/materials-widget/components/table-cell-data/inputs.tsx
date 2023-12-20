const multiSelectInput = (state , machinesCategories , value)  => {
    return [
        {
            name: "machines",
            type: "select",
            placeholder: "Select machines",
            required: false,
            parameterKey: "machines",
            options: machinesCategories.map(machine => ({
                value: machine.id,
                text: `${machine.manufacturer} - ${machine.model}`
            })),
            value: state?.machines,
            values: state?.machines || value ,
            isValid: true,
            multiple: true,
        }
        
    ];
}

export { multiSelectInput };