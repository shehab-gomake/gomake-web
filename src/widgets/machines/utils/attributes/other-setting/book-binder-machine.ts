const bookBinderMachine = (state: Record<string, any>) => {
    return [
        {
            name: "down",
            label: "machineAttributes.addonsCapital",
            type: "select",
            placeholder: "machineAttributes.addonsCapital",
            required: true,
            parameterKey: "addonsCapital",
            value: state.attributes?.addonsCapital,
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "addonsBookmark",
            label: "machineAttributes.addonsBookmark",
            type: "select",
            placeholder: "machineAttributes.addonsBookmark",
            required: true,
            parameterKey: "addonsBookmark",
            value: state.attributes?.addonsBookmark,
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true,
        },


    ];
}

export {bookBinderMachine};