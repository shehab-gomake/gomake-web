import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {MachineRunComponent} from "@/widgets/machines/components/forms/run";
import {ConnectionComponent} from "@/widgets/machines/components/forms/connection-inputs";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";

const foldingMachineSteps = (isAdmin: boolean): IStep[] => {
    return isAdmin ? [
            {label: 'basic', component: BasicInputsComponent},
            {label: 'machineDimensions', component: MachineDimensionsComponent},
            {label: 'media', component: MediaSettingComponent},
            {label: 'folding', component: MachineRunComponent},
            {label: 'speed', component: SpeedComponent},
        ] :
        [
            {label: 'basic', component: BasicInputsComponent},
            {label: 'machineDimensions', component: MachineDimensionsComponent},
            {label: 'media', component: MediaSettingComponent},
            {label: 'folding', component: MachineRunComponent},
            {label: 'connection', component: ConnectionComponent},
            {label: 'speed', component: SpeedComponent},
        ];
}

export {foldingMachineSteps};