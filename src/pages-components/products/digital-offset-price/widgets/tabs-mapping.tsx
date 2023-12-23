import { useGomakeAxios, useSnackBar } from "@/hooks";
import { AddNewIcon, RemoveIcon } from "@/icons";
import { EHttpMethod } from "@/services/api-service/enums";
import { _renderActiveIcon, _renderUnActiveIcon } from "@/utils/constants";
import { DoneIcon } from "@/widgets";

import cloneDeep from "lodash.clonedeep";
import { useRouter } from "next/router";
import { useCallback } from "react";

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
        {item.isCanDuplicated && item.index ? (
          <div onClick={() => onRemoveSection(item)}>
            <RemoveIcon />
          </div>
        ) : (
          <></>
        )}
        {item.isCanDeleted ? (
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
