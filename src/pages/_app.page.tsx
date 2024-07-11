import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { ThemeProvider } from "@/providers";
import { GomakeLoading } from "@/widgets";
import { GoMakeSnackBar } from "@/components";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Backend from "i18next-http-backend";
import { GoMakeTourProvider } from "@/providers/go-make-tour/go-make-tour-provider";
import { GomakeLoadingWithShadow } from "@/widgets/loading-with-shadow";
import useUpdateCurrentPath from "@/pages-components/customer-service/hook/useUpdateCurrentPath";
import EnhancedErrorBoundary from "@/components/jira-logger/ErrorBoundary";

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

export default function App({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();

  return (
    <DndProvider backend={HTML5Backend}>
      <RecoilRoot>
        <UpdatePathWrapper>
          <EnhancedErrorBoundary>
            <ThemeProvider />
            <style jsx global>{`
              html {
                direction: ${t("direction")};
              }
            `}</style>
            <GoMakeTourProvider>
              <Component {...pageProps} />
            </GoMakeTourProvider>
            <GoMakeSnackBar />
            <GomakeLoading />
            <GomakeLoadingWithShadow />
          </EnhancedErrorBoundary>
        </UpdatePathWrapper>
      </RecoilRoot>
    </DndProvider>
  );
}

const UpdatePathWrapper = ({ children }) => {
  useUpdateCurrentPath();
  return children;
};
