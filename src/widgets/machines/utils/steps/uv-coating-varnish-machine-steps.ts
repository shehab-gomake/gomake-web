import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent, FeedersStackersComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {MachinePlateComponent} from "@/widgets/machines/components/forms/plate-inputs";
import {MachineBlanketCylinderComponent} from "@/widgets/machines/components/forms/blanket-cylinder-inputs";
import {MachineCoatingComponent} from "@/widgets/machines/components/forms/coating-inputs";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";
import {PrintingColors} from "@/widgets/machines/components/forms/printing-colors";

const uvCoatingVarnishMachineSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    //{label: 'machineDimensions',  component: MachineDimensionsComponent},
    {label: 'media',  component: MediaSettingComponent},
    {label: 'speed',  component: SpeedComponent}
];

export {uvCoatingVarnishMachineSteps};