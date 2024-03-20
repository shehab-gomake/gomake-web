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
            "value": "fr",
            "text": "français",
            "supported": false
        },
        {
            "value": "it",
            "text": "Italiano",
            "supported": false
        },
        {
            "value": "el",
            "text": "Ελληνικά",
            "supported": false
        },
        {
            "value": "ru",
            "text": "русский язык",
            "supported": false
        },
        {
            "value": "ab",
            "text": "аҧсуа",
            "supported": false
        },
        {
            "value": "aa",
            "text": "Afaraf",
            "supported": false
        },
        {
            "value": "af",
            "text": "Afrikaans",
            "supported": false
        },
        {
            "value": "ak",
            "text": "Akan",
            "supported": false
        },
        {
            "value": "sq",
            "text": "Shqip",
            "supported": false
        },
        {
            "value": "am",
            "text": "አማርኛ",
            "supported": false
        },
        {
            "value": "an",
            "text": "Aragonés",
            "supported": false
        },
        {
            "value": "hy",
            "text": "Հայերեն",
            "supported": false
        },
        {
            "value": "as",
            "text": "অসমীয়া",
            "supported": false
        },
        {
            "value": "av",
            "text": "авар мацӀ, магӀарул мацӀ",
            "supported": false
        },
        {
            "value": "ae",
            "text": "avesta",
            "supported": false
        },
        {
            "value": "ay",
            "text": "aymar aru",
            "supported": false
        },
        {
            "value": "az",
            "text": "azərbaycan dili",
            "supported": false
        },
        {
            "value": "bm",
            "text": "bamanankan",
            "supported": false
        },
        {
            "value": "ba",
            "text": "башҡорт теле",
            "supported": false
        },
        {
            "value": "eu",
            "text": "euskara, euskera",
            "supported": false
        },
        {
            "value": "be",
            "text": "Беларуская",
            "supported": false
        },
        {
            "value": "bn",
            "text": "বাংলা",
            "supported": false
        },
        {
            "value": "bh",
            "text": "भोजपुरी",
            "supported": false
        },
        {
            "value": "bi",
            "text": "Bislama",
            "supported": false
        },
        {
            "value": "bs",
            "text": "bosanski jezik",
            "supported": false
        },
        {
            "value": "br",
            "text": "brezhoneg",
            "supported": false
        },
        {
            "value": "bg",
            "text": "български език",
            "supported": false
        },
        {
            "value": "my",
            "text": "ဗမာစာ",
            "supported": false
        },
        {
            "value": "ca",
            "text": "Català",
            "supported": false
        },
        {
            "value": "ch",
            "text": "Chamoru",
            "supported": false
        },
        {
            "value": "ce",
            "text": "нохчийн мотт",
            "supported": false
        },
        {
            "value": "ny",
            "text": "chiCheŵa, chinyanja",
            "supported": false
        },
        {
            "value": "zh",
            "text": "中文 (Zhōngwén), 汉语, 漢語",
            "supported": false
        },
        {
            "value": "cv",
            "text": "чӑваш чӗлхи",
            "supported": false
        },
        {
            "value": "kw",
            "text": "Kernewek",
            "supported": false
        },
        {
            "value": "co",
            "text": "corsu, lingua corsa",
            "supported": false
        },
        {
            "value": "cr",
            "text": "ᓀᐦᐃᔭᐍᐏᐣ",
            "supported": false
        },
        {
            "value": "hr",
            "text": "hrvatski",
            "supported": false
        },
        {
            "value": "cs",
            "text": "česky, čeština",
            "supported": false
        },
        {
            "value": "da",
            "text": "dansk",
            "supported": false
        },
        {
            "value": "dv",
            "text": "ދިވެހި",
            "supported": false
        },
        {
            "value": "nl",
            "text": "Nederlands, Vlaams",
            "supported": false
        },
        {
            "value": "eo",
            "text": "Esperanto",
            "supported": false
        },
        {
            "value": "et",
            "text": "eesti, eesti keel",
            "supported": false
        },
        {
            "value": "ee",
            "text": "Eʋegbe",
            "supported": false
        },
        {
            "value": "fo",
            "text": "føroyskt",
            "supported": false
        },
        {
            "value": "fj",
            "text": "vosa Vakaviti",
            "supported": false
        },
        {
            "value": "fi",
            "text": "suomi, suomen kieli",
            "supported": false
        },
        
        {
            "value": "ff",
            "text": "Fulfulde, Pulaar, Pular",
            "supported": false
        },
        {
            "value": "gl",
            "text": "Galego",
            "supported": false
        },
        {
            "value": "ka",
            "text": "ქართული",
            "supported": false
        },
        {
            "value": "gn",
            "text": "Avañeẽ",
            "supported": false
        },
        {
            "value": "gu",
            "text": "ગુજરાતી",
            "supported": false
        },
        {
            "value": "ht",
            "text": "Kreyòl ayisyen",
            "supported": false
        },
        {
            "value": "ha",
            "text": "Hausa, هَوُسَ",
            "supported": false
        },
        {
            "value": "hz",
            "text": "Otjiherero",
            "supported": false
        },
        {
            "value": "hi",
            "text": "हिन्दी, हिंदी",
            "supported": false
        },
        {
            "value": "ho",
            "text": "Hiri Motu",
            "supported": false
        },
        {
            "value": "hu",
            "text": "Magyar",
            "supported": false
        },
        {
            "value": "ia",
            "text": "Interlingua",
            "supported": false
        },
        {
            "value": "id",
            "text": "Bahasa Indonesia",
            "supported": false
        },
        {
            "value": "ie",
            "text": "Originally called Occidental; then Interlingue after WWII",
            "supported": false
        },
        {
            "value": "ga",
            "text": "Gaeilge",
            "supported": false
        },
        {
            "value": "ig",
            "text": "Asụsụ Igbo",
            "supported": false
        },
        {
            "value": "ik",
            "text": "Iñupiaq, Iñupiatun",
            "supported": false
        },
        {
            "value": "io",
            "text": "Ido",
            "supported": false
        },
        {
            "value": "is",
            "text": "Íslenska",
            "supported": false
        },
        {
            "value": "iu",
            "text": "ᐃᓄᒃᑎᑐᑦ",
            "supported": false
        },
        {
            "value": "ja",
            "text": "日本語 (にほんご／にっぽんご)",
            "supported": false
        },
        {
            "value": "jv",
            "text": "basa Jawa",
            "supported": false
        },
        {
            "value": "kl",
            "text": "kalaallisut, kalaallit oqaasii",
            "supported": false
        },
        {
            "value": "kn",
            "text": "ಕನ್ನಡ",
            "supported": false
        },
        {
            "value": "kr",
            "text": "Kanuri",
            "supported": false
        },
        {
            "value": "ks",
            "text": "कश्मीरी, كشميري‎",
            "supported": false
        },
        {
            "value": "kk",
            "text": "Қазақ тілі",
            "supported": false
        },
        {
            "value": "km",
            "text": "ភាសាខ្មែរ",
            "supported": false
        },
        {
            "value": "ki",
            "text": "Gĩkũyũ",
            "supported": false
        },
        {
            "value": "rw",
            "text": "Ikinyarwanda",
            "supported": false
        },
        {
            "value": "ky",
            "text": "кыргыз тили",
            "supported": false
        },
        {
            "value": "kv",
            "text": "коми кыв",
            "supported": false
        },
        {
            "value": "kg",
            "text": "KiKongo",
            "supported": false
        },
        {
            "value": "ko",
            "text": "한국어 (韓國語), 조선말 (朝鮮語)",
            "supported": false
        },
        {
            "value": "ku",
            "text": "Kurdî, كوردی‎",
            "supported": false
        },
        {
            "value": "kj",
            "text": "Kuanyama",
            "supported": false
        },
        {
            "value": "la",
            "text": "latine, lingua latina",
            "supported": false
        },
        {
            "value": "lb",
            "text": "Lëtzebuergesch",
            "supported": false
        },
        {
            "value": "lg",
            "text": "Luganda",
            "supported": false
        },
        {
            "value": "li",
            "text": "Limburgs",
            "supported": false
        },
        {
            "value": "ln",
            "text": "Lingála",
            "supported": false
        },
        {
            "value": "lo",
            "text": "ພາສາລາວ",
            "supported": false
        },
        {
            "value": "lt",
            "text": "lietuvių kalba",
            "supported": false
        },
        {
            "value": "lu",
            "text": "",
            "supported": false
        },
        {
            "value": "lv",
            "text": "latviešu valoda",
            "supported": false
        },
        {
            "value": "gv",
            "text": "Gaelg, Gailck",
            "supported": false
        },
        {
            "value": "mk",
            "text": "македонски јазик",
            "supported": false
        },
        {
            "value": "mg",
            "text": "Malagasy fiteny",
            "supported": false
        },
        {
            "value": "ms",
            "text": "bahasa Melayu, بهاس ملايو‎",
            "supported": false
        },
        {
            "value": "ml",
            "text": "മലയാളം",
            "supported": false
        },
        {
            "value": "mt",
            "text": "Malti",
            "supported": false
        },
        {
            "value": "mi",
            "text": "te reo Māori",
            "supported": false
        },
        {
            "value": "mr",
            "text": "मराठी",
            "supported": false
        },
        {
            "value": "mh",
            "text": "Kajin M̧ajeļ",
            "supported": false
        },
        {
            "value": "mn",
            "text": "монгол",
            "supported": false
        },
        {
            "value": "na",
            "text": "Ekakairũ Naoero",
            "supported": false
        },
        {
            "value": "nv",
            "text": "Diné bizaad, Dinékʼehǰí",
            "supported": false
        },
        {
            "value": "nb",
            "text": "Norsk bokmål",
            "supported": false
        },
        {
            "value": "nd",
            "text": "isiNdebele",
            "supported": false
        },
        {
            "value": "ne",
            "text": "नेपाली",
            "supported": false
        },
        {
            "value": "ng",
            "text": "Owambo",
            "supported": false
        },
        {
            "value": "nn",
            "text": "Norsk nynorsk",
            "supported": false
        },
        {
            "value": "no",
            "text": "Norsk",
            "supported": false
        },
        {
            "value": "ii",
            "text": "ꆈꌠ꒿ Nuosuhxop",
            "supported": false
        },
        {
            "value": "nr",
            "text": "isiNdebele",
            "supported": false
        },
        {
            "value": "oc",
            "text": "Occitan",
            "supported": false
        },
        {
            "value": "oj",
            "text": "ᐊᓂᔑᓈᐯᒧᐎᓐ",
            "supported": false
        },
        {
            "value": "cu",
            "text": "ѩзыкъ словѣньскъ",
            "supported": false
        },
        {
            "value": "om",
            "text": "Afaan Oromoo",
            "supported": false
        },
        {
            "value": "or",
            "text": "ଓଡ଼ିଆ",
            "supported": false
        },
        {
            "value": "os",
            "text": "ирон æвзаг",
            "supported": false
        },
        {
            "value": "pa",
            "text": "ਪੰਜਾਬੀ, پنجابی‎",
            "supported": false
        },
        {
            "value": "pi",
            "text": "पाऴि",
            "supported": false
        },
        {
            "value": "fa",
            "text": "فارسی",
            "supported": false
        },
        {
            "value": "pl",
            "text": "polski",
            "supported": false
        },
        {
            "value": "ps",
            "text": "پښتو",
            "supported": false
        },
        {
            "value": "pt",
            "text": "Português",
            "supported": false
        },
        {
            "value": "qu",
            "text": "Runa Simi, Kichwa",
            "supported": false
        },
        {
            "value": "rm",
            "text": "rumantsch grischun",
            "supported": false
        },
        {
            "value": "rn",
            "text": "kiRundi",
            "supported": false
        },
        {
            "value": "ro",
            "text": "română",
            "supported": false
        },
        {
            "value": "sa",
            "text": "संस्कृतम्",
            "supported": false
        },
        {
            "value": "sc",
            "text": "sardu",
            "supported": false
        },
        {
            "value": "sd",
            "text": "सिन्धी, سنڌي، سندھی‎",
            "supported": false
        },
        {
            "value": "se",
            "text": "Davvisámegiella",
            "supported": false
        },
        {
            "value": "sm",
            "text": "gagana faa Samoa",
            "supported": false
        },
        {
            "value": "sg",
            "text": "yângâ tî sängö",
            "supported": false
        },
        {
            "value": "sr",
            "text": "српски језик",
            "supported": false
        },
        {
            "value": "gd",
            "text": "Gàidhlig",
            "supported": false
        },
        {
            "value": "sn",
            "text": "chiShona",
            "supported": false
        },
        {
            "value": "si",
            "text": "සිංහල",
            "supported": false
        },
        {
            "value": "sk",
            "text": "slovenčina",
            "supported": false
        },
        {
            "value": "sl",
            "text": "slovenščina",
            "supported": false
        },
        {
            "value": "so",
            "text": "Soomaaliga, af Soomaali",
            "supported": false
        },
        {
            "value": "st",
            "text": "Sesotho",
            "supported": false
        },
        {
            "value": "es",
            "text": "español, castellano",
            "supported": false
        },
        {
            "value": "su",
            "text": "Basa Sunda",
            "supported": false
        },
        {
            "value": "sw",
            "text": "Kiswahili",
            "supported": false
        },
        {
            "value": "ss",
            "text": "SiSwati",
            "supported": false
        },
        {
            "value": "sv",
            "text": "svenska",
            "supported": false
        },
        {
            "value": "ta",
            "text": "தமிழ்",
            "supported": false
        },
        {
            "value": "te",
            "text": "తెలుగు",
            "supported": false
        },
        {
            "value": "tg",
            "text": "тоҷикӣ, toğikī, تاجیکی‎",
            "supported": false
        },
        {
            "value": "th",
            "text": "ไทย",
            "supported": false
        },
        {
            "value": "ti",
            "text": "ትግርኛ",
            "supported": false
        },
        {
            "value": "bo",
            "text": "བོད་ཡིག",
            "supported": false
        },
        {
            "value": "tk",
            "text": "Türkmen, Түркмен",
            "supported": false
        },
        {
            "value": "tl",
            "text": "Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔",
            "supported": false
        },
        {
            "value": "tn",
            "text": "Setswana",
            "supported": false
        },
        {
            "value": "to",
            "text": "faka Tonga",
            "supported": false
        },
        {
            "value": "tr",
            "text": "Türkçe",
            "supported": false
        },
        {
            "value": "ts",
            "text": "Xitsonga",
            "supported": false
        },
        {
            "value": "tt",
            "text": "татарча, tatarça, تاتارچا‎",
            "supported": false
        },
        {
            "value": "tw",
            "text": "Twi",
            "supported": false
        },
        {
            "value": "ty",
            "text": "Reo Tahiti",
            "supported": false
        },
        {
            "value": "ug",
            "text": "Uyƣurqə, ئۇيغۇرچە‎",
            "supported": false
        },
        {
            "value": "uk",
            "text": "українська",
            "supported": false
        },
        {
            "value": "ur",
            "text": "اردو",
            "supported": false
        },
        {
            "value": "uz",
            "text": "zbek, Ўзбек, أۇزبېك‎",
            "supported": false
        },
        {
            "value": "ve",
            "text": "Tshivenḓa",
            "supported": false
        },
        {
            "value": "vi",
            "text": "Tiếng Việt",
            "supported": false
        },
        {
            "value": "vo",
            "text": "Volapük",
            "supported": false
        },
        {
            "value": "wa",
            "text": "Walon",
            "supported": false
        },
        {
            "value": "cy",
            "text": "Cymraeg",
            "supported": false
        },
        {
            "value": "wo",
            "text": "Wollof",
            "supported": false
        },
        {
            "value": "fy",
            "text": "Frysk",
            "supported": false
        },
        {
            "value": "xh",
            "text": "isiXhosa",
            "supported": false
        },
        {
            "value": "yi",
            "text": "ייִדיש",
            "supported": false
        },
        {
            "value": "yo",
            "text": "Yorùbá",
            "supported": false
        },
        {
            "value": "za",
            "text": "Saɯ cueŋƅ, Saw cuengh",
            "supported": false
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