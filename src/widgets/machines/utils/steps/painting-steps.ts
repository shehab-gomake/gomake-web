import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent,
} from "@/widgets/machines/components/forms";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";

const paintingSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    {label: 'speed',  component: SpeedComponent},
];

export {paintingSteps};