import {useRecoilValue} from "recoil";
import {machineCategoriesState} from "@/store/machine-categories";

const useMachinesCategories = () => {
    const categories = useRecoilValue(machineCategoriesState);
    const categoryList = categories.map(category => ({text: category.name, value: category.id}));
    const categoryName = (id: string): string => {
        return categories.find(category => category.id === id)?.name
    }


    return {
        categoryList,
        categoryName
    }
}

export {useMachinesCategories}