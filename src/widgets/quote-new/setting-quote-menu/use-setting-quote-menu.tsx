import { ShowDocumentDetailsEnum, ShowPricesEnum, SortByTypes } from "@/enums";
import { useTranslation } from "react-i18next";
import { DiscountType } from "@/enums";
import { DocumentPreferencesEnum } from "@/enums";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { quoteItemState } from "@/store";
import { currenciesState } from "@/widgets/materials-widget/state";
import { ChangeEvent, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { EnumVATStatus } from "@/enums/accounting-enums";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";

const useSttingsQuoteMenu = ({ updateDocumentPreference }) => {
  const { t } = useTranslation();
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const quoteStateValue = useRecoilValue<any>(quoteItemState);
  const { getCurrenciesApi } = useCompanyProfile();

  const [detailsView, setDetailsView] = useState<ShowDocumentDetailsEnum>(
    quoteStateValue?.showDetails ?? ShowDocumentDetailsEnum.All
  );

  const [showPrices, setShowPrices] = useState<ShowPricesEnum>(
    quoteStateValue?.showPrices ?? ShowPricesEnum.All
  );

  const onBlurShowPrices = async () => {
    setIsUpdateShowPrices(null);
  };
  const [isUpdateShowPrices, setIsUpdateShowPrices] = useState<number | null>(
    null
  );

  const onBlurShowDetails = async () => {
    setIsUpdateShowDetails(null);
  };
  const [isUpdateShowDetails, setIsUpdateShowDetails] = useState<number | null>(
    null
  );

  const showDetailsOptions = [
    {
      value: ShowDocumentDetailsEnum.All,
      text: t("sales.quote.showAllDetails"),
    },
    {
      value: ShowDocumentDetailsEnum.ShowJobNameOnly,
      text: t("sales.quote.showJobNameOnly"),
    },
    {
      value: ShowDocumentDetailsEnum.HideDetails,
      text: t("sales.quote.hideDetails"),
    },
  ];

  const showPricesOptions = [
    { value: ShowPricesEnum.All, text: t("sales.quote.showAllPrices") },
    {
      value: ShowPricesEnum.HideTotalPriceOnly,
      text: t("sales.quote.hideTotalOnly"),
    },
    { value: ShowPricesEnum.HidePrices, text: t("sales.quote.hideAllPrices") },
  ];

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
    setDetailsView(quoteStateValue?.showDetails);
    setShowPrices(quoteStateValue?.showPrices);
    setShowGraphics(quoteStateValue?.isShowGraphicsItems);
    setShowDelivery(quoteStateValue?.isShowDeliveryItems);
    setHideItemDiscountColumn(quoteStateValue?.hideItemDiscountColumn);
  }, [
    quoteStateValue?.showDetails,
    quoteStateValue?.showPrices,
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
    CheckPreferenceValue,
    showDetailsOptions,
    showPricesOptions,
    setShowPrices,
    setDetailsView,
    showPrices,
    detailsView,
    isUpdateShowPrices,
    setIsUpdateShowPrices,
    onBlurShowPrices,
    isUpdateShowDetails,
    setIsUpdateShowDetails,
    onBlurShowDetails,
  };
};

export { useSttingsQuoteMenu };
