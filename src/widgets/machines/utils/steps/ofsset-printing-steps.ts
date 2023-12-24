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

const ofssetPrintingSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    {label: 'machineDimensions',  component: MachineDimensionsComponent},
    {label: 'media',  component: MediaSettingComponent},
    {label: 'plate',  component: MachinePlateComponent},
    {label: 'BlanketCylinder',  component: MachineBlanketCylinderComponent},
    {label: 'speed',  component: SpeedComponent},
    {label: 'feedersStackers',  component: FeedersStackersComponent},
    {label: 'colors',  component: PrintingColors},
    {label: 'moreSettings',  component: MachineCoatingComponent},
];

export {ofssetPrintingSteps};