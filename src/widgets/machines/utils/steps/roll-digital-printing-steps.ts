import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent, ColorsInputsComponent, FeedersStackersComponent,
    MediaSettingComponent,
    SpeedSettingsComponent
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {BeatsInputsComponent} from "@/widgets/machines/components/forms/beats-inputs";
import {MachineCoatingComponent} from "@/widgets/machines/components/forms/coating-inputs";

const rollDigitalPrintingSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    {label: 'machineDimensions',  component: MachineDimensionsComponent},
    {label: 'media',  component: MediaSettingComponent},
    {label: 'coating',  component: MachineCoatingComponent},
    {label: 'speed',  component: SpeedSettingsComponent},
    {label: 'feedersStackers',  component: FeedersStackersComponent},
    {label: 'colors',  component: ColorsInputsComponent},
    {label: 'beats',  component: BeatsInputsComponent},
];

export {rollDigitalPrintingSteps};