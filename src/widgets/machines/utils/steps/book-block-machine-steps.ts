import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";
import {ConnectionComponent} from "@/widgets/machines/components/forms/connection-inputs";
import {OtherSettingsInputsComponent} from "@/widgets/machines/components/forms/other-setting-inputs";
import {CuttingOptions} from "@/widgets/machines/components/forms/cutting-options";
import {LaserUnitComponent} from "@/widgets/machines/components/forms/roll-finish-units/laser-cut";
import {LaminationUnitComponent} from "@/widgets/machines/components/forms/roll-finish-units/lamination";
import {VarnishUnitComponent} from "@/widgets/machines/components/forms/roll-finish-units/varnish";
import {FoilUnitComponent} from "@/widgets/machines/components/forms/roll-finish-units/foil";
import {EmbossingUnitComponent} from "@/widgets/machines/components/forms/roll-finish-units/embossing-selective";


const bookBlockMachineSteps = (isAdmin: boolean): IStep[] => isAdmin ? [
        {label: 'basic', component: BasicInputsComponent},
        //{label: 'machineDimensions', component: MachineDimensionsComponent},
        {label: 'media', component: MediaSettingComponent},
        {label: 'basicSpeed', component: SpeedComponent},
    ] :
    [
        {label: 'basic', component: BasicInputsComponent},
        //{label: 'machineDimensions', component: MachineDimensionsComponent},
        {label: 'media', component: MediaSettingComponent},
        {label: 'basicSpeed', component: SpeedComponent},

    ];

export {bookBlockMachineSteps};