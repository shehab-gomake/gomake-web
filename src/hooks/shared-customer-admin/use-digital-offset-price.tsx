import { useGomakeAxios } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { getAndSetProductById } from "@/services/hooks";
import { useRouter } from "next/router";
import {
  DoneIcon,
  FinishingIcon,
  PricingIcon,
  PrintingDetails,
} from "@/widgets";
const templateMock: any = [
  {
    templateId: "1",
    name: "digitalPrinting",
    sections: [
      {
        sectionId: "111a",
        key: "customer_details",
        name: "customer details",
        icon: <FinishingIcon />,
        activeIcon: <FinishingIcon stroke="#ED028C" />,
        doneIcon: <DoneIcon />,
        isAccordion: false,
        subSections: [
          {
            subSectionId: "222a",
            name: "Product category",
            parameters: [
              {
                ParamterId: "1",
                parameterType: 0,
                updatedName: "Product Type",
                isHidden: false,
                isRequired: true,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 3",
                    valueId: 3,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
              {
                ParamterId: "2",
                parameterType: 2,
                updatedName: "Job Name",
                isHidden: false,
                isRequired: false,
                defaultValue: "AAA",
              },
              {
                ParamterId: "3",
                parameterType: 2,
                updatedName: "Number of types",
                isHidden: false,
                isRequired: true,
                defaultValue: "ABC",
              },
              {
                ParamterId: "4",
                parameterType: 2,
                updatedName: "Quantity",
                isHidden: false,
                isRequired: true,
                defaultValue: "",
              },
              {
                ParamterId: "5",
                parameterType: 3,
                updatedName: "quantity by set",
                isHidden: false,
                isRequired: false,
                IsDefault: true,
              },
            ],
          },
          {
            subSectionId: "222b",
            name: "Size & Shape",
            parameters: [
              {
                ParamterId: "1",
                parameterType: 0,
                updatedName: "Shape",
                isHidden: false,
                isRequired: true,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 3",
                    valueId: 3,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
              {
                ParamterId: "2",
                parameterType: 0,
                updatedName: "Print size",
                isHidden: false,
                isRequired: true,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 3",
                    valueId: 3,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
              // {
              //   ParamterId: "3",
              //   parameterType: 4,
              //   updatedName: "Choose shape",
              //   isHidden: false,
              //   isRequired: false,
              // },
            ],
          },
          {
            subSectionId: "222c",
            name: "Media",
            parameters: [
              {
                ParamterId: "1",
                parameterType: 5,
                updatedName: "Paper Type",
                isHidden: false,
                isRequired: true,
                parentParameterId: null,
                materialPath: ["Sheets"],
              },
              {
                ParamterId: "2",
                parameterType: 5,
                updatedName: "Paper weight",
                isHidden: false,
                isRequired: true,
                parentParameterId: "1",
                materialPath: ["Sheets", "Weights"],
              },
              {
                ParamterId: "3001",
                parameterType: 5,
                updatedName: "Paper Size",
                isHidden: false,
                isRequired: true,
                parentParameterId: "2",
                materialPath: ["Sheets", "Weights", "Sizes"],
              },
              {
                ParamterId: "3",
                parameterType: 2,
                updatedName: "Paper coating",
                isHidden: false,
                isRequired: true,
                defaultValue: "",
              },
              {
                ParamterId: "4",
                parameterType: 0,
                updatedName: "Sides",
                isHidden: false,
                isRequired: false,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 3",
                    valueId: 3,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
              {
                ParamterId: "5",
                parameterType: 3,
                updatedName: "Customer paper",
                isHidden: false,
                isRequired: false,
                IsDefault: true,
              },
            ],
          },
          {
            subSectionId: "222d",
            name: "Colors",
            parameters: [
              {
                ParamterId: "1",
                parameterType: 0,
                updatedName: "Print colors",
                isHidden: false,
                isRequired: true,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
              {
                ParamterId: "2",
                parameterType: 0,
                updatedName: "Choose colors",
                isHidden: false,
                isRequired: false,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
              {
                ParamterId: "3",
                parameterType: 2,
                updatedName: "Same on sides",
                isHidden: false,
                isRequired: true,
                defaultValue: "",
              },
              {
                ParamterId: "4",
                parameterType: 0,
                updatedName: "Same on both sides",
                isHidden: false,
                isRequired: false,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
              {
                ParamterId: "5",
                parameterType: 0,
                updatedName: "Sides colors",
                isHidden: false,
                isRequired: false,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        sectionId: "111b",
        key: "printing_details",
        name: "printing details",
        icon: <PrintingDetails />,
        activeIcon: <PrintingDetails stroke="#ED028C" />,
        doneIcon: <DoneIcon />,
        isAccordion: false,
        subSections: [
          {
            subSectionId: "333a",
            name: "Size & Shape",
            parameters: [],
          },
          {
            subSectionId: "333b",
            name: "Media",
            parameters: [],
          },
          {
            subSectionId: "333c",
            name: "Colors",
            parameters: [],
          },
        ],
      },
      {
        sectionId: "111c",
        key: "finishing",
        name: "Finishing",
        icon: <FinishingIcon />,
        activeIcon: <FinishingIcon stroke="#ED028C" />,
        doneIcon: <DoneIcon />,
        isAccordion: true,
        subSections: [
          {
            subSectionId: "444a",
            name: "Product category",
            parameters: [
              {
                ParamterId: "1",
                parameterType: 0,
                updatedName: "Product Type",
                isHidden: false,
                isRequired: true,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 3",
                    valueId: 3,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
              {
                ParamterId: "2",
                parameterType: 2,
                updatedName: "Job Name",
                isHidden: false,
                isRequired: false,
                defaultValue: "AAA",
              },
              {
                ParamterId: "3",
                parameterType: 2,
                updatedName: "Number of types",
                isHidden: false,
                isRequired: true,
                defaultValue: "ABC",
              },
              {
                ParamterId: "4",
                parameterType: 2,
                updatedName: "Quantity",
                isHidden: false,
                isRequired: true,
                defaultValue: "",
              },
              {
                ParamterId: "5",
                parameterType: 3,
                updatedName: "quantity by set",
                isHidden: false,
                isRequired: false,
                IsDefault: true,
              },
            ],
          },
          {
            subSectionId: "444b",
            name: "Size & Shape",
            parameters: [
              {
                ParamterId: "1",
                parameterType: 0,
                updatedName: "Shape",
                isHidden: false,
                isRequired: true,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 3",
                    valueId: 3,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
              {
                ParamterId: "2",
                parameterType: 0,
                updatedName: "Print size",
                isHidden: false,
                isRequired: true,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 3",
                    valueId: 3,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
              {
                ParamterId: "3",
                parameterType: 4,
                updatedName: "Choose shape",
                isHidden: false,
                isRequired: false,
              },
            ],
          },
          {
            subSectionId: "444c",
            name: "Media",
            parameters: [
              {
                ParamterId: "1",
                parameterType: 0,
                updatedName: "Paper Type",
                isHidden: false,
                isRequired: true,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 3",
                    valueId: 3,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
              {
                ParamterId: "2",
                parameterType: 2,
                updatedName: "Paper weight",
                isHidden: false,
                isRequired: true,
                defaultValue: "ABC",
              },
              {
                ParamterId: "3",
                parameterType: 2,
                updatedName: "Paper coating",
                isHidden: false,
                isRequired: true,
                defaultValue: "",
              },
              {
                ParamterId: "4",
                parameterType: 0,
                updatedName: "Sides",
                isHidden: false,
                isRequired: false,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 3",
                    valueId: 3,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
              {
                ParamterId: "5",
                parameterType: 3,
                updatedName: "Customer paper",
                isHidden: false,
                isRequired: false,
                IsDefault: true,
              },
            ],
          },
          {
            subSectionId: "444d",
            name: "Colors",
            parameters: [
              {
                ParamterId: "1",
                parameterType: 0,
                updatedName: "Print colors",
                isHidden: false,
                isRequired: true,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
              {
                ParamterId: "2",
                parameterType: 0,
                updatedName: "Choose colors",
                isHidden: false,
                isRequired: false,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
              {
                ParamterId: "3",
                parameterType: 2,
                updatedName: "Same on sides",
                isHidden: false,
                isRequired: true,
                defaultValue: "",
              },
              {
                ParamterId: "4",
                parameterType: 0,
                updatedName: "Same on both sides",
                isHidden: false,
                isRequired: false,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
              {
                ParamterId: "5",
                parameterType: 0,
                updatedName: "Sides colors",
                isHidden: false,
                isRequired: false,
                valuesConfigs: [
                  {
                    updateName: "option 1",
                    valueId: 1,
                    IsDefault: true,
                    IsHidden: false,
                  },
                  {
                    updateName: "option 2",
                    valueId: 2,
                    IsDefault: false,
                    IsHidden: false,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        sectionId: "111d",
        key: "pricing",
        name: "Pricing",
        icon: <PricingIcon />,
        activeIcon: <PricingIcon stroke="#ED028C" />,
        doneIcon: <DoneIcon />,
        isAccordion: false,
        subSections: [
          {
            subSectionId: "555a",
            name: "Size & Shape",
            parameters: [],
          },
        ],
      },
    ],
  },
];
const useDigitalOffsetPrice = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [defaultPrice, setDefaultPrice] = useState<any>(30);
  const [makeShapeOpen, setMakeShapeOpen] = useState(false);
  const [chooseShapeOpen, setChooseShapeOpen] = useState(false);
  const [template, setTemplate] = useState<any>(templateMock);
  const [priceTemplate, setPriceTemplate] = useState<any>([]);
  console.log("priceTemplate", priceTemplate);

  const onChangeForPrice = (
    parId: any,
    sectionId: any,
    subSectionId: any,
    ParameterType: any,
    data: any
  ) => {
    let temp = [...priceTemplate];
    const index = temp.findIndex(
      (item) =>
        item.parId === parId &&
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
        parId: parId,
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
    if (activeIndex < template[0].sections.length - 1) {
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

  // const getProductById = useCallback(async () => {
  //   await getAndSetProductById(callApi, setTemplate, {
  //     Id: router?.query?.productId,
  //   });
  // }, [router]);

  // useEffect(() => {
  //   getProductById();
  // }, [router]);
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
