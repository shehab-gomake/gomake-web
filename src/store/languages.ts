import {atom, selector} from "recoil";
import {useGomakeAxios} from "@/hooks";

// const languagesSelector = selector({
//     key: 'mySelector',
//     get: async ({get}) => {
//         const {callApi} = useGomakeAxios();
//         const res = await callApi('Get', '/v1/enum/get-enums/languages')
//         return res?.data?.data?.data
//     }
// })

export const languagesState = atom({
    key: 'languagesState',
    default: [
        {
            value: "en",
            text: "English",
            supported: true,
        },
        {
            value: "he",
            text: "עברית",
            supported: true,
        },
        {
            value: "ar",
            text: "العربية",
            supported: true,
        },
        {
            value: "de",
            text: "Deutsch",
            supported: true,
        },
        {
            value: "fr",
            text: "French",
            supported: false,
        }
    ]
});

export const languageOptionsState = selector({
    key: 'languageOptionsState',
    get: ({get}) => {
        const state = get(languagesState);
        return state?.map(language => ({...language, label: language.text}))
    }
})