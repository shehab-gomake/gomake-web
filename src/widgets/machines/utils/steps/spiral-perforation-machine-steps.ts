import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";
import {ConnectionComponent} from "@/widgets/machines/components/forms/connection-inputs";


const spiralPerforationMachineSteps = (isAdmin: boolean): IStep[] => isAdmin ? [
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

export {spiralPerforationMachineSteps};