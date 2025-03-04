import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import QrReader from "react-qr-scanner";
import { PrimaryButton } from "@/components/button/primary-button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const QRScannerPage = () => {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleScan = (data: string | null) => {
    if (data) {
      console.log("Scanned QR Code:", data);
      setScanResult(data);
      setLoading(false);
      // Redirect or handle the scanned data further
      //   router.push(`/somewhere?data=${data}`);
    }
  };

  const handleError = (err: any) => {
    console.error("QR Scan error:", err);
    setLoading(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f7f7f7"
      p={3}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: "10px",
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            align="center"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            QR Code Scanner
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="textSecondary"
            sx={{ mb: 3 }}
          >
            Scan a QR code to proceed.
          </Typography>

          <Box display="flex" justifyContent="center" sx={{ mb: 3 }}>
            <QrReader
              delay={300}
              style={{
                width: "100%",
                borderRadius: "8px",
                border: "2px solid #2e3092",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              onScan={handleScan}
              onError={handleError}
            />
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
              <CircularProgress />
            </Box>
          ) : scanResult ? (
            <Typography
              variant="body1"
              align="center"
              color="primary"
              sx={{ mb: 2 }}
            >
              Scanned QR Code: {scanResult}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              align="center"
              color="textSecondary"
              sx={{ mb: 2 }}
            >
              Waiting for scan...
            </Typography>
          )}

          <Box display="flex" justifyContent="center">
            {/* <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                borderRadius: "5px",
                padding: "10px",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#115293",
                },
              }}
            >
              Back to Home
            </Button> */}

            <PrimaryButton
              variant={"contained"}
              startIcon={<ArrowBackIcon />}
              sx={{
                borderRadius: "5px",
                padding: "10px",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#115293",
                },
              }}
              onClick={() => router.push("/")}
            >
              Back to home
            </PrimaryButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default QRScannerPage;
