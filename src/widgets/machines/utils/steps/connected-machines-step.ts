import {IStep} from "@/widgets/machines/utils/interface/step";
import {ConnectedMachinesStep} from "@/widgets/machines/components/forms/connected-machines/connected-machines";

const connectedMachinesStep: IStep[] = [
    {label: 'connectionIntegration', component: ConnectedMachinesStep},
];

export {connectedMachinesStep};