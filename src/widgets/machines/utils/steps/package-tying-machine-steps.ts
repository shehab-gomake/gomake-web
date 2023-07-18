import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";
import {BeatsInputsComponent} from "@/widgets/machines/components/forms/beats-inputs";


const packageTyingMachineSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    {label: 'machineDimensions',  component: MachineDimensionsComponent},
    {label: 'packageSettings',  component: MediaSettingComponent},
    {label: 'peedCell',  component: SpeedComponent},
    {label: 'cost',  component: BeatsInputsComponent},
];

export {packageTyingMachineSteps};