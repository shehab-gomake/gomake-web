import { CustomerAuthLayout } from "@/layouts/customer-auth-layout";
import QRScannerWidget from "@/widgets/qr-scanner/qr-scanner-widget";

export default function QRScannerPage() {
  return (
    <CustomerAuthLayout allowAnonymous={true} disableHeaderSideMenu={true}>
      <QRScannerWidget />
    </CustomerAuthLayout>
  );
}
