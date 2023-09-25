import { atom } from 'recoil';


export const clientTypesCategoriesState = atom<[]>({
    key: 'clientTypesCategoriesState',
    default: [],
});

export const agentsCategoriesState = atom<[]>({
    key: 'agentsCategoriesState',
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