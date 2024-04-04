import {useRecoilValue} from "recoil";
import {tagsState} from "@/widgets/production-floor/state/tags";
import {IInput} from "@/components/form-inputs/interfaces";
import {useTranslation} from "react-i18next";
import {productionFloorFiltersState} from "@/widgets/production-floor/state/production-floor-filters";

const filtersInputs = () => {
    const tags = useRecoilValue(tagsState);
    const {t} = useTranslation();
    const filters = useRecoilValue(productionFloorFiltersState);
    const tagsInput = {
        label: '',
        placeholder: t('productionFloor.tags'),
        type: 'select',
        multiple: true,
        values: filters.automatedTags,
        options: tags.map(tag =>({text: tag, value: tag})),
        name: '',
        required: false,
        parameterKey: 'tags',
        isValid: true
    } as IInput
    return {
        tagsInput
    }
};

export {filtersInputs}