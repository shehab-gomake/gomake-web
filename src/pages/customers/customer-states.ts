import { atom } from 'recoil';

export const clientTypesCategoriesState = atom<[]>({
    key: 'clientTypesCategoriesState',
    default: [],
});

export const agentsCategoriesState = atom<[]>({
    key: 'agentsCategoriesState',
    default: [],
});