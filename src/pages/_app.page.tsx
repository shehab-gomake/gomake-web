import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import ar from "@/languages/ar.json";
import en from "@/languages/en.json";
import he from "@/languages/he.json";
import de from "@/languages/de.json";
import { ThemeProvider } from "@/providers";
import { GomakeLoading } from "@/widgets";
import { GoMakeSnackBar } from "@/components";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {
        translation: {
          ...en,
        },
      },
      ar: {
        translation: {
          ...ar,
        },
      },
      he: {
        translation: {
          ...he,
        },
      },
        de: {
        translation: {
          ...de,
        },
      },
    },
    lng: "ar", // if you're using a language detector, do not define the lng option
    fallbackLng: "en",

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

export default function App({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();

  return (
      <DndProvider backend={HTML5Backend}>

      <RecoilRoot>
      <ThemeProvider />
      <style jsx global>{`
        html {
          direction: ${t("direction")};
        }
      `}</style>
      <Component {...pageProps} />
      <GoMakeSnackBar />
      <GomakeLoading />
    </RecoilRoot>
      </DndProvider>
  );
}
