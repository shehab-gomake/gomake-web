import {IStep} from "@/widgets/machines/utils/interface/step";
import {
    BasicInputsComponent,
    MediaSettingComponent,
} from "@/widgets/machines/components/forms";
import {MachineDimensionsComponent} from "@/widgets/machines/components/forms/machine-dimensions";
import {SpeedComponent} from "@/widgets/machines/components/forms/speed";
import {OtherSettingsInputsComponent} from "@/widgets/machines/components/forms/other-setting-inputs";
import {ConnectionComponent} from "@/widgets/machines/components/forms/connection-inputs";
import {CNCCutUnitComponent} from "@/widgets/machines/components/forms/cnc-tools/cut-unit";
import {CNCScoringUnitComponent} from "@/widgets/machines/components/forms/cnc-tools/scoring-unit";
import {CNCEngravingUnitComponent} from "@/widgets/machines/components/forms/cnc-tools/engraving-unit";
import {CNCKissCutUnitComponent} from "@/widgets/machines/components/forms/cnc-tools/kiss-cut-unit";
import {CNCVCutUnitComponent} from "@/widgets/machines/components/forms/cnc-tools/v-cut-unit";
import {CNCApplyingGlueUnitComponent} from "@/widgets/machines/components/forms/cnc-tools/applying-glue-unit";
import {
    CNCPropyleneInjectionUnitComponent
} from "@/widgets/machines/components/forms/cnc-tools/propylene-injection-unit";

const flatbedCuttingMachineSteps: IStep[] = [
    {label: 'basic',  component: BasicInputsComponent},
    //{label: 'machineDimensions',  component: MachineDimensionsComponent},
    {label: 'media',  component: MediaSettingComponent},
    {label: 'speed',  component: SpeedComponent},
    {label: 'marks',  component: OtherSettingsInputsComponent},
    {label: 'cutUnit',  component: CNCCutUnitComponent},
    {label: 'scoringUnit',  component: CNCScoringUnitComponent},
    {label: 'engravingUnit',  component: CNCEngravingUnitComponent},
    {label: 'kissCutUnit',  component: CNCKissCutUnitComponent},
    {label: 'VCutUnit',  component: CNCVCutUnitComponent},
    {label: 'applyingGlueUnit',  component: CNCApplyingGlueUnitComponent},
    {label: 'propyleneInjectionUnit',  component: CNCPropyleneInjectionUnitComponent},
    {label: 'connection',  component: ConnectionComponent},
];

export {flatbedCuttingMachineSteps};