import { SortByTypes } from "@/enums";
import { useTranslation } from "react-i18next";
import { DiscountType } from "@/enums";
import { DocumentPreferencesEnum } from "@/enums";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { quoteItemState } from "@/store";
import { currenciesState } from "@/widgets/materials-widget/state";
import { ChangeEvent, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { EnumVATStatus } from "@/enums/accounting-enums";

const useSttingsQuoteMenu = ({ updateDocumentPreference }) => {
  const { t } = useTranslation();
  const quoteStateValue = useRecoilValue<any>(quoteItemState);
  const { getCurrenciesApi } = useCompanyProfile();
  const [detailsView, setDetailsView] = useState(
    quoteStateValue?.isShowDetails
  );
  const [showPrices, setShowPrices] = useState(quoteStateValue?.isShowPrice);
  const [showGraphics, setShowGraphics] = useState(
    quoteStateValue?.isShowGraphicsItems
  );
  const [showDelivery, setShowDelivery] = useState(
    quoteStateValue?.isShowDeliveryItems
  );
  const [hideItemDiscountColumn, setHideItemDiscountColumn] = useState(
    quoteStateValue?.hideItemDiscountColumn
  );

  const currencies =
    useRecoilValue<{ label: string; value: string }[]>(currenciesState);
  const matchingCurrency = currencies.find(
    (currency) => currency.value === quoteStateValue?.currency
  )?.label;
  const vatStatusList: { value: number; text: string }[] = Object.values(
    EnumVATStatus
  )
    .filter((value) => typeof value === "number")
    .map((value) => ({
      value: value as number,
      text: t(`accounting.${EnumVATStatus[value]}`),
    }));

  const vatStatus = vatStatusList.find(
    (status) => status.value === quoteStateValue?.vatStatus
  )?.text;
  const [exchangeRate, setExchangeRate] = useState(
    quoteStateValue?.exchangeRate || "-"
  );
  const [anchorElTableSorting, setAnchorElTableSorting] =
    useState<null | HTMLElement>(null);
  const [anchorElAutomaticDiscount, setAnchorElAutomaticDiscount] =
    useState<null | HTMLElement>(null);
  const openTableSorting = Boolean(anchorElTableSorting);
  const openAutomaticDiscount = Boolean(anchorElAutomaticDiscount);
  useEffect(() => {
    setDetailsView(quoteStateValue?.isShowDetails);
    setShowPrices(quoteStateValue?.isShowPrice);
    setShowGraphics(quoteStateValue?.isShowGraphicsItems);
    setShowDelivery(quoteStateValue?.isShowDeliveryItems);
    setHideItemDiscountColumn(quoteStateValue?.hideItemDiscountColumn);
  }, [
    quoteStateValue?.isShowDetails,
    quoteStateValue?.isShowPrice,
    quoteStateValue?.isShowGraphicsItems,
    quoteStateValue?.isShowDeliveryItems,
    quoteStateValue?.hideItemDiscountColumn,
  ]);

  useEffect(() => {
    setExchangeRate(quoteStateValue?.exchangeRate || "-");
  }, [quoteStateValue?.exchangeRate]);

  useEffect(() => {
    getCurrenciesApi();
  }, []);

  const handleSwitchCheck = (event: ChangeEvent<HTMLInputElement>) => {
    setDetailsView(event.target.checked);
    updateDocumentPreference(
      event.target.checked,
      DocumentPreferencesEnum.ShowDetails
    );
  };

  const handleSwitchCheckForShowPrice = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setShowPrices(event.target.checked);
    updateDocumentPreference(
      event.target.checked,
      DocumentPreferencesEnum.ShowPrice
    );
  };

  const handleSwitchCheckForShowGraphics = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setShowGraphics(event.target.checked);
    updateDocumentPreference(
      event.target.checked,
      DocumentPreferencesEnum.ShowGraphicsItems
    );
  };

  const handleSwitchCheckForShowDelivery = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setShowDelivery(event.target.checked);
    updateDocumentPreference(
      event.target.checked,
      DocumentPreferencesEnum.ShowDeliveryItems
    );
  };

  const handleSwitchCheckForHideItemDiscountColumn = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setHideItemDiscountColumn(event.target.checked);
    updateDocumentPreference(
      event.target.checked,
      DocumentPreferencesEnum.HideItemDiscountColumn
    );
  };

  const handleTableSorting = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTableSorting(event.currentTarget);
  };

  const handleTableSortingClose = () => {
    setAnchorElTableSorting(null);
  };

  const handleAutomaticDiscount = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAutomaticDiscount(event.currentTarget);
  };

  const handleAutomaticDiscountClose = () => {
    setAnchorElAutomaticDiscount(null);
  };

  const _renderSelectionType = (type: DiscountType) => {
    switch (type) {
      case DiscountType.Product:
        return <div>{t("sales.quote.byProduct")}</div>;
      case DiscountType.ProductSKU:
        return <div>{t("sales.quote.bySku")}</div>;
      default:
        return <div> {t("sales.quote.none")}</div>;
    }
  };
  const _renderSortingBy = (type: SortByTypes) => {
    switch (type) {
      case SortByTypes.Date:
        return <div> {t("sales.quote.creationDate")}</div>;
      case SortByTypes.ProductABC:
        return <div>{t("sales.quote.productName")}</div>;
      case SortByTypes.WorkNameABC:
        return <div>{t("sales.quote.jobName")}</div>;
    }
  };

  const switchConfigs = [
    {
      label: t("sales.quote.details"),
      checked: detailsView,
      onChange: handleSwitchCheck,
    },
    {
      label: t("sales.quote.showPrices"),
      checked: showPrices,
      onChange: handleSwitchCheckForShowPrice,
    },
    // {
    //   label: t("sales.quote.showGraphics"),
    //   checked: showGraphics,
    //   onChange: handleSwitchCheckForShowGraphics,
    // },
    // {
    //   label: t("sales.quote.showDelivery"),
    //   checked: showDelivery,
    //   onChange: handleSwitchCheckForShowDelivery,
    // },
    {
      label: t("sales.quote.hideItemDiscountColumn"),
      checked: hideItemDiscountColumn,
      onChange: handleSwitchCheckForHideItemDiscountColumn,
    },
  ];
  return {
    quoteStateValue,
    exchangeRate,
    anchorElTableSorting,
    anchorElAutomaticDiscount,
    openTableSorting,
    openAutomaticDiscount,
    matchingCurrency,
    currencies,
    switchConfigs,
    vatStatus,
    vatStatusList,
    handleTableSorting,
    handleTableSortingClose,
    handleAutomaticDiscount,
    handleAutomaticDiscountClose,
    _renderSelectionType,
    _renderSortingBy,
    setExchangeRate,
    t,
  };
};

export { useSttingsQuoteMenu };
