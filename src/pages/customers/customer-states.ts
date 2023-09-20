import { atom } from 'recoil';

export const clientTypesCategoresState = atom<[]>({
    key: 'clientTypesCategoresState',
    default: [],
});

export const agentsCategoresState = atom({
    key: 'agentsCategoresState',
    default: [],
});
