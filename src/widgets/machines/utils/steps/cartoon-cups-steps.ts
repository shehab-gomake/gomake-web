import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";
import {OtherSettingsInputsComponent} from "@/widgets/machines/components/forms/other-setting-inputs";

const cartoonCupsSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    //{label: 'machineDimensions',  component: MachineDimensionsComponent},
    {label: 'speed',  component: SpeedComponent},
    {label: 'cupsSize',  component: OtherSettingsInputsComponent},
];

export {cartoonCupsSteps};