import React, { useState } from 'react';
import { Tooltip, CircularProgress } from '@mui/material';
import { Download } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSnackBar } from '@/hooks/use-snack-bar';
import { PrimaryButton } from '@/components/button/primary-button';
import { 
  exportProductionFloorToExcel, 
  getExportFilename
} from '@/utils/production-floor-export';
import { IStatusesBoardsMissions } from '@/widgets/production-floor/interfaces/production-floor-data-response';

interface ProductionFloorExportButtonsProps {
  statusBoards: IStatusesBoardsMissions[];
}

const ProductionFloorExportButtons: React.FC<ProductionFloorExportButtonsProps> = ({
  statusBoards
}) => {
  const { t } = useTranslation();
  const { alertSuccess, alertFault } = useSnackBar();
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExportToExcel = async () => {
    try {
      setIsExporting(true);
      
      if (!statusBoards || statusBoards.length === 0) {
        alertFault(t('productionFloor.export.noDataToExport'));
        return;
      }

      const filename = getExportFilename('production-floor-data', 'xlsx');
      exportProductionFloorToExcel(statusBoards, filename);
      
      alertSuccess(t('productionFloor.export.excelExportSuccess'));
    } catch (error) {
      console.error('Excel export error:', error);
      alertFault(t('productionFloor.export.excelExportError'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Tooltip title={t('productionFloor.export.exportToExcel')}>
      <PrimaryButton
        variant="outlined"
        onClick={handleExportToExcel}
        disabled={isExporting}
        sx={{
          width: "fit-content",
          minWidth: "40px",
          height: "40px",
          padding: "8px 16px",
        }}
      >
        {isExporting ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <Download />
        )}
      </PrimaryButton>
    </Tooltip>
  );
};

export { ProductionFloorExportButtons };
