import { CustomerAuthLayout } from "@/layouts";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks";
import { getPdfLinkApi, getDocumentPdfApi } from "@/services/api-service/generic-doc/documents-api";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function DocumentPage() {
  const router = useRouter();
  const { id } = router.query;
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      if (!id || typeof id !== "string") {
        setError("Invalid document ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const callBack = (res: any) => {
          // Handle both success status formats: res.success or res.status === "success"
          const isSuccess = res?.success || res?.status === "success";

          if (isSuccess && res?.data) {
            // The API returns the PDF link in res.data.data (nested structure)
            // or directly in res.data (string)
            let link: string | null = null;

            if (typeof res.data === "string") {
              // Direct string response
              link = res.data.trim();
            } else if (res.data?.data && typeof res.data.data === "string") {
              // Nested structure: { data: { data: "https://..." } }
              link = res.data.data.trim();
            } else if (res.data?.link && typeof res.data.link === "string") {
              // Alternative nested structure
              link = res.data.link.trim();
            }

            if (link) {
              // Ensure the link has http:// or https://
              if (!link.startsWith("http://") && !link.startsWith("https://")) {
                link = `https://${link}`;
              }
              console.log("PDF URL received, opening:", link);

              // Try to open PDF in a new tab first
              const newWindow = window.open(link, "_blank");

              // If popup was blocked, navigate in current window
              if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
                // Popup blocked, use window.location.replace instead
                window.location.replace(link);
              }
            } else {
              setError("PDF link not found in response");
            }
          } else {
            setError(
              res?.message ||
              res?.data?.message ||
              "Failed to get PDF link"
            );
          }
          setLoading(false);
        };


        await getPdfLinkApi(
          callApi,
          callBack,
          {
            linkId: id,
          }
        );
      } catch (err: any) {
        setError(err?.message || "An error occurred while fetching the PDF");
        setLoading(false);
      }
    };

    if (router.isReady && id) {
      fetchPdf();
    }
  }, [router.isReady, id, callApi]);

  return (
    <CustomerAuthLayout
      staticPageTitle={"document"}
      allowAnonymous={true}
      disableHeaderSideMenu={true}
    >
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        height="100vh"
        sx={{
          position: "relative",
        }}
      >
        {loading && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="60vh"
            padding={3}
          >
            <CircularProgress size={48} />
            <Typography
              variant="body1"
              style={{ marginTop: 16, color: "#666" }}
            >
              {t("document.loading", { defaultValue: "Loading document..." })}
            </Typography>
          </Box>
        )}
        {error && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="60vh"
            padding={3}
          >
            <Typography variant="h6" color="error" gutterBottom>
              {t("document.error", { defaultValue: "Error" })}
            </Typography>
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Box>
        )}
      </Box>
    </CustomerAuthLayout>
  );
}

