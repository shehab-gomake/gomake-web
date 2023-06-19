import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {MachineRunComponent} from "@/widgets/machines/components/forms/run";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";

const foldingGluingMachineSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    {label: 'machineDimensions',  component: MachineDimensionsComponent},
    {label: 'media',  component: MediaSettingComponent},
    {label: 'foldingGluing',  component: MachineRunComponent},
    {label: 'speed',  component: SpeedComponent},
];

export {foldingGluingMachineSteps};