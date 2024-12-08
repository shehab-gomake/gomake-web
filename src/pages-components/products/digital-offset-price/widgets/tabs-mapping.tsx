import { useGomakeAxios, useSnackBar } from "@/hooks";
import { AddNewIcon, RemoveIcon, WarnIcon } from "@/icons";
import { EHttpMethod } from "@/services/api-service/enums";
import { subProductsParametersState } from "@/store/general-parameters-state";
import { _renderActiveIcon, _renderUnActiveIcon } from "@/utils/constants";
import { DoneIcon } from "@/widgets";

import { Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
const TabsMappingWidget = ({
  clasess,
  index,
  handleTabClick,
  activeIndex,
  item,
  productTemplate,
  setProductTemplate,
  isAdmin,
  getProductById,
  onDuplicateSection,
  onRemoveSection,
}: any) => {
  const { callApi } = useGomakeAxios();
  const {
    alertFaultAdded,
    alertSuccessAdded,
    alertSuccessDelete,
    alertFaultDelete,
  } = useSnackBar();
  const router = useRouter();
  const { t } = useTranslation();
  const subProducts = useRecoilValue<any>(subProductsParametersState);

  const hasMissingRequiredParameters = (item) => {
    if (Array.isArray(item?.subSections)) {
      for (const subSection of item.subSections) {
        const subProduct = subProducts.find(sp => sp.type === subSection?.type) || {};
        const subProductParameters = subProduct.parameters || [];
        const subProductParameterCodes = subProductParameters.map(p => p.parameterCode);
        const subProductParameterSectionIds = subProductParameters.map(p => p.sectionId);
        const subProductParameterSubSectionIds = subProductParameters.map(p => p.subSectionId);

        if (Array.isArray(subSection?.parameters)) {
          for (const parameter of subSection.parameters) {
            if (
              parameter.isRequired &&
              !subProductParameterCodes.includes(parameter.code) &&
              subProductParameterSectionIds.includes(item.id) &&
              subProductParameterSubSectionIds.includes(subSection.id)
            ) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const duplicateSectionFunction = useCallback(
    async (item) => {
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/printhouse-config/products/duplicate-section`,
        {
          productId: router?.query?.id,
          sectionId: item?.id,
        }
      );
      if (res?.success) {
        alertSuccessAdded();
        getProductById();
      } else {
        alertFaultAdded();
      }
    },
    [router]
  );
  const deleteSection = useCallback(
    async (item: any) => {
      const res = await callApi(
        EHttpMethod.DELETE,
        `/v1/printhouse-config/products/delete-section?productId=${router?.query?.id}&&sectionId=${item?.id}`
      );
      if (res?.success) {
        alertSuccessDelete();
        getProductById();
      } else {
        alertFaultDelete();
      }
    },
    [router]
  );

  return (
    <div>
      <div
        style={clasess.tabContainer}
        key={index}
        onClick={() => handleTabClick(index)}
      >
        <div style={{ height: 24, minWidth: 24 }}>
          {index === activeIndex ? (
            _renderActiveIcon(item.icon)
          ) : index >= activeIndex ? (
            _renderUnActiveIcon(item.icon)
          ) : (
            <DoneIcon />
          )}
        </div>
        <div
          style={
            index === activeIndex
              ? clasess.tabNameActiveStyle
              : clasess.tabNameStyle
          }
        >
          {item.name}
          {!isAdmin && hasMissingRequiredParameters(item) &&
            <Tooltip title={<div style={{ fontSize: 16 }}>
              {t("products.offsetPrice.admin.missingRequiredParameters")}
              <br />
              <span style={{ fontSize: 12 }}>
                {t("products.offsetPrice.admin.missingRequiredParametersTooltip")}
              </span>
            </div>} style={{ marginTop: 5 }}>
              <span> <WarnIcon /></span>
            </Tooltip>
          }

        </div>
        {item.isCanDuplicated && !item.index && !item.isCanDeleted ? (
          <div
            onClick={() =>
              isAdmin ? duplicateSectionFunction(item) : onDuplicateSection(item)
            }
          >
            <AddNewIcon />
          </div>
        ) : null}
        {item.isCanDuplicated && item.index && !isAdmin ? (
          <div onClick={() => onRemoveSection(item)}>
            <RemoveIcon />
          </div>
        ) : (
          <></>
        )}
        {item.isCanDeleted && isAdmin ? (
          <div onClick={() => deleteSection(item)} style={{ marginTop: 5 }}>
            <RemoveIcon />
          </div>
        ) : null}
      </div>
      {index === activeIndex ? (
        <div style={clasess.selectedTabLine} />
      ) : (
        <div style={clasess.selectedTabNotLine} />
      )}
    </div>
  );
};

export { TabsMappingWidget };
