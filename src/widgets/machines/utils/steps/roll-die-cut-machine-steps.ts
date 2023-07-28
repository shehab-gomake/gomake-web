import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";
import {ConnectionComponent} from "@/widgets/machines/components/forms/connection-inputs";
import {OtherSettingsInputsComponent} from "@/widgets/machines/components/forms/other-setting-inputs";
import {BeatsInputsComponent} from "@/widgets/machines/components/forms/beats-inputs";


const rollDieCutMachineSteps = (isAdmin: boolean): IStep[] => isAdmin ? [
    {label: 'basic', component: BasicInputsComponent},
    {label: 'machineDimensions', component: MachineDimensionsComponent},
    {label: 'media', component: MediaSettingComponent},
    {label: 'basicSpeed', component: SpeedComponent},
    {label: 'core', component: OtherSettingsInputsComponent},
    {label: 'dieCut', component: BeatsInputsComponent},
] :  [
    {label: 'basic', component: BasicInputsComponent},
        {label: 'machineDimensions', component: MachineDimensionsComponent},
        {label: 'media', component: MediaSettingComponent},
        {label: 'basicSpeed', component: SpeedComponent},
        {label: 'core', component: OtherSettingsInputsComponent},
        {label: 'connection', component: ConnectionComponent},
        {label: 'dieCut', component: BeatsInputsComponent},
    ];

export {rollDieCutMachineSteps};