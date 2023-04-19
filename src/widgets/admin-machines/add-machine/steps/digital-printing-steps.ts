import {IStep} from "@/widgets/admin-machines/add-machine/interface/step";
import {
    BasicInputsComponent, ColorsInputsComponent, FeedersStackersComponent,
    MediaSettingComponent,
    SpeedSettingsComponent
} from "@/widgets/admin-machines/add-machine/forms";
import {MachineDimensionsComponent} from "@/widgets/admin-machines/add-machine/forms/machine-dimensions";
import {BeatsInputsComponent} from "@/widgets/admin-machines/add-machine/forms/beats-inputs";

const printingMachineSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    {label: 'machineDimensions',  component: MachineDimensionsComponent},
    {label: 'media',  component: MediaSettingComponent},
    {label: 'speed',  component: SpeedSettingsComponent},
    {label: 'feeders and stackers',  component: FeedersStackersComponent},
    {label: 'colors',  component: ColorsInputsComponent},
    {label: 'beats',  component: BeatsInputsComponent},
];

export {printingMachineSteps};