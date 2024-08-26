import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { subProductsParametersState } from "@/store";
import { getCurrencySymbol } from "@/utils/helpers";

const AdvertisingProductNameParameterWidget = ({
  parameter,
  clasess,
  index,
  onChangeSubProductsForPrice,
  subSection,
  section,
}: any) => {
  const [selectedId, setSelectedId] = useState(null);

  const defaultObject = parameter.valuesConfigs.find(
    (item) => item.isDefault === true
  );
  useEffect(() => {
    if (defaultObject) {
      setSelectedId(defaultObject.id);

      // Ensure default object is set in subProducts
      const updatedSubProducts = subProducts.map((subProduct) => {
        if (subProduct.sectionId === section.id) {
          const updatedParameters = subProduct.parameters.map((param) => {
            if (param.parameterId === parameter.id) {
              return {
                ...param,
                values: [defaultObject.updateName],
                valueIds: [defaultObject.id],
              };
            }
            return param;
          });
          return {
            ...subProduct,
            parameters: updatedParameters,
          };
        }
        return subProduct;
      });

      setSubProducts(updatedSubProducts);
      onChangeSubProductsForPrice(
        parameter.id,
        subSection.id,
        section.id,
        parameter.parameterType,
        parameter.name,
        parameter.actionId,
        { valueIds: defaultObject.id, values: defaultObject.updateName },
        subSection.type,
        index,
        parameter.actionIndex,
        parameter.code
      );
    }
  }, []);
  const [subProducts, setSubProducts] = useRecoilState<any>(subProductsParametersState);

  const { t } = useTranslation();

  const handleCheckboxChange = (item, checked) => {
    if (checked) {
      const updatedSubProducts = subProducts.map((subProduct) => {
        if (subProduct.sectionId === section.id) {
          const updatedParameters = subProduct.parameters.map((param) => {
            if (param.parameterId === parameter.id) {
              return {
                ...param,
                values: [item.updateName],
                valueIds: [item.id],
              };
            }
            return param;
          });
          return {
            ...subProduct,
            parameters: updatedParameters,
          };
        }
        return subProduct;
      });

      setSubProducts(updatedSubProducts);
      setSelectedId(item.id);
      onChangeSubProductsForPrice(
        parameter.id,
        subSection.id,
        section.id,
        parameter.parameterType,
        parameter.name,
        parameter.actionId,
        { valueIds: item.id, values: item.updateName },
        subSection.type,
        index,
        parameter.actionIndex,
        parameter.code
      );
    } else {
      // Unselect value and remove from subProducts
      const updatedSubProducts = subProducts.map((subProduct) => {
        if (subProduct.sectionId === section.id) {
          const updatedParameters = subProduct.parameters.filter(
            (param) => param.parameterId !== parameter.id
          );
          return {
            ...subProduct,
            parameters: updatedParameters,
          };
        }
        return subProduct;
      });

      setSubProducts(updatedSubProducts);
      setSelectedId(null);
    }
  };

  return (
    <div style={clasess.advertisingProductNameMain}>
      <div style={clasess.advertisingProductNameListContainer}>
        {parameter?.valuesConfigs?.map((item) => {
          const additionalAttribute = item?.additionalAttribute || [];
          const attributes = additionalAttribute.reduce((acc, attr) => {
            acc[attr.valueId] = attr.value;
            return acc;
          }, {});

          const imageUrl = attributes.image;
          const width = attributes.width;
          const length = attributes.length;
          const height = attributes.height;
          const price = attributes.price;
          const isChecked = selectedId === item.id;

          return (
            <div
              style={clasess.advertisingProductCard}
              key={item.id}
              onClick={() => handleCheckboxChange(item, !isChecked)}
            >
              <img
                style={{ ...clasess.advertisingProductImg, objectFit: 'contain' }}
                src={imageUrl}
              />
              <div
                style={clasess.advertisingProductUnderImgContainer}
              >
                <div
                  style={clasess.advertisingProductNamePriceContainer}
                >
                  <div style={clasess.advertisingProductNameStyle}>
                    {item?.updateName}
                  </div>
                  <div style={clasess.advertisingProductPriceStyle}>
                    {getCurrencySymbol(item?.currency)} {price}
                  </div>
                </div>
                <div>
                  <div style={clasess.advertisingProductUnitsStyle}>
                    {width}*{length}*{height}
                  </div>
                </div>
              </div>
              <div
                style={clasess.checkBoxContainer}
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  onChange={(e, checked) => handleCheckboxChange(item, checked)}
                  icon={<CheckboxIcon />}
                  checkedIcon={<CheckboxCheckedIcon />}
                  checked={isChecked}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { AdvertisingProductNameParameterWidget };
