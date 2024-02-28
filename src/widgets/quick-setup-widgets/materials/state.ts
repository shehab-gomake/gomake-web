import {atom, selector} from "recoil";

export interface IMaterialItem {
    id: string;
    label: string;
    backgroundColor?: string;
    textColor?: string;
    selected: boolean;
}
export const materialsListState = atom<IMaterialItem[]>({
    default: [
        {id: '1', label: 'sheets - Uncoated', selected: false},
        {id: '2', label: 'sheets - Uncoated', selected: false},
        {id: '3', label: 'sheets - Uncoated', selected: false},
        {id: '4', label: 'sheets - Uncoated', selected: false},
        {id: '5', label: 'sheets - Uncoated', selected: false},
        {id: '6', label: 'sheets - Uncoated', selected: false},
        {id: '7', label: 'sheets - Uncoated', selected: false},
        {id: '8', label: 'sheets - Uncoated', selected: false},
        {id: '9', label: 'sheets - Uncoated', selected: false},
        {id: '10', label: 'sheets - Uncoated', selected: false},
        {id: '11', label: 'sheets - Uncoated', selected: false},
        {id: '12', label: 'sheets - Uncoated', selected: false},
        {id: '13', label: 'sheets - Uncoated', selected: false},
        {id: '14', label: 'sheets - Uncoated', selected: false},
        {id: '15', label: 'Flatbed - PVC', selected: false},
        {id: '16', label: 'Flatbed - PVC', selected: false},
        {id: '17', label: 'Flatbed - PVC', selected: false},
        {id: '18', label: 'Flatbed - PVC', selected: false},
        {id: '19', label: 'Flatbed - PVC', selected: false},
        {id: '20', label: 'Flatbed - PVC', selected: false},
    ],
    key: 'materialsListState'
});


export const selectedMaterialsListState = selector<IMaterialItem[]>({
    key: 'selectedMaterialsListState',
    get: ({get}) => {
        const state = get(materialsListState);
        return state.filter(material => material.selected);
    }
})
