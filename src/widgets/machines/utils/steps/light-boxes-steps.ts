import {IStep} from "@/widgets/machines/utils/interface/step";
import {BasicInputsComponent, MediaSettingComponent} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";
import {OtherSettingsInputsComponent} from "@/widgets/machines/components/forms/other-setting-inputs";
import {MachineRunComponent} from "@/widgets/machines/components/forms/run";

const lightBoxesSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    {label: 'led',  component: MachineDimensionsComponent},
    {label: 'sidesInstall',  component: MediaSettingComponent},
    {label: 'background',  component: OtherSettingsInputsComponent},
    {label: 'flatbed',  component: MachineRunComponent},
];

export {lightBoxesSteps};