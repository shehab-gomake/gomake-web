import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";
import {ConnectionComponent} from "@/widgets/machines/components/forms/connection-inputs";
import {CuttingOptions} from "@/widgets/machines/components/forms/cutting-options";
import {OtherSettingsInputsComponent} from "@/widgets/machines/components/forms/other-setting-inputs";

const bookBinderMachineSteps = (isAdmin: boolean): IStep[] => {
 return isAdmin ?
     [
         {label: 'basic',  component: BasicInputsComponent},
         {label: 'machineDimensions',  component: MachineDimensionsComponent},
         {label: 'bookSettings',  component: MediaSettingComponent},
         {label: 'speed',  component: SpeedComponent},
         {label: 'glueSettings',  component: CuttingOptions},
         {label: 'addons',  component: OtherSettingsInputsComponent},
     ] :
     [
         {label: 'basic',  component: BasicInputsComponent},
         {label: 'machineDimensions',  component: MachineDimensionsComponent},
         {label: 'bookSettings',  component: MediaSettingComponent},
         {label: 'speed',  component: SpeedComponent},
         {label: 'connection',  component: ConnectionComponent},
         {label: 'glueSettings',  component: CuttingOptions},
         {label: 'addons',  component: OtherSettingsInputsComponent},
     ]
}

export {bookBinderMachineSteps};