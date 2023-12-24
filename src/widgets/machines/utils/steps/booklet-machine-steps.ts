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
import {StapleInputsComponent} from "@/widgets/machines/components/forms/staple-inputs";

import {BookletCollectorUnit} from "@/widgets/machines/components/forms/booklet-collector-unit";

const bookletMachineSteps = (isAdmin: boolean): IStep[] => {
    return isAdmin ?
        [
            {label: 'basic', component: BasicInputsComponent},
            {label: 'machineDimensions', component: MachineDimensionsComponent},
            {label: 'bookletSettings', component: MediaSettingComponent},
            {label: 'speed', component: SpeedComponent},
            {label: 'cuttingOptions', component: CuttingOptions},
            {label: 'staple', component: StapleInputsComponent},
            {label: 'collectionInsideUnit', component: BookletCollectorUnit},
            {label: 'foldingUnit', component: OtherSettingsInputsComponent},

        ] :
        [
            {label: 'basic', component: BasicInputsComponent},
            {label: 'machineDimensions', component: MachineDimensionsComponent},
            {label: 'bookletSettings', component: MediaSettingComponent},
            {label: 'speed', component: SpeedComponent},
            {label: 'connection', component: ConnectionComponent},
            {label: 'cuttingOptions', component: CuttingOptions},
            {label: 'staple', component: StapleInputsComponent},
            {label: 'collectionInsideUnit', component: BookletCollectorUnit},
            {label: 'foldingUnit', component: OtherSettingsInputsComponent},

        ];
}

export {bookletMachineSteps};