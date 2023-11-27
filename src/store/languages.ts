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
            text: "English"
        },
        {
            value: "he",
            text: "עברית"
        },
        {
            value: "ar",
            text: "العربية"
        },
        {
            value: "de",
            text: "Deutsch"
        }
    ]
})