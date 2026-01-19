import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Fade,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import QrReader from "react-qr-scanner";
import { useTranslation } from "react-i18next";
import { getOrderIdFromQrCode } from "@/services/api-service/qr-scanner/qr-scanner-endpoints";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { useStyle } from "./style";
import { getBoardMissionsIdByQrCodeApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { QrCodeAction } from "@/enums";
import {
  QrCodeScanner,
  Refresh,
  Home,
  CheckCircle,
  Error,
} from "@mui/icons-material";

const QRScannerPage = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [scanStatus, setScanStatus] = useState<
    "idle" | "scanning" | "success" | "error"
  >("idle");
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { query } = useRouter();
  const { from } = query;

  const handleScan = async (data: { text: string } | null) => {
    if (!data) return;

    setLoading(true);
    setScanStatus("scanning");
    setIsScanning(false);

    try {
      if (from === "production-floor") {
        //  Get Board Mission ID
        await getBoardMissionsIdByQrCodeApi(
          callApi,
          (res) => {
            if (res?.success && res.data?.boardMissionId) {
              setScanResult(data.text);
              setScanStatus("success");

              const action = res.data?.action;
              const boardMissionId = res.data.boardMissionId;
              const productType = res.data?.productType || "";

              setTimeout(() => {
                if (
                  action === QrCodeAction.START ||
                  action === QrCodeAction.FINISH
                ) {
                  // For START/FINISH: Navigate with productType in URL
                  const url = `/production-floor?boardMissionsId=${boardMissionId}${
                    productType ? `&productType=${productType}` : ""
                  }&step=stations&isScanning=${true}`;
                  navigate(url);
                } else if (action === QrCodeAction.DELIVERY) {
                  // For DELIVERY: Navigate to production floor and open move to done modal
                  // Note: We don't set isScanning=true here to avoid opening the "move to next station" modal
                  const url = `/production-floor?boardMissionsId=${boardMissionId}${
                    productType ? `&productType=${productType}` : ""
                  }&step=stations&openMoveToDoneModal=true`;
                  navigate(url);
                } else {
                  // Default behavior (fallback)
                  navigate(
                    `/production-floor?boardMissionsId=${boardMissionId}${
                      productType ? `&productType=${productType}` : ""
                    }&step=stations&isScanning=${true}`
                  );
                }
              }, 1500);
            } else {
              setScanResult("Invalid QR Code or No Board Mission Found");
              setScanStatus("error");
            }
            setLoading(false);
            // setIsScanning(false);
          },
          data.text
        );
      } else if (from === "deliveries") {
        //  Get Order Mission ID
        await getOrderIdFromQrCode(
          callApi,
          (res) => {
            if (res?.success && res.data) {
              setScanResult(data.text);
              setScanStatus("success");
              setTimeout(() => {
                navigate(
                  `/deliveries?orderId=${res.data?.orderId}&customerId=${res.data?.customerId}&documentNumber=${res.data?.orderNumber}`
                );
              }, 1500);
            } else {
              setScanResult("Invalid QR Code or No Order Found");
              setScanStatus("error");
            }
            setLoading(false);
            // setIsScanning(false);
          },
          { qrCode: data.text }
        );
      }
    } catch (error) {
      console.error("QR Scan error:", error);
      setScanStatus("error");
      setLoading(false);
    }
  };

  const handleError = (err: any) => {
    console.error("QR Scan error:", err);
    setLoading(false);
  };

  const handleScanAgain = () => {
    setScanResult(null);
    setIsScanning(true);
    setLoading(false);
    setScanStatus("idle");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(46,48,146,0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(46,48,146,0.03) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(46,48,146,0.03) 0%, transparent 50%)
          `,
        }}
      />

      <Card
        sx={{
          maxWidth: { xs: "95%", sm: 500 },
          width: "100%",
          borderRadius: { xs: 2, sm: 4 },
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.95)",
          border: "1px solid rgba(255,255,255,0.2)",
          position: "relative",
          overflow: "hidden",
          mx: { xs: 1, sm: 0 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #2e3092 0%, #1d1f75 100%)",
            color: "white",
            p: { xs: 2, sm: 3 },
            textAlign: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }}
          />

          <QrCodeScanner
            sx={{
              fontSize: { xs: 36, sm: 48 },
              mb: { xs: 1, sm: 2 },
              opacity: 0.9,
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: "1.5rem", sm: "2.125rem" },
              background: "linear-gradient(45deg, #fff, #e3f2fd)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("productionFloor.QRScanner")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.9,
              fontWeight: 500,
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            {t("productionFloor.scanQRCodeToProceed")}
          </Typography>
        </Box>

        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          {/* Scanner Container */}
          {isScanning && (
            <Fade in={isScanning} timeout={500}>
              <Box
                sx={{
                  position: "relative",
                  mb: { xs: 2, sm: 4 },
                  borderRadius: { xs: 2, sm: 3 },
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  border: "3px solid #2e3092",
                }}
              >
                <QrReader
                  delay={300}
                  facingMode="environment"
                  constraints={{
                    video: { facingMode: { exact: "environment" } },
                  }}
                  style={{
                    width: "100%",
                    height: window.innerWidth < 600 ? "250px" : "300px",
                    objectFit: "cover",
                  }}
                  onScan={handleScan}
                  onError={handleError}
                />

                {/* Scanner Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 160, sm: 200 },
                      height: { xs: 160, sm: 200 },
                      border: "3px solid #00e676",
                      borderRadius: 2,
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: -3,
                        left: -3,
                        right: -3,
                        bottom: -3,
                        border: "2px solid rgba(0,230,118,0.3)",
                        borderRadius: 2,
                        animation: "pulse 2s infinite",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Fade>
          )}

          {/* Status Display */}
          <Box sx={{ mb: { xs: 2, sm: 4 }, textAlign: "center" }}>
            {loading && (
              <Fade in={loading} timeout={300}>
                <Box>
                  <CircularProgress
                    size={60}
                    sx={{
                      color: "var(--theme-primary-color, #2E3092)",
                      mb: 2,
                      width: { xs: 50, sm: 60 },
                      height: { xs: 50, sm: 60 },
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "var(--theme-primary-color, #2E3092)",
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {t("productionFloor.waitingForScan")}...
                  </Typography>
                  <LinearProgress
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: "rgba(46,48,146,0.1)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "var(--theme-primary-color, #2E3092)",
                      },
                    }}
                  />
                </Box>
              </Fade>
            )}

            {scanStatus === "success" && (
              <Fade in={scanStatus === "success"} timeout={500}>
                <Box>
                  <CheckCircle
                    sx={{
                      fontSize: { xs: 60, sm: 80 },
                      color: "#00e676",
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#00e676",
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {t("productionFloor.scannedQRCode")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontFamily: "monospace",
                      backgroundColor: "rgba(0,230,118,0.1)",
                      padding: 1,
                      borderRadius: 1,
                      border: "1px solid rgba(0,230,118,0.2)",
                    }}
                  >
                    {String(scanResult)}
                  </Typography>
                </Box>
              </Fade>
            )}

            {scanStatus === "error" && (
              <Fade in={scanStatus === "error"} timeout={500}>
                <Box>
                  <Error
                    sx={{
                      fontSize: { xs: 60, sm: 80 },
                      color: "#f44336",
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#f44336",
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    Scan Failed
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    {String(scanResult)}
                  </Typography>
                </Box>
              </Fade>
            )}

            {!loading && !scanResult && isScanning && (
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              >
                Position the QR code within the frame
              </Typography>
            )}
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, sm: 2 },
              flexDirection: "column",
            }}
          >
            {!isScanning && (
              <Button
                variant="contained"
                size="large"
                startIcon={<Refresh />}
                onClick={handleScanAgain}
                sx={{
                  background:
                    "linear-gradient(135deg, #2e3092 0%, #1d1f75 100%)",
                  borderRadius: { xs: 2, sm: 3 },
                  py: { xs: 1.2, sm: 1.5 },
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  boxShadow: "0 8px 20px rgba(46,48,146,0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #1d1f75 0%, #2e3092 100%)",
                    boxShadow: "0 12px 25px rgba(46,48,146,0.4)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {t("productionFloor.scanAgain")}
              </Button>
            )}

            <Button
              variant="outlined"
              size="large"
              startIcon={<Home />}
              onClick={() => router.push("/")}
              sx={{
                borderColor: "var(--theme-primary-color, #2E3092)",
                color: "var(--theme-primary-color, #2E3092)",
                borderRadius: { xs: 2, sm: 3 },
                py: { xs: 1.2, sm: 1.5 },
                fontWeight: 600,
                textTransform: "none",
                fontSize: { xs: "1rem", sm: "1.1rem" },
                "&:hover": {
                  borderColor: "#1d1f75",
                  backgroundColor: "rgba(46,48,146,0.05)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {t("productionFloor.backToHome")}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  );
};

export default QRScannerPage;
