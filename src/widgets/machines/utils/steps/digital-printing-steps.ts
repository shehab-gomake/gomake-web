import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent, ColorsInputsComponent, FeedersStackersComponent,
    MediaSettingComponent,
    SpeedSettingsComponent
} from "@/widgets/machines/utils/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/utils/forms/machine-dimensions";
import {BeatsInputsComponent} from "@/widgets/machines/utils/forms/beats-inputs";

const printingMachineSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    {label: 'machineDimensions',  component: MachineDimensionsComponent},
    {label: 'media',  component: MediaSettingComponent},
    {label: 'speed',  component: SpeedSettingsComponent},
    {label: 'feedersStackers',  component: FeedersStackersComponent},
    {label: 'colors',  component: ColorsInputsComponent},
    {label: 'beats',  component: BeatsInputsComponent},
];

export {printingMachineSteps};