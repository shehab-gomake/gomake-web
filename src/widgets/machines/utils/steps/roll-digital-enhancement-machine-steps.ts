import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent, ColorsInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";
import {ConnectionComponent} from "@/widgets/machines/components/forms/connection-inputs";


const rollDigitalEnhancementMachineSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    {label: 'machineDimensions',  component: MachineDimensionsComponent},
    {label: 'blockDimensions',  component: MediaSettingComponent},
    {label: 'foil',  component: ColorsInputsComponent},
    {label: 'basicSpeed',  component: SpeedComponent},
    {label: 'connection',  component: ConnectionComponent},
];

export {rollDigitalEnhancementMachineSteps};