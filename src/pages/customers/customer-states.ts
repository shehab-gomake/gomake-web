import { atom } from 'recoil';

export const clientTypesCategoriesState = atom<any>({
    key: 'clientTypesCategoriesState',
    default: [],
});

export const agentsCategoriesState = atom<[]>({
    key: 'agentsCategoriesState',
    default: [],
});