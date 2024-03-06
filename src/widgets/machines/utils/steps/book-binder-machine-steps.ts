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
import {MachineRunComponent} from "@/widgets/machines/components/forms/run";
import {UnwiderRewinderComponent} from "@/widgets/machines/components/forms/unwider-rewinder";

const bookBinderMachineSteps = (isAdmin: boolean): IStep[] => {
 return isAdmin ?
     [
         {label: 'basic',  component: BasicInputsComponent},
         {label: 'machineDimensions',  component: MachineDimensionsComponent},
         {label: 'media',  component: MediaSettingComponent},
         {label: 'speed',  component: SpeedComponent},
         {label: 'glueSettings',  component: CuttingOptions},
         {label: 'addons',  component: OtherSettingsInputsComponent},
         {label: 'collectionInsideUnit', component: MachineRunComponent},

     ] :
     [
         {label: 'basic',  component: BasicInputsComponent},
         {label: 'machineDimensions',  component: MachineDimensionsComponent},
         {label: 'media',  component: MediaSettingComponent},
         {label: 'speed',  component: SpeedComponent},
         {label: 'connection',  component: ConnectionComponent},
         {label: 'glueSettings',  component: CuttingOptions},
         {label: 'addons',  component: OtherSettingsInputsComponent},
         {label: 'collectionInsideUnit', component: MachineRunComponent},
         {label: 'cuttingUnit', component: UnwiderRewinderComponent},

     ]
}

export {bookBinderMachineSteps};