import "react-calendar-timeline/lib/Timeline.css"; // Global timeline styles
import "@/styles/globals.css";
import "@/styles/ai-animations.css";
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
import "rsuite/dist/rsuite-no-reset.min.css";
import { FileUploaderProvider } from "@/providers/signalr-provider/file-uploader-provider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { MailTestProvider } from "@/providers/signalr-provider/mail-test-provider";
import { GoSupportChatWidget } from "@/components/chat-bot/go-support-chat-widget";
import { useRouter } from "next/router";

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
  const router = useRouter();

  // Pages where the chat widget should be hidden
  const hiddenChatWidgetPages = ["/gomake-ai", "/login"];
  const shouldShowChatWidget = !hiddenChatWidgetPages.includes(router.pathname);

  return (
    <DndProvider backend={HTML5Backend}>
      <RecoilRoot>
        <FileUploaderProvider>
          <MailTestProvider>
            <UpdatePathWrapper>
              <EnhancedErrorBoundary>
                <ThemeProvider />
                <LocalizationProvider
                  dateAdapter={AdapterMoment}
                  adapterLocale="en-gb"
                >
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
                  {/*shouldShowChatWidget && <GoSupportChatWidget />*/}
                </LocalizationProvider>
              </EnhancedErrorBoundary>
            </UpdatePathWrapper>
          </MailTestProvider>
        </FileUploaderProvider>
      </RecoilRoot>
    </DndProvider>
  );
}

const UpdatePathWrapper = ({ children }) => {
  useUpdateCurrentPath();
  return children;
};
