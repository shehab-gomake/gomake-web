import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

import { useQuoteWidget } from "@/pages-components/admin/home/widgets/quote-widget/use-quote-widget";
import { materialsCategoriesState } from "@/store/material-categories";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { getAndSetProductById } from "@/services/hooks";
import { isLoadgingState } from "@/store";
import { useMaterials } from "../use-materials";
import { digitslPriceState } from "./store";
import { useRenderParameterTypes } from "./use-render-parameter-type";
import { useDigitalOffsetPriceEffects } from "./use-digital-offset-price.-effects";

interface IParameter {
  parameterId: string;
  subSectionId: string;
  sectionId: string;
  ParameterType: string;
  parameterName: string;
  actionId: string;
  data: Record<string, unknown>;
  subSectionType?: string;
  index: number;
}

const useDigitalOffsetPrice = ({ clasess }) => {
  const { navigate } = useGomakeRouter();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const router = useRouter();

  const { clientTypesValue, renderOptions, checkWhatRenderArray } =
    useQuoteWidget();
  const { allMaterials } = useMaterials();

  const [isRequiredParameters, setIsRequiredParameters] = useState<any>([]);
  const [generalParameters, setGeneralParameters] = useState<any>([]);
  const [chooseShapeOpen, setChooseShapeOpen] = useState(false);
  const [defaultPrice, setDefaultPrice] = useState<any>(30);
  const [makeShapeOpen, setMakeShapeOpen] = useState(false);
  const [template, setTemplate] = useState<any>([]);
  const [urgentOrder, setUrgentOrder] = useState(false);
  const [printingNotes, setPrintingNotes] = useState("");
  const [graphicNotes, setGraphicNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [subProducts, setSubProducts] = useState<any>([]);
  const [clientDefaultValue, setClientDefaultValue] = useState<any>({});
  const [clientTypeDefaultValue, setClientTypeDefaultValue] = useState<any>({});
  const [expanded, setExpanded] = useState<string | false>("panel_0");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Production");
  const [pricingDefaultValue, setPricingDefaultValue] = useState<any>();

  const materialsEnumsValues = useRecoilValue(materialsCategoriesState);
  const setLoading = useSetRecoilState(isLoadgingState);
  const [digitalPriceData, setDigidatPriceData] =
    useRecoilState<any>(digitslPriceState);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  const _getParameter = (parameter: any, subSection: any, section: any) => {
    if (subSection?.type) {
      const allParameters = subProducts.flatMap((item) => item.parameters);
      let temp = [...allParameters];
      const index = temp.findIndex(
        (item) =>
          item?.parameterId === parameter?.id &&
          item?.sectionId === section?.id &&
          item?.subSectionId === subSection?.id
      );

      return temp[index];
    } else {
      let temp = [...generalParameters];
      const index = temp.findIndex(
        (item) =>
          item.parameterId === parameter?.id &&
          item.sectionId === section?.id &&
          item.subSectionId === subSection?.id
      );

      return temp[index];
    }
  };

  const onChangeForPrice = ({
    parameterId,
    subSectionId,
    sectionId,
    ParameterType,
    parameterName,
    actionId,
    data,
    index,
  }: IParameter) => {
    setGeneralParameters((prev) => {
      let temp = [...prev];

      if (index !== -1) {
        temp[index] = {
          ...temp[index],
          ...data,
        };
      } else {
        temp.push({
          parameterId: parameterId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          ParameterType: ParameterType,
          parameterName: parameterName,
          actionId: actionId,
          ...data,
        });
      }

      return temp;
    });
  };
  const onChangeSubProductsForPrice = ({
    parameterId,
    subSectionId,
    sectionId,
    ParameterType,
    parameterName,
    actionId,
    data,
    subSectionType,
    index,
  }: IParameter) => {
    const targetSubProduct = subProducts.find(
      (item) => item.type === subSectionType
    );
    if (targetSubProduct) {
      let temp = [...targetSubProduct.parameters];
      if (index !== -1) {
        temp[index] = {
          ...temp[index],
          ...data,
        };
      } else {
        temp.push({
          parameterId: parameterId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          ParameterType: ParameterType,
          parameterName: parameterName,
          actionId: actionId,
          ...data,
        });
      }
      let temp2 = [...subProducts];
      const index2 = subProducts.findIndex(
        (item) => item.type === subSectionType
      );
      (temp2[index2] = {
        type: subSectionType,
        parameters: temp,
      }),
        setSubProducts(temp2);
    } else {
      let temp = [];
      if (index !== -1) {
        temp[index] = {
          ...temp[index],
          ...data,
        };
      } else {
        temp.push({
          parameterId: parameterId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          ParameterType: ParameterType,
          parameterName: parameterName,
          actionId: actionId,
          ...data,
        });
      }
      setSubProducts([
        ...subProducts,
        {
          type: subSectionType,
          parameters: temp,
        },
      ]);
    }
  };
  const onCloseMakeShape = () => {
    setMakeShapeOpen(false);
  };
  const onCloseChooseShape = () => {
    setChooseShapeOpen(false);
  };
  const onOpeneMakeShape = () => {
    setMakeShapeOpen(true);
  };
  const onOpeneChooseShape = () => {
    setChooseShapeOpen(true);
  };
  const handleTabClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };
  const handleNextClick = () => {
    if (activeIndex < template.sections.length) {
      setActiveIndex(activeIndex + 1);
    }
  };
  const handlePreviousClick = () => {
    if (activeIndex != 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const onClickProductionTab = () => {
    setActiveTab("Production");
  };
  const onClickGraphicDesignTab = () => {
    setActiveTab("Graphic design");
  };
  const tabs = [
    {
      name: "Production",
      onclick: () => onClickProductionTab,
    },
    {
      name: "Graphic design",
      onclick: () => onClickGraphicDesignTab,
    },
  ];

  const getProductById = useCallback(async () => {
    await getAndSetProductById(callApi, setTemplate, {
      Id: router?.query?.productId,
    });
  }, [router]);

  const validateParameters = (inputArray) => {
    let isValid = true;
    const allParameters = subProducts.flatMap((item) => item.parameters);
    for (const item of inputArray) {
      const index = [...generalParameters, ...allParameters].findIndex(
        (par) => par.parameterId === item.id && par?.value?.length
      );
      if (index == -1) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };
  const calculationProduct = useCallback(async () => {
    let checkParameter = validateParameters(isRequiredParameters);
    if (!!checkParameter) {
      setLoading(true);
      const res = await callApi(
        "POST",
        `/v1/calculation-service/calculations/calculate-product`,
        {
          clientId: router?.query?.customerId,
          clientTypeId: router?.query?.clientTypeId,
          productId: router?.query?.productId,
          generalParameters: generalParameters,
          subProducts: subProducts,
        },
        false
      );
      setLoading(false);
      setPricingDefaultValue(res?.data?.data?.data?.result);
    }
  }, [generalParameters, router, isRequiredParameters, validateParameters]);

  const PricingTab = {
    id: "c66465de-95d6-4ea3-bd3f-7efe60f4cb0555",
    name: "Pricing",
    icon: "https://gomake-dev.s3.eu-west-3.amazonaws.com/25fa024c-0586-49aa-a654-ff19c59e0ff7",
    jobDetails: pricingDefaultValue?.jobDetails,
    actions: pricingDefaultValue?.actions,
    flows: pricingDefaultValue?.workFlows,
  };
  const createProfitTestCase = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/printhouse-config/profits/create-profit-test-case?systemID=2`,
      {
        clientId: router?.query?.customerId,
        clientTypeId: router?.query?.clientTypeId,
        generalParameters: generalParameters,
        productItemDTO: {
          productId: router?.query?.productId,
          details: pricingDefaultValue?.jobDetails,
          itemParmetersValues: generalParameters,
          workFlow: pricingDefaultValue?.workFlows[0],
        },
        actionId: router?.query?.actionId,
        actionProductId: router?.query?.actionProductId,
      },
      false
    );
    if (res?.success) {
      navigate(`/products/profits?actionId=${router?.query?.actionId}`);
    }
  }, [generalParameters, router, pricingDefaultValue]);
  const quantity = generalParameters?.find(
    (item) => item?.parameterId === "4991945c-5e07-4773-8f11-2e3483b70b53"
  );
  const addItemForQuotes = useCallback(async () => {
    const res = await callApi("POST", `/v1/erp-service/quote/add-item`, {
      productId: router?.query?.productId,
      userID: "a42b4834-b34f-48d8-80b1-7780bc6133a2",
      customerID: router?.query?.customerId,
      clientTypeId: router?.query?.clientTypeId,
      unitPrice:
        pricingDefaultValue?.workFlows[0]?.totalPrice / quantity?.value,
      amount: quantity?.value,
      isNeedGraphics: false,
      isUrgentWork: urgentOrder,
      printingNotes,
      graphicNotes,
      isNeedExample: false,
      itemParmetersValues: generalParameters,
      workFlow: pricingDefaultValue?.workFlows[0],
    });
    if (res?.success) {
      navigate("/quote");
    }
  }, [
    generalParameters,
    router,
    pricingDefaultValue,
    quantity,
    urgentOrder,
    graphicNotes,
    printingNotes,
  ]);
  const navigateForRouter = () => {
    let checkParameter = validateParameters(isRequiredParameters);
    if (!!checkParameter) {
      setErrorMsg("");
      if (router?.query?.actionId) {
        createProfitTestCase();
      } else {
        addItemForQuotes();
      }
    } else {
      setErrorMsg("Please enter all required parameters");
    }
  };
  const {} = useDigitalOffsetPriceEffects({
    template,
    isRequiredParameters,
    materialsEnumsValues,
    generalParameters,
    router,
    clientTypesValue,
    clientDefaultValue,
    clientTypeDefaultValue,
    getProductById,
    calculationProduct,
    renderOptions,
    setClientTypeDefaultValue,
    setClientDefaultValue,
    setGeneralParameters,
    setIsRequiredParameters,
    setSubProducts,
  });
  const { _renderParameterType } = useRenderParameterTypes({
    clasess,
    subProducts,
    allMaterials,
    materialsEnumsValues,
    digitalPriceData,
    generalParameters,
    onChangeSubProductsForPrice,
    setGeneralParameters,
    onOpeneChooseShape,
    setDigidatPriceData,
    onChangeForPrice,
  });
  return {
    t,
    handleTabClick,
    handleNextClick,
    handlePreviousClick,
    onOpeneChooseShape,
    onOpeneMakeShape,
    onCloseChooseShape,
    onCloseMakeShape,
    setDefaultPrice,
    onChangeForPrice,
    handleChange,
    _renderParameterType,
    _getParameter,
    createProfitTestCase,
    renderOptions,
    checkWhatRenderArray,
    navigate,
    navigateForRouter,
    setUrgentOrder,
    setPrintingNotes,
    setGraphicNotes,
    graphicNotes,
    printingNotes,
    urgentOrder,
    defaultPrice,
    makeShapeOpen,
    chooseShapeOpen,
    activeIndex,
    template,
    tabs,
    activeTab,
    PricingTab,
    expanded,
    clientDefaultValue,
    clientTypeDefaultValue,
    clientTypesValue,
    pricingDefaultValue,
    errorMsg,
  };
};

export { useDigitalOffsetPrice };
