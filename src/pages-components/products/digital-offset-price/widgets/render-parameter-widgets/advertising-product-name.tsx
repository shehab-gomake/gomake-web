import { GoMakeAutoComplate, GoMakeModal, GomakeTextInput } from "@/components";
import { AddNewIcon, AdvertisingIcon } from "@/icons";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useAdvertisingProductName } from "./use-advertising-product-name";
const AdvertisingProductNameParameterWidget = ({
  parameter,
  clasess,
  index,
  temp,
  onChangeSubProductsForPrice,
  subSection,
  section,
}: any) => {

  const {
    defaultObject,
    openModal,
    newCategory,
    setOpenModal,
    setNewCategory,
    onAddCategory,
    _renderSomeValues,
    t,
    createNewTemplate,
    searchResult,
    category
  } = useAdvertisingProductName({ parameter })
  return (
    <div style={clasess.advertisingProductNameMain}>
      <GoMakeAutoComplate
        options={parameter?.code === "DiecutType"
          ? [{ id: "new", updateName: t("products.offsetPrice.admin.creatingNewCategory") }, ...parameter?.valuesConfigs?.filter(value => {
            return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
          })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)]
          : parameter?.code === "DieCutter"
            ? [
              { id: "add_new", updateName: t("products.offsetPrice.admin.addNewDieCut"), type: "add" },
              { id: "generate_new", updateName: t("products.offsetPrice.admin.generateNewDieCut"), type: "generate" },
              ...parameter?.valuesConfigs?.filter(value => {
                return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
              })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)
            ]
            : parameter?.valuesConfigs?.filter(value => {
              return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
            })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)
        }
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
          console.log("option", option)
          const image = option.additionalAttribute?.find(
            (attr) => attr.valueId === 'image'
          )?.value;

          // Special handling for DiecutType's first item
          if (parameter.code === "DiecutType" && option.id === "new") {
            return (
              <li {...props}
                onClick={() => setOpenModal(true)}
                style={{
                  backgroundColor: '#2E3092',
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start"
                }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start"
                  }}>
                  <AddNewIcon color="white" />
                </div>
                {option.updateName}
              </li>
            );
          }

          // Special handling for DieCutter's new options
          if (parameter.code === "DieCutter" && (option.id === "add_new" || option.id === "generate_new")) {
            return (
              <li {...props}
                onClick={() => {
                  if (option.id === "add_new") {
                    window.open(`/materials/${parameter?.materialPath[0]}?materialCategory=${category}`, "_blank");
                  } else {
                    createNewTemplate()
                  }
                }}
                style={{
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
      <GoMakeModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        modalTitle={t("materials.buttons.addNew")}
        insideStyle={{ width: 400, height: "fit-content", padding: 20 }}
      >
        <Stack gap={5} justifyContent={'flex-start'} height={'100%'} width={'90%'} margin={'auto'} marginTop={"20px"}>
          <GomakeTextInput
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder={t("materials.inputs.addCategory")}
            style={{ width: '100%', height: "40px" }}
          />
          {
            <SecondaryButton
              onClick={onAddCategory}
              variant={'contained'}
              sx={{ width: '100%' }}
            >
              {t("materials.buttons.addNew")}
            </SecondaryButton>
          }
        </Stack>
      </GoMakeModal>
    </div>
  );
};

export { AdvertisingProductNameParameterWidget };
