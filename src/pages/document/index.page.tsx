import { CustomerAuthLayout } from "@/layouts";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks";
import { getPdfLinkApi } from "@/services/api-service/generic-doc/documents-api";
import { useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function DocumentPage() {
  const router = useRouter();
  const { id } = router.query;
  const { callApi } = useGomakeAxios();
  const userProfile = useRecoilValue(userProfileState);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdfLink = async () => {
      if (!id || typeof id !== "string") {
        setError("Invalid document link");
        setLoading(false);
        return;
      }

      if (!userProfile?.printHouseId) {
        setError("Print house ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const callBack = (res: any) => {
          if (res?.success && res?.data) {
            // The API returns the PDF link in res.data
            let link = String(res.data).trim();

            // Normalize the URL - ensure it's a complete absolute URL with protocol
            if (link) {
              // Get current origin to detect and fix duplication
              const currentOrigin = window.location.origin;
              const currentDomain = currentOrigin.replace(/^https?:\/\//, '');

              // Remove any duplicate domain patterns
              // Pattern 1: https://domain.com/domain.com/...
              const duplicatePattern1 = new RegExp(`${currentDomain}/${currentDomain}`, 'g');
              if (duplicatePattern1.test(link)) {
                link = link.replace(duplicatePattern1, currentDomain);
              }

              // Pattern 2: domain.com/domain.com/...
              const duplicatePattern2 = new RegExp(`^${currentDomain}/${currentDomain}`, 'g');
              if (duplicatePattern2.test(link)) {
                link = link.replace(duplicatePattern2, currentDomain);
              }

              // If it doesn't start with http:// or https://, add https://
              if (!link.startsWith("http://") && !link.startsWith("https://")) {
                // Remove any leading slashes to avoid double slashes
                link = link.replace(/^\/+/, "");
                // Add https:// protocol
                link = `https://${link}`;
              }

              setPdfUrl(link);
              // Redirect to the PDF URL using window.location.replace to avoid history entry
              window.location.replace(link);
            } else {
              setError("PDF link not found");
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
            printHouseId: userProfile.printHouseId,
            linkId: id,
          }
        );
      } catch (err: any) {
        setError(err?.message || "An error occurred while fetching the PDF");
        setLoading(false);
      }
    };

    if (router.isReady && id && userProfile?.printHouseId) {
      fetchPdfLink();
    }
  }, [router.isReady, id, userProfile?.printHouseId, callApi]);

  return (
    <CustomerAuthLayout
      staticPageTitle={"document"}
      allowAnonymous={false}
      disableHeaderSideMenu={true}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        padding={3}
      >
        {loading && (
          <>
            <CircularProgress size={48} />
            <Typography
              variant="body1"
              style={{ marginTop: 16, color: "#666" }}
            >
              {t("document.loading", { defaultValue: "Loading document..." })}
            </Typography>
          </>
        )}
        {error && (
          <>
            <Typography variant="h6" color="error" gutterBottom>
              {t("document.error", { defaultValue: "Error" })}
            </Typography>
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </>
        )}
        {pdfUrl && !loading && !error && (
          <Box>
            <Typography variant="body1">
              {t("document.redirecting", {
                defaultValue: "Redirecting to document...",
              })}
            </Typography>
          </Box>
        )}
      </Box>
    </CustomerAuthLayout>
  );
}

