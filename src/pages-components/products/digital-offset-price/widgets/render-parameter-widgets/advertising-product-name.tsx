import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";

const AdvertisingProductNameParameterWidget = ({
  parameter,
  clasess,
  index,
  temp,
  onChangeSubProductsForPrice,
  subSection,
  section,
  selectedValueConfig,
  inModal,
  setSelectedValueConfig,
  onOpeneMultiParameterModal,
  subSectionParameters,
  list,

}: any) => {
  const defaultObject = parameter.valuesConfigs.find(
    (item) => item.isDefault === true
  );
  console.log("parameter", parameter)

  const { t } = useTranslation()

  return (
    <div style={{ minWidth: 1000, width: "100%", }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        {parameter?.valuesConfigs?.map((item) => {
          return (
            <div style={{ width: 165, height: 160, position: "relative", borderRadius: 6, background: "#FFF" }}>
              <img style={{ width: 165, height: 100, borderTopRightRadius: 6, borderTopLeftRadius: 6 }} src={item?.url} />
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", padding: 12, gap: 6, height: 54 }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                  <div style={{ ...FONT_FAMILY.Lexend(600, 10) }}>{item?.updateName}</div>
                  <div style={{ ...FONT_FAMILY.Lexend(600, 10), color: "#ED028C" }}>₪124</div>
                </div>
                <div>
                  <div style={{ ...FONT_FAMILY.Lexend(500, 10), color: "#727272" }}>10*16*20</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
    // <div data-tour={parameter?.id} style={clasess.dropDownListWithSettingIcon}>
    //   <GoMakeAutoComplate
    //     options={parameter?.valuesConfigs?.filter(value => {
    //       return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
    //     })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)}
    //     key={parameter?.valuesConfigs + temp[index]?.values}
    //     placeholder={parameter.name}
    //     style={clasess.dropDownListStyle}
    //     getOptionLabel={(option: any) => option.updateName}
    //     defaultValue={
    //       index !== -1 ? { updateName: temp[index].values } : defaultObject
    //     }
    //     disabled={parameter?.isLock ? parameter?.isLock : false}
    //     onChange={(e: any, value: any) => {
    //       if (parameter?.code === "devicecategory") {
    //         setDeviceCategory(value?.id)
    //       }
    //       else if (parameter?.code === "devicesize") {
    //         setDeviceSize(value?.id)
    //       }
    //       onChangeSubProductsForPrice(
    //         parameter?.id,
    //         subSection?.id,
    //         section?.id,
    //         parameter?.parameterType,
    //         parameter?.name,
    //         parameter?.actionId,
    //         { valueIds: value?.id, values: value?.updateName },
    //         subSection?.type,
    //         index,
    //         parameter?.actionIndex,
    //         parameter?.code
    //       );
    //     }}
    //   />
    //   {parameter?.setSettingIcon && inModal && (
    //     <div
    //       style={{ cursor: "pointer" }}
    //       onClick={() => {
    //         setSelectedValueConfig(parameter?.valuesConfigs);
    //         onOpeneMultiParameterModal(
    //           parameter,
    //           subSection,
    //           section,
    //           subSectionParameters,
    //           list
    //         );
    //       }}
    //     >
    //       <SettingsIcon
    //         stroke={"rgba(237, 2, 140, 1)"}
    //         width={24}
    //         height={24}
    //       />
    //     </div>
    //   )}
    // </div>
  );
};

export { AdvertisingProductNameParameterWidget };
