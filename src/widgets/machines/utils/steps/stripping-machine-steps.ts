import { IStep } from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import { SpeedComponent } from "@/widgets/machines/components/forms/speed";

const strippingMachineSteps: IStep[] = [
    { label: "basic", component: BasicInputsComponent },
    { label: "media", component: MediaSettingComponent },
    { label: "speed", component: SpeedComponent },
];

export { strippingMachineSteps };

