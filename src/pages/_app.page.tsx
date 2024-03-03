import "@/styles/globals.css";
import type {AppProps} from "next/app";
import {RecoilRoot} from "recoil";
import i18n from "i18next";
import {initReactI18next, useTranslation} from "react-i18next";
import {ThemeProvider} from "@/providers";
import {GomakeLoading} from "@/widgets";
import {GoMakeSnackBar} from "@/components";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import Backend from 'i18next-http-backend';
import {TourProvider} from "@reactour/tour";
import {FONT_FAMILY} from "@/utils/font-family";

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        backend: {
            loadPath: `https://gomake-translations.s3.eu-central-1.amazonaws.com/web/{{lng}}.json`,
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });


export default function App({Component, pageProps}: AppProps) {
    const {t} = useTranslation();
    return (
        <DndProvider backend={HTML5Backend}>
            <RecoilRoot>
                <ThemeProvider/>
                <style jsx global>{`
                  html {
                    direction: ${t("direction")};
                  }
                `}</style>
                <TourProvider steps={[]}
                              styles={{
                                  popover: (base) => ({
                                      ...base,
                                      '--reactour-accent': '#ef5a3d',
                                      borderRadius: 20,
                                      ...FONT_FAMILY.Outfit(600, 18)
                                  }),
                                  maskArea: (base) => ({ ...base, rx: 10, padding: '10px' }),
                                  maskWrapper: (base) => ({ ...base}),
                                  badge: (base) => ({ ...base, left: 'auto', right: '-0.8125em', backgroundColor: '#2E3092' }),
                                  controls: (base) => ({ ...base, marginTop: 100 }),
                                  close: (base) => ({ ...base, right: 'auto', left: 8, top: 10 }),
                              }}
                              scrollSmooth={true}>
                    <Component {...pageProps} />
                </TourProvider>
                <GoMakeSnackBar/>
                <GomakeLoading/>
            </RecoilRoot>
        </DndProvider>
    );
}