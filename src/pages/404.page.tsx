import React from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { PageNoteFound } from "@/icons/404-page/page-not-found";
import { PrimaryButton } from "@/components/button/primary-button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function PageNotFound() {

  const router = useRouter();

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
        height="100vh"
        textAlign="center"
        p={2}
        bgcolor="white"
      >
        <PageNoteFound />
        <Typography variant="h2" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom style={{ color: "#4B4B4B", fontWeight: 400 }}>
          This page doesn't exist or was removed! We suggest you go back to the home page.
        </Typography>
        <PrimaryButton
          variant={"contained"}
          onClick={handleGoBack}
          startIcon={<ArrowBackIcon />}
          style={{ width: "fit-content" }}
        >
          Back to home
        </PrimaryButton>
      </Box>
    </div>
  );
}
