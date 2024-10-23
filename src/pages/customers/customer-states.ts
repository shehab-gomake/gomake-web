import { atom } from 'recoil';

export const clientTypesCategoriesState = atom<any>({
    key: 'clientTypesCategoriesState',
    default: [],
});

export const agentsCategoriesState = atom<[]>({
    key: 'agentsCategoriesState',
    default: [],
});


export const isSelectedCLoseAsDeleveryNoteState = atom<boolean>({
    key: 'isSelectedCLoseAsDeleveryNoteState',
    default: false,
});