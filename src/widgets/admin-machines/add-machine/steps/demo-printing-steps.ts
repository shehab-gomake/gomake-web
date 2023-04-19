import {IStep} from "@/widgets/admin-machines/add-machine/interface/step";
import {
    BasicInputsComponent, ColorsInputsComponent, FeedersStackersComponent,
    MediaSettingComponent,
    SpeedSettingsComponent
} from "@/widgets/admin-machines/add-machine/forms";
import {MachineDimensionsComponent} from "@/widgets/admin-machines/add-machine/forms/machine-dimensions";
import {BeatsInputsComponent} from "@/widgets/admin-machines/add-machine/forms/beats-inputs";

const demoMachineSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    {label: 'machineDimensions',  component: MachineDimensionsComponent},
    {label: 'media',  component: MediaSettingComponent},
    {label: 'speed',  component: SpeedSettingsComponent},
];

export {demoMachineSteps};