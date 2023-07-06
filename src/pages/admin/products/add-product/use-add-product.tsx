import { useGomakeAxios } from "@/hooks";
import { useTranslation } from "react-i18next";
import { DoneIcon } from "./icons/done";
import { useState } from "react";
import { PricingIcon } from "./icons/pricing";
import { FinishingIcon } from "./icons/finishing";
import { PrintingDetails } from "./icons/printing-details";
import { CustomerIcon } from "./icons/customer-details";

const useDigitalOffsetPrice = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const handleTabClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };
  const handleNextClick = () => {
    if (activeIndex < template[0]?.sections?.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };
  const handlePreviousClick = () => {
    if (activeIndex != 0) {
      setActiveIndex(activeIndex - 1);
    }
  };
  const template: any = [
    {
      templateId: "1",
      name: "digitalPrinting",
      sections: [
        {
          key: "customer_details",
          name: "customer details",
          icon: <CustomerIcon />,
          activeIcon: <CustomerIcon />,
          doneIcon: <DoneIcon />,
          subSections: [
            {
              name: "Product category",
              parameters: [
                {
                  ParamterId: "1",
                  parameterType: "select",
                  updatedName: "Product Type",
                  isHidden: true,
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
                  parameterType: "input",
                  updatedName: "Job Name",
                  isHidden: false,
                  isRequired: false,
                  defaultValue: "AAA",
                },
                {
                  ParamterId: "3",
                  parameterType: "input",
                  updatedName: "Number of types",
                  isHidden: false,
                  isRequired: true,
                  defaultValue: "ABC",
                },
                {
                  ParamterId: "4",
                  parameterType: "input",
                  updatedName: "Quantity",
                  isHidden: false,
                  isRequired: true,
                  defaultValue: "",
                },
                {
                  ParamterId: "5",
                  parameterType: "boolean",
                  updatedName: "quantity by set",
                  isHidden: false,
                  isRequired: false,
                  IsDefault: true,
                },
              ],
            },
            {
              name: "Size & Shape",
              parameters: [
                {
                  ParamterId: "1",
                  parameterType: "select",
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
                  parameterType: "select",
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
              ],
            },
            {
              name: "Media",
              parameters: [
                {
                  ParamterId: "1",
                  parameterType: "select",
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
                  parameterType: "input",
                  updatedName: "Paper weight",
                  isHidden: false,
                  isRequired: true,
                  defaultValue: "ABC",
                },
                {
                  ParamterId: "3",
                  parameterType: "input",
                  updatedName: "Paper coating",
                  isHidden: false,
                  isRequired: true,
                  defaultValue: "",
                },
                {
                  ParamterId: "4",
                  parameterType: "select",
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
                  parameterType: "boolean",
                  updatedName: "Customer paper",
                  isHidden: false,
                  isRequired: false,
                  IsDefault: true,
                },
              ],
            },
            {
              name: "Colors",
              parameters: [
                {
                  ParamterId: "1",
                  parameterType: "select",
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
                  parameterType: "select",
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
                  parameterType: "input",
                  updatedName: "Same on sides",
                  isHidden: false,
                  isRequired: true,
                  defaultValue: "",
                },
                {
                  ParamterId: "4",
                  parameterType: "select",
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
                  parameterType: "select",
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
          key: "printing_details",
          name: "printing details",
          icon: <PrintingDetails />,
          activeIcon: <PrintingDetails stroke="#ED028C" />,
          doneIcon: <DoneIcon />,
          subSections: [
            {
              name: "Size & Shape",
              parameters: [],
            },
            {
              name: "Media",
              parameters: [],
            },
            {
              name: "Colors",
              parameters: [],
            },
          ],
        },
        {
          key: "finishing",
          name: "Finishing",
          icon: <FinishingIcon />,
          activeIcon: <FinishingIcon stroke="#ED028C" />,
          doneIcon: <DoneIcon />,
          subSections: [],
        },
        {
          key: "pricing",
          name: "Pricing",
          icon: <PricingIcon />,
          activeIcon: <PricingIcon stroke="#ED028C" />,
          doneIcon: <DoneIcon />,
          subSections: [
            {
              name: "Size & Shape",
              parameters: [],
            },
          ],
        },
      ],
    },
  ];

  return {
    t,
    handleTabClick,
    handleNextClick,
    handlePreviousClick,
    activeIndex,
    template,
  };
};

export { useDigitalOffsetPrice };
