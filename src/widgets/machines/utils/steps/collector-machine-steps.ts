import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {ConnectionComponent} from "@/widgets/machines/components/forms/connection-inputs";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";

const collectorMachineSteps = (isAdmin: boolean): IStep[] => {
    return isAdmin ?
        [
            {label: 'basic', component: BasicInputsComponent},
            {label: 'machineDimensions', component: MachineDimensionsComponent},
            {label: 'media', component: MediaSettingComponent},
            {label: 'speed', component: SpeedComponent},
        ] :
        [
            {label: 'basic', component: BasicInputsComponent},
            {label: 'machineDimensions', component: MachineDimensionsComponent},
            {label: 'media', component: MediaSettingComponent},
            {label: 'speed', component: SpeedComponent},
            {label: 'connection', component: ConnectionComponent},
        ];
}

export {collectorMachineSteps};