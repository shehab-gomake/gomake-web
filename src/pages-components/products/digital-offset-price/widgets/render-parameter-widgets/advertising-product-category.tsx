import { GoMakeAutoComplate } from "@/components";
import { SearchIcon } from "@/icons";

const AdvertisingProductCategoryParameterWidget = ({
  parameter,
  clasess,
  index,
  temp,
  onChangeSubProductsForPrice,
  subSection,
  section,
}: any) => {
  const defaultObject = parameter.valuesConfigs.find(
    (item) => item.isDefault === true
  );
  console.log("parameter", parameter)
  return (
    <div style={clasess.advertisingProductCategoryMain}>
      <GoMakeAutoComplate
        options={parameter?.valuesConfigs?.filter(value => {
          return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
        })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)}
        key={parameter?.valuesConfigs + temp[index]?.values}
        style={clasess.advertisingProductCategoryAutoComplete}
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

          return (
            <li {...props}>
              {image && (
                <img
                  src={image}
                  alt={option.updateName}
                  style={{ width: '40px', height: '40px', marginRight: '10px', objectFit: 'contain' }}
                />
              )}
              {option.updateName}
            </li>
          );
        }}
      />
      <div style={clasess.advertisingProductCategorySearch}>
        <SearchIcon width={20} height={20} />
      </div>

    </div>
  );
};

export { AdvertisingProductCategoryParameterWidget };
