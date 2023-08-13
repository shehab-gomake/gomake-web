import { useGomakeAxios } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { getAndSetProductById } from "@/services/hooks";
import { useRouter } from "next/router";

const useDigitalOffsetPrice = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [defaultPrice, setDefaultPrice] = useState<any>(30);
  const [makeShapeOpen, setMakeShapeOpen] = useState(false);
  const [chooseShapeOpen, setChooseShapeOpen] = useState(false);
  const [template, setTemplate] = useState<any>([]);
  const [priceTemplate, setPriceTemplate] = useState<any>([]);

  // useEffect(() => {
  //   if (template?.sections?.length > 0) {
  //     let tempMockData: any = [...template?.sections];
  //     let temp = [...priceTemplate];
  //     tempMockData?.map((section, i) => {
  //       return section?.subSections?.map((subSection, i) => {
  //         return subSection.parameters?.map((parameter, i) => {
  //           const index = temp.findIndex(
  //             (item) =>
  //               item.parameterId === parameter?.id &&
  //               item.sectionId === section?.id &&
  //               item.subSectionId === subSection?.id
  //           );
  //           if (index !== -1) {
  //             temp[index] = {
  //               ...temp[index],
  //             };
  //           } else {
  //             temp.push({
  //               parameterId: parameter?.id,
  //               sectionId: section?.id,
  //               subSectionId: subSection?.id,
  //               parameterType: parameter?.parameterType,
  //               actionId: parameter?.actionId,
  //               // ...data,
  //             });
  //           }
  //         });
  //       });
  //     });
  //     setPriceTemplate(temp);
  //   }
  // }, [template]);

  const onChangeForPrice = (
    parameterId: any,
    subSectionId: any,
    sectionId: any,
    ParameterType: any,
    data: any
  ) => {
    let temp = [...priceTemplate];
    const index = temp.findIndex(
      (item) =>
        item.parameterId === parameterId &&
        item.sectionId === sectionId &&
        item.subSectionId === subSectionId
    );

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
        ...data,
      });
    }
    setPriceTemplate(temp);
  };
  const router = useRouter();
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
  const [activeIndex, setActiveIndex] = useState(0);
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

  const [activeTab, setActiveTab] = useState("Production");
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

  useEffect(() => {
    getProductById();
  }, [router]);
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
    defaultPrice,
    makeShapeOpen,
    chooseShapeOpen,
    activeIndex,
    template,
    tabs,
    activeTab,
  };
};

export { useDigitalOffsetPrice };
