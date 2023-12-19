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
import Backend from 'i18next-http-backend'; 
const timestamp = new Date().getTime();

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `https://gomake-translations.s3.eu-central-1.amazonaws.com/{{lng}}.json?timestamp=${timestamp}`,
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
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
