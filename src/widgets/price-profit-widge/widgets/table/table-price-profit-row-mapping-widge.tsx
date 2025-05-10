import React, { useState } from 'react';
import { MenuItem, TableCell } from '@mui/material';
import { Warning2Icon } from '@/icons';
import { useStyle } from './style';
import { InputUpdatedValues } from '@/widgets/quote-new/input-updated-values';
import { MoreIcon } from './icons/more-icon';
import { GoMakeMenu } from '@/components/menu/menu';
import { ReviewIcon } from './icons/review-icon';
import { useTranslation } from 'react-i18next';
import { useQuoteGetData } from '@/pages-components/quote-new/use-quote-get-data';
import { systemCurrencyState } from '@/store/user';
import { useRecoilValue } from 'recoil';

const PriceProfitRowMappingTable = ({
  price,
  idx,
  index,
  handleOpen,
  setSelectedProduct,
  onBlurPriceChange,
  handlePriceChange,
  isUpdate,
  product,
  setIsUpdate,
  activeCell,
  setActiveCell,
  updatePrintHousePrice,
  handleReviewCalculation
}) => {
  const { classes } = useStyle()
  const { getCurrencyUnitText } = useQuoteGetData();
  const systemCurrency = useRecoilValue<any>(systemCurrencyState);
  const CurrencyUnit = getCurrencyUnitText(systemCurrency);

  const isActive = activeCell?.index === index && activeCell?.idx === idx;
  const [anchorEl, setAnchorEl] = useState(null)
  const { t } = useTranslation()
  const open = Boolean(anchorEl)
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleActiveOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  return (
    <TableCell
      className="tableBodyCellForProduct"
      sx={classes.tableBodyCell}
      key={idx}
      style={(price.printHousePrice !== price.calculatedPrice) && price.printHousePrice !== null ? classes.tableBodyCellError : classes.tableBodyNotErrorCell}
      onClick={(event) => {

        if ((price.printHousePrice !== price.calculatedPrice) && price.printHousePrice !== null) {
          handleOpen(event)
          setSelectedProduct({ ...product, ...price })
        }
        else {
          setActiveCell({ index, idx });
        }
      }}
    >
      <div style={classes.tableBodyCellContent}>
        {price.isErrorInCalculation ? (
          <Warning2Icon />
        ) : (
          <InputUpdatedValues
            value={price.calculatedPrice ?? "----"}
            isTwoDigit
            onBlur={() => {
              updatePrintHousePrice({ ...product, ...price }, false, true)
              setActiveCell(null);
            }}
            isUpdate={(isUpdate && isActive) && price.calculatedPrice !== null}
            setIsUpdate={() => setIsUpdate(!isUpdate)}
            onInputChange={(value) => {
              handlePriceChange(index, idx, value);
            }}
            sign={CurrencyUnit}
            isRightSign={systemCurrency === "USD" ? false : true}
          />
        )}
      </div>
      <div
        className="moreIconContainer"
        style={classes.moreIconContainer}
        onClick={handleActiveOpen}
      >
        <MoreIcon />
      </div>
      <GoMakeMenu
        handleClose={handleClose}
        open={open}
        anchorEl={anchorEl}
      >
        <div style={classes.moreMenuContainer}>
          <MenuItem
            onClick={() => handleReviewCalculation({ ...product, ...price })}
          >
            <div style={classes.menuItemReviewContainer}>
              <ReviewIcon />
              <div style={classes.menuItemReviewText}>{t("priceProfit.reviewCalculation")}</div>
            </div>
          </MenuItem>
        </div>
      </GoMakeMenu>
    </TableCell>
  );
};

export { PriceProfitRowMappingTable };