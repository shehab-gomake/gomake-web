import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {ConnectionComponent} from "@/widgets/machines/components/forms/connection-inputs";
import {OtherSettingsInputsComponent} from "@/widgets/machines/components/forms/other-setting-inputs";
import {CollectorMachineSpeed} from "@/widgets/machines/components/forms/collector-machine-speed";

const collectorMachineSteps = (isAdmin: boolean): IStep[] => {
    return isAdmin ?
        [
            {label: 'basic', component: BasicInputsComponent},
            {label: 'machineDimensions', component: MachineDimensionsComponent},
            {label: 'media', component: MediaSettingComponent},
            {label: 'speed', component: CollectorMachineSpeed},
            {label: 'foldingUnit', component: OtherSettingsInputsComponent},
        ] :
        [
            {label: 'basic', component: BasicInputsComponent},
            {label: 'machineDimensions', component: MachineDimensionsComponent},
            {label: 'media', component: MediaSettingComponent},
            {label: 'speed', component: CollectorMachineSpeed},
            {label: 'connection', component: ConnectionComponent},
            {label: 'foldingUnit', component: OtherSettingsInputsComponent},
        ];
}

export {collectorMachineSteps};