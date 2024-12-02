import {cutCategories} from "@/widgets/machines/utils/attributes/machine-material-categories/cut-categories";
import {scoringCategories} from "@/widgets/machines/utils/attributes/machine-material-categories/scoring-categories";
import {
    engravingCategories
} from "@/widgets/machines/utils/attributes/machine-material-categories/engraving-categories";
import {kissCutCategories} from "@/widgets/machines/utils/attributes/machine-material-categories/kiss-cut-categories";
import {vCutCategories} from "@/widgets/machines/utils/attributes/machine-material-categories/v-cut-categories";
import {
    applyingGlueCategories
} from "@/widgets/machines/utils/attributes/machine-material-categories/applying-glue-categories";
import {
    propyleneInjectionCategories
} from "@/widgets/machines/utils/attributes/machine-material-categories/propylene-injection-categories";

const cncMachine = (state: Record<string, any>) => {
    return [
        ...cutCategories(state),
        ...scoringCategories(state),
        ...engravingCategories(state),
        ...kissCutCategories(state),
        ...vCutCategories(state),
        ...applyingGlueCategories(state),
        ...propyleneInjectionCategories(state)
    ]
}

export {cncMachine};