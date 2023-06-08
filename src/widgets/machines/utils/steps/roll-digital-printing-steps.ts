import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent, ColorsInputsComponent,
    MediaSettingComponent,
    SpeedOptionsSettingsComponent
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {BeatsInputsComponent} from "@/widgets/machines/components/forms/beats-inputs";
import {MachineCoatingComponent} from "@/widgets/machines/components/forms/coating-inputs";
import {UnwiderRewinderComponent} from "@/widgets/machines/components/forms/unwider-rewinder";

const rollDigitalPrintingSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    {label: 'machineDimensions',  component: MachineDimensionsComponent},
    {label: 'media',  component: MediaSettingComponent},
    {label: 'unWinder',  component: UnwiderRewinderComponent},
    {label: 'coating',  component: MachineCoatingComponent},
    {label: 'speed',  component: SpeedOptionsSettingsComponent},
    {label: 'colors',  component: ColorsInputsComponent},
    {label: 'beats',  component: BeatsInputsComponent},
];

export {rollDigitalPrintingSteps};