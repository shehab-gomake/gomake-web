import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent, ColorsInputsComponent, FeedersStackersComponent,
    MediaSettingComponent,
    SpeedSettingsComponent
} from "@/widgets/machines/utils/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/utils/forms/machine-dimensions";
import {MachinePlateComponent} from "@/widgets/machines/utils/forms/plate-inputs";
import {MachineBlanketCylinderComponent} from "@/widgets/machines/utils/forms/blanket-cylinder-inputs";
import {MachineCoatingComponent} from "@/widgets/machines/utils/forms/coating-inputs";

const ofssetPrintingSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    {label: 'machineDimensions',  component: MachineDimensionsComponent},
    {label: 'media',  component: MediaSettingComponent},
    {label: 'plate',  component: MachinePlateComponent},
    {label: 'BlanketCylinder',  component: MachineBlanketCylinderComponent},
    {label: 'speed',  component: SpeedSettingsComponent},
    {label: 'feedersStackers',  component: FeedersStackersComponent},
    {label: 'colors',  component: ColorsInputsComponent},
    {label: 'coating',  component: MachineCoatingComponent},
];

export {ofssetPrintingSteps};