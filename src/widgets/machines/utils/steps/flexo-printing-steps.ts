import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent, ColorsInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {UnwiderRewinderComponent} from "@/widgets/machines/components/forms/unwider-rewinder";
import {MachineCoatingComponent} from "@/widgets/machines/components/forms/coating-inputs";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";

const flexoPrintingMachineSteps: IStep[] = [
    {label: 'basic', component: BasicInputsComponent},
    {label: 'machineDimensions', component: MachineDimensionsComponent},
    {label: 'media', component: MediaSettingComponent},
    {label: 'unWinder', component: UnwiderRewinderComponent},
    {label: 'speed', component: SpeedComponent},
    {label: 'coating', component: MachineCoatingComponent},
    {label: 'colors', component: ColorsInputsComponent},
];

export {flexoPrintingMachineSteps};