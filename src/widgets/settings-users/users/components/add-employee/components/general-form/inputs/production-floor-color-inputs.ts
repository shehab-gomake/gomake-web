import {Employee, } from "@/widgets/settings-users/users/interface/employee";
import {EmployeeActions} from "@/widgets/settings-users/users/enums/employee-actions";


const productionFloorColorInputs = (state: Employee)  => {
    return [
        {
            name: "productionFloorColor",
            label: "machineAttributes.productionFloorColor",
            type: "color",
            placeholder: "machineAttributes.productionFloorColor",
            required: false,
            parameterKey: "productionFloorColor",
            options: [],
            value: state?.productionFloorColor ? state?.productionFloorColor : '',
            machineInputType: 'input',
            isValid: !!state?.productionFloorColor,
        },
    ];
}

export {productionFloorColorInputs};