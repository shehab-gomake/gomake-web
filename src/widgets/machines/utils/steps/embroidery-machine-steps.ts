import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";

const embroideryMachineSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    //{label: 'machineDimensions',  component: MachineDimensionsComponent},
    {label: 'mediaSpeed',  component: SpeedComponent},
];

export {embroideryMachineSteps};