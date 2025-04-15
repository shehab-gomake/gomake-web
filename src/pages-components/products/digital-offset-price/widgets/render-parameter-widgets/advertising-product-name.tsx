import { GoMakeAutoComplate } from "@/components";
import { AddIcon, AddNewIcon, AdvertisingIcon, PlusIcon } from "@/icons";
import { useRecoilState } from "recoil";
import { subProductsParametersState } from "@/store/general-parameters-state";
import { useEffect } from "react";

const AdvertisingProductNameParameterWidget = ({
  parameter,
  clasess,
  index,
  temp,
  onChangeSubProductsForPrice,
  subSection,
  section,
}: any) => {
  console.log("parameter", parameter)
  const [subProducts, setSubProducts] = useRecoilState<any>(subProductsParametersState);

  const defaultObject = parameter.valuesConfigs.find(
    (item) => item.isDefault === true
  );

  const _renderSomeValues = (value: any) => {
    const additionalAttribute = value?.additionalAttribute || [];
    const attributes = additionalAttribute.reduce((acc, attr) => {
      acc[attr.valueId] = attr.value;
      return acc;
    }, {});

    const width = attributes.width;
    const length = attributes.length;
    const height = attributes.height;
    return `${width} * ${length} * ${height}`
  }
  const getParameterByCode = (subProducts, code) => {
    for (let subProduct of subProducts) {
      for (let parameter of subProduct.parameters) {
        if (parameter.parameterCode === code) {
          return parameter;
        }
      }
    }
    return null;
  };
  const AdvertisingCategory = getParameterByCode(subProducts, "AdvertisingProductCategory");
  const removeAdvertisingProductName = (subProducts) => {
    return subProducts.map(subProduct => {
      return {
        ...subProduct,
        parameters: subProduct.parameters.filter(parameter => parameter.parameterCode !== "AdvertisingProductName")
      };
    });
  };

  useEffect(() => {
    if (!AdvertisingCategory) {
      setSubProducts(removeAdvertisingProductName(subProducts));
    }
  }, [AdvertisingCategory]);

  return (
    <div style={clasess.advertisingProductNameMain}>
      <GoMakeAutoComplate
        options={parameter?.code === "DiecutType"
          ? [{ id: "new", updateName: "creating new category" }, ...parameter?.valuesConfigs?.filter(value => {
            return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
          })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)]
          : parameter?.code === "DieCutter"
            ? [
              { id: "add_new", updateName: "add new die cut", type: "add" },
              { id: "generate_new", updateName: "generate new die cut", type: "generate" },
              ...parameter?.valuesConfigs?.filter(value => {
                return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
              })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)
            ]
            : parameter?.valuesConfigs?.filter(value => {
              return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
            })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)
        }
        // options={parameter?.valuesConfigs?.filter(value => {
        //   return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
        // })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)}
        key={parameter?.valuesConfigs + temp[index]?.values}
        style={parameter?.isRequired && !temp[index]?.values ? clasess.requiredAdvertisingProductCategoryAutoComplete : clasess.advertisingProductCategoryAutoComplete}
        placeholder={parameter?.name}
        onChange={(e: any, value: any) => {
          onChangeSubProductsForPrice(
            parameter?.id,
            subSection?.id,
            section?.id,
            parameter?.parameterType,
            parameter?.name,
            parameter?.actionId,
            { valueIds: value?.id, values: value?.updateName },
            subSection?.type,
            index,
            parameter?.actionIndex,
            parameter?.code
          );
        }}
        getOptionLabel={(option: any) => option.updateName}
        defaultValue={
          index !== -1 ? { updateName: temp[index].values } : defaultObject
        }
        disabled={parameter?.isLock ? parameter?.isLock : false}
        renderOption={(props, option) => {
          const image = option.additionalAttribute?.find(
            (attr) => attr.valueId === 'image'
          )?.value;

          // Special handling for DiecutType's first item
          if (parameter.code === "DiecutType" && option.id === "new") {
            return (
              <li {...props} style={{ backgroundColor: '#2E3092', color: "white", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                  <AddNewIcon color="white" />
                </div>
                {option.updateName}
              </li>
            );
          }

          // Special handling for DieCutter's new options
          if (parameter.code === "DieCutter" && (option.id === "add_new" || option.id === "generate_new")) {
            return (
              <li {...props} style={{
                backgroundColor: option.id === "add_new" ? '#2E3092' : '#FF69B4',
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start"
              }}>
                <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                  <AddNewIcon color="white" />
                </div>
                {option.updateName}
              </li>
            );
          }

          // Regular rendering for other items
          return (
            <li {...props}>
              {image ? (
                <img
                  src={image}
                  alt={option.updateName}
                  style={{ width: '40px', height: '40px', margin: '10px', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ margin: 10 }}>
                  <AdvertisingIcon width="40" height="40" />
                </div>
              )}
              {option.updateName}
              {parameter.code != "DiecutType" && parameter.code != "DieCutter" && <span style={{ margin: 10, fontSize: 12, color: "#CCC" }}>({_renderSomeValues(option)})</span>}
            </li>
          );
        }}
      />
    </div>
  );
};

export { AdvertisingProductNameParameterWidget };
