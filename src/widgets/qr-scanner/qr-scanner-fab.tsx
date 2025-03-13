import { Fab } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useRouter } from "next/router";
import { useIsMobile } from "@/hooks/use-responsive";
import { useStyle } from "./style";

const QRScannerFab: React.FC = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { classes } = useStyle();

  const handleOpenQRScanner = () => {
    let currentPath = router.pathname.replace(/^\/+/, "");
    router.push(`/qr-scanner?from=${encodeURIComponent(currentPath)}`);
  };

  if (!isMobile) return null;

  return (
    <Fab
      color="primary"
      sx={classes.mainContainer}
      onClick={handleOpenQRScanner}
    >
      <QrCodeScannerIcon sx={{ fontSize: 25 }} />
    </Fab>
  );
};

export default QRScannerFab;
