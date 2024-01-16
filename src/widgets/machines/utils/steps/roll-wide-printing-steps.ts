import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent, ColorsInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";
import {OtherSettingsInputsComponent} from "@/widgets/machines/components/forms/other-setting-inputs";

const rollWidePrintingMachineSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    {label: 'machineDimensions',  component: MachineDimensionsComponent},
    {label: 'media',  component: MediaSettingComponent},
    {label: 'speed',  component: SpeedComponent},
    {label: 'colors',  component: ColorsInputsComponent},
    {label: 'kiss cut unit',  component: OtherSettingsInputsComponent},
];

export {rollWidePrintingMachineSteps};