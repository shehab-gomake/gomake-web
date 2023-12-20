import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";
import {ConnectionComponent} from "@/widgets/machines/components/forms/connection-inputs";
import {MachineRunComponent} from "@/widgets/machines/components/forms/run";
import {OtherSettingsInputsComponent} from "@/widgets/machines/components/forms/other-setting-inputs";


const bookSewingMachineSteps = (isAdmin: boolean): IStep[] => {
    return isAdmin ?
        [
            {label: 'basic',  component: BasicInputsComponent},
            {label: 'machineDimensions',  component: MachineDimensionsComponent},
            {label: 'media',  component: MediaSettingComponent},
            {label: 'speed',  component: SpeedComponent},
            {label: 'collectionInsideUnit', component: MachineRunComponent},
            {label: 'foldingUnit', component: OtherSettingsInputsComponent},
        ] :
        [
            {label: 'basic',  component: BasicInputsComponent},
            {label: 'machineDimensions',  component: MachineDimensionsComponent},
            {label: 'media',  component: MediaSettingComponent},
            {label: 'speed',  component: SpeedComponent},
            {label: 'connection',  component: ConnectionComponent},
            {label: 'collectionInsideUnit', component: MachineRunComponent},
            {label: 'foldingUnit', component: OtherSettingsInputsComponent},
        ]
}

export {bookSewingMachineSteps};