import { GoMakeAutoComplate } from "@/components";
import { Paper } from "@mui/material";

const PaPerComponent = (props) => (
  <Paper elevation={0} {...props} style={{ width: "300px" }}>
    {props.children}
  </Paper>
);

interface PrinterSelectorProps {
  printerId: number | undefined;
  printerBin: string | undefined;
  onEdit: (field: string, value: any) => void;
  getPrinterNameByPrinterId?: (id: number | undefined) => string;
  classes: any;
  getPrinterBins: (printerId: number | undefined) => any[];
  printers: any[];
  t: any;
}

const PrinterSelector = ({
  printerId,
  printerBin,
  onEdit,
  getPrinterNameByPrinterId,
  getPrinterBins,
  printers,
  t,
}: PrinterSelectorProps) => (
  <>
    <div style={{ width: "calc(20% - 5px)" }}>
      <GoMakeAutoComplate
        placeholder={t("products.addProduct.admin.printer")}
        PaperComponent={PaPerComponent}
        onChange={(e, v) => onEdit("printerId", v?.printerId)}
        value={getPrinterNameByPrinterId(printerId) || ""}
        options={printers}
      />
    </div>
    <div style={{ width: "calc(20% - 5px)" }}>
      <GoMakeAutoComplate
        placeholder={t("products.addProduct.admin.printerBin")}
        PaperComponent={PaPerComponent}
        onChange={(e, v) => onEdit("printerBin", v)}
        value={printerBin || ""}
        options={getPrinterBins(printerId)}
      />
    </div>
  </>
);

export default PrinterSelector;
