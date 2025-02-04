import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";
import {ConnectionComponent} from "@/widgets/machines/components/forms/connection-inputs";
import {OtherSettingsInputsComponent} from "@/widgets/machines/components/forms/other-setting-inputs";


const rollLaminationMachineSteps = (isAdmin: boolean): IStep[] => isAdmin ? [
        {label: 'basic', component: BasicInputsComponent},
        {label: 'machineDimensions', component: MachineDimensionsComponent},
        {label: 'media', component: MediaSettingComponent},
        {label: 'basicSpeed', component: SpeedComponent},
        {label: 'laminationSettings', component: OtherSettingsInputsComponent},
    ] :
    [
        {label: 'basic', component: BasicInputsComponent},
        {label: 'machineDimensions', component: MachineDimensionsComponent},
        {label: 'media', component: MediaSettingComponent},
        {label: 'basicSpeed', component: SpeedComponent},
        {label: 'laminationSettings', component: OtherSettingsInputsComponent},
        {label: 'connection', component: ConnectionComponent},
    ];

export {rollLaminationMachineSteps};