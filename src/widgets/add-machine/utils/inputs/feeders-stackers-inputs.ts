const feedersStackersInputs = (state: Record<string, any>) => {
    return [
        {
            name: "feederHeight",
            label: "adminAddMachine.feederHeight",
            type: "text",
            placeholder: "Height",
            required: true,
            key: "feederHeight",
            options: []
        },
        {
            name: "feederNumber",
            label: "adminAddMachine.feederNumber",
            type: "text",
            placeholder: "Number",
            required: true,
            key: "feederNumber",
            options: []
        },
        {
            name: "feederLength",
            label: "adminAddMachine.feederLength",
            type: "text",
            placeholder: "Length",
            required: true,
            key: "feederLength",
            options: []
        },
        {
            name: "feederWidth",
            label: "adminAddMachine.feederWidth",
            type: "text",
            placeholder: "Width",
            required: true,
            key: "feederWidth",
            options: []
        },

        {
            name: "stackerNumber",
            label: "adminAddMachine.stackerNumber",
            type: "text",
            placeholder: "Number",
            required: true,
            key: "stackerNumber",
            options: []
        },
        {
            name: "stackerHeight",
            label: "adminAddMachine.stackerHeight",
            type: "text",
            placeholder: "Number",
            required: true,
            key: "stackerHeight",
            options: []
        },
        {
            name: "stackerLength",
            label: "adminAddMachine.stackerLength",
            type: "text",
            placeholder: "Length",
            required: true,
            key: "stackerLength",
            options: []
        },
        {
            name: "stackerWidth",
            label: "adminAddMachine.stackerWidth",
            type: "text",
            placeholder: "Width",
            required: true,
            key: "stackerWidth",
            options: []
        },
        {
            name: "insertOption",
            label: "adminAddMachine.insertOption",
            type: "select",
            placeholder: "Insert Option",
            required: true,
            key: "insertOption",
            value: state["insertOption"],
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}]
        },
    ]
};

export {feedersStackersInputs};