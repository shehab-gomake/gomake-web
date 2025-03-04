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

const QRScannerPage = () => {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(true); // New state to toggle scanning

  const handleScan = (data: { text: string } | null) => {
    if (data) {
      debugger;
      setScanResult(data.text);
      setLoading(false);
      setIsScanning(false); // Hide the QR scanner after a successful scan
    }
  };

  const handleError = (err: any) => {
    console.error("QR Scan error:", err);
    setLoading(false);
  };

  const handleScanAgain = () => {
    setScanResult(null);
    setIsScanning(true); // Show the scanner again
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
          borderRadius: "15px",
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            align="center"
            sx={{ mb: 2, fontWeight: "bold", color: "#2e3092" }}
          >
            QR Code Scanner
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="textSecondary"
            sx={{ mb: 3, fontWeight: "500" }}
          >
            Scan a QR code to proceed.
          </Typography>

          {/* Conditionally render the QR scanner */}
          {isScanning && (
            <Box display="flex" justifyContent="center" sx={{ mb: 3 }}>
              <QrReader
                delay={300}
                facingMode="environment" // Forces the rear camera to be used
                style={{
                  width: "100%",
                  borderRadius: "20px",
                  border: "4px solid #2e3092", // Added a border around the scanner
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                  padding: "10px",
                }}
                onScan={handleScan}
                onError={handleError}
              />
            </Box>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : scanResult ? (
            <Typography
              variant="body1"
              align="center"
              color="primary"
              sx={{ mb: 2 }}
            >
              Scanned QR Code: {String(scanResult)} {/* Ensure it's a string */}
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

          {/* Optional "Scan Again" button */}
          {!isScanning && (
            <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleScanAgain}
                sx={{
                  borderRadius: "5px",
                  padding: "10px",
                  fontWeight: "bold",
                  textTransform: "none",
                  backgroundColor: "#2e3092",
                  "&:hover": {
                    backgroundColor: "#1d1f75", // Slightly darker shade for hover effect
                  },
                }}
              >
                Scan Again
              </Button>
            </Box>
          )}

          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => router.push("/")}
              sx={{
                borderRadius: "5px",
                padding: "10px",
                fontWeight: "bold",
                textTransform: "none",
                backgroundColor: "#2e3092",
                "&:hover": {
                  backgroundColor: "#1d1f75", // Slightly darker shade for hover effect
                },
              }}
            >
              Back to Home
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default QRScannerPage;
