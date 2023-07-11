import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent, ColorsInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";
import {ConnectionComponent} from "@/widgets/machines/components/forms/connection-inputs";
import {OtherSettingsInputsComponent} from "@/widgets/machines/components/forms/other-setting-inputs";
import {BeatsInputsComponent} from "@/widgets/machines/components/forms/beats-inputs";


const rollAnalogEnhancementMachineSteps = (isAdmin: boolean): IStep[] => isAdmin ? [
    {label: 'basic', component: BasicInputsComponent},
    {label: 'machineDimensions', component: MachineDimensionsComponent},
    {label: 'media', component: MediaSettingComponent},
    {label: 'foil', component: ColorsInputsComponent},
    {label: 'embossing', component: OtherSettingsInputsComponent},
    {label: 'paintCost', component: BeatsInputsComponent},
    {label: 'basicSpeed', component: SpeedComponent},
] : [
    {label: 'basic', component: BasicInputsComponent},
    {label: 'machineDimensions', component: MachineDimensionsComponent},
    {label: 'media', component: MediaSettingComponent},
    {label: 'foil', component: ColorsInputsComponent},
    {label: 'embossing', component: OtherSettingsInputsComponent},
    {label: 'paintCost', component: BeatsInputsComponent},
    {label: 'basicSpeed', component: SpeedComponent},
    {label: 'connection', component: ConnectionComponent},
];

export {rollAnalogEnhancementMachineSteps};