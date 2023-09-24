import { atom } from 'recoil';

export const clientTypesCategoresState = atom<[]>({
    key: 'clientTypesCategoresState',
    default: [],
});

export const agentsCategoresState = atom({
    key: 'agentsCategoresState',
    default: [],
});

// export const customerForEditState = atom<any>({
//     key: 'customerForEditState',
//     default: {},
// });

// export const customerState = atom<any>({
//     key: 'customerState',
//     default: [],
// });