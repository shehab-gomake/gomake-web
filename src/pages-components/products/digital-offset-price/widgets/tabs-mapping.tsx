import { useGomakeAxios, useSnackBar } from "@/hooks";
import { AddNewIcon, RemoveIcon } from "@/icons";
import { EHttpMethod } from "@/services/api-service/enums";
import { subProductsParametersState } from "@/store/general-parameters-state";
import { _renderActiveIcon, _renderUnActiveIcon } from "@/utils/constants";
import { DoneIcon } from "@/widgets";

import { Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import EmergencyIcon from '@mui/icons-material/Error';
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
              subProductParameterSectionIds.includes(item.id) && // Ensure sectionId matches
              subProductParameterSubSectionIds.includes(subSection.id) // Ensure subSectionId matches
            ) {
              return true; // Missing required parameter found
            }
          }
        }
      }
    }
    return false; // No missing required parameters
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
          {!isAdmin && hasMissingRequiredParameters(item) && <span style={{ color: 'red', marginLeft: 5, }}>
            <Tooltip title="Missing required parameters" style={{ marginTop: 5 }}>
              <EmergencyIcon style={{ width: 18, height: 18 }} />
            </Tooltip>
          </span>}

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
