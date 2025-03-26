import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { PageNoteFound } from "@/icons/404-page/page-not-found";
import { PrimaryButton } from "@/components/button/primary-button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMobileHeight } from "@/hooks/use-responsive";

interface PageNotFoundProps {
  hideBackToHomePageBtn?: boolean;
  message?: string;
}

export default function PageNotFound({
  hideBackToHomePageBtn = false,
  message
}: PageNotFoundProps) {
  const router = useRouter();
  const mobileHeight = useMobileHeight();

  const handleGoBack = () => {
    router.push("/home").then(() => {
      window.location.reload();
    });
  };

  return (
    <div>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height={mobileHeight}
        textAlign="center"
        p={2}
        bgcolor="white"
      >
        <PageNoteFound />
        {
          !message && <Typography variant="h2" component="h2" gutterBottom>
            Page Not Found
          </Typography>
        }
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          style={{ color: "#4B4B4B", fontWeight: 400 }}
        >
          {message ? <Typography variant="h2" component="h2" gutterBottom>
            {message}
          </Typography> : "This page doesn't exist or was removed! We suggest you go back to the home page."}
        </Typography>
        {!hideBackToHomePageBtn && (
          <PrimaryButton
            variant={"contained"}
            onClick={handleGoBack}
            startIcon={<ArrowBackIcon />}
            style={{ width: "fit-content" }}
          >
            Back to home
          </PrimaryButton>
        )}
      </Box>
    </div>
  );
}
