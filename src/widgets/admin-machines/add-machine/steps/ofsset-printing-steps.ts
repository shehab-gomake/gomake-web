import {IStep} from "@/widgets/admin-machines/add-machine/interface/step";
import {
    BasicInputsComponent, ColorsInputsComponent, FeedersStackersComponent,
    MediaSettingComponent,
    SpeedSettingsComponent
} from "@/widgets/admin-machines/add-machine/forms";
import {MachineDimensionsComponent} from "@/widgets/admin-machines/add-machine/forms/machine-dimensions";
import {MachinePlateComponent} from "@/widgets/admin-machines/add-machine/forms/plate-inputs";
import {MachineBlanketCylinderComponent} from "@/widgets/admin-machines/add-machine/forms/blanket-cylinder-inputs";
import {MachineCoatingComponent} from "@/widgets/admin-machines/add-machine/forms/coating-inputs";

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