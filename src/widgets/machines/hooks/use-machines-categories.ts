import { useRecoilValue } from "recoil";
import { useTranslation } from 'react-i18next';
import { machineCategoriesState } from "@/store/machine-categories";

const useMachinesCategories = () => {
    const { t } = useTranslation();
    const categories = useRecoilValue(machineCategoriesState);
    const categoryList = categories.map(category => ({
        text: t(category.name),
        value: category.id
    }));

    const categoryName = (id: string): string => {
        const category = categories.find(category => category.id === id);
        return category ? t(category.name) : '';
    }

    return {
        categoryList,
        categoryName
    }
}

export { useMachinesCategories }


