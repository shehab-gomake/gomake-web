import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent, ColorsInputsComponent, FeedersStackersComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {BeatsInputsComponent} from "@/widgets/machines/components/forms/beats-inputs";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";

const printingMachineSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    {label: 'machineDimensions',  component: MachineDimensionsComponent},
    {label: 'media',  component: MediaSettingComponent},
    {label: 'speed',  component: SpeedComponent},
    {label: 'feedersStackers',  component: FeedersStackersComponent},
    {label: 'colors',  component: ColorsInputsComponent},
    {label: 'beats',  component: BeatsInputsComponent},
];

export {printingMachineSteps};