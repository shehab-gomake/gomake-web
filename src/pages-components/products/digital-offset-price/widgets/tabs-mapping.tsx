import { useGomakeAxios, useSnackBar } from "@/hooks";
import { AddNewIcon, EditIcon, RemoveIcon, WarnIcon, WastebasketNew2 } from "@/icons";
import { EHttpMethod } from "@/services/api-service/enums";
import { subProductsParametersState } from "@/store/general-parameters-state";
import { _renderActiveIcon, _renderUnActiveIcon } from "@/utils/constants";
import { DoneIcon } from "@/widgets";

import { Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { EWidgetProductType } from "../enums";
import { updateProductSectionNameApi } from "@/services/api-service/products/product-endpoints";
const TabsMappingWidget = ({
  classes,
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
  widgetType,
}: any) => {
  const { callApi } = useGomakeAxios();
  const {
    alertFaultAdded,
    alertSuccessAdded,
    alertSuccessDelete,
    alertFaultDelete,
    alertSuccessUpdate,
    alertFaultUpdate

  } = useSnackBar();
  const router = useRouter();
  const { t } = useTranslation();
  const subProducts = useRecoilValue<any>(subProductsParametersState);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const hasMissingRequiredParameters = (item2) => {
    if (!Array.isArray(item2?.subSections)) {
      return false;
    }

    for (const subSection of item2.subSections) {
      // Find matching subProduct
      const subProduct = subProducts.find((sp) => sp.type === subSection?.type);

      // Get parameters for this subSection
      const subProductParameters = subProduct?.parameters?.filter(p =>
        p.sectionId === item.id &&
        p.subSectionId === subSection.id
      ) || [];

      // Check each parameter in the subSection
      if (Array.isArray(subSection?.parameters)) {
        for (const parameter of subSection.parameters) {
          const isParameterMissing =
            parameter.isRequired &&
            !parameter.isHiddenInSetting &&
            !parameter.isHidden &&
            !subProductParameters.some(p => p.parameterCode === parameter.code);

          if (isParameterMissing) {
            return true;
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


  const handleNameUpdate = async (newName: any) => {
    const callBack = res => {
      if (res.success) {
        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    }
    await updateProductSectionNameApi(callApi, callBack, {
      productId: router?.query?.id,
      sectionId: item?.id,
      name: newName
    });
  };


  return (
    <div>
      <div
        style={classes.tabContainer}
        key={index}
        onClick={() => handleTabClick(index)}
      >
        <div style={{ height: 24, minWidth: 24 }}>
          {index === activeIndex ? (
            _renderActiveIcon(item.icon)
          ) : index >= activeIndex ? (
            !isAdmin && hasMissingRequiredParameters(item) ? (
              <Tooltip
                title={
                  <div style={{ fontSize: 16 }}>
                    {t("products.offsetPrice.admin.missingRequiredParameters")}
                    <br />
                    <span style={{ fontSize: 12 }}>
                      {t(
                        "products.offsetPrice.admin.missingRequiredParametersTooltip"
                      )}
                    </span>
                  </div>
                }
                style={{ marginTop: 5 }}
              >
                <span>
                  {" "}
                  <WarnIcon />
                </span>
              </Tooltip>
            ) : (
              _renderUnActiveIcon(item.icon)
            )
          ) : !isAdmin && hasMissingRequiredParameters(item) ? (
            <Tooltip
              title={
                <div style={{ fontSize: 16 }}>
                  {t("products.offsetPrice.admin.missingRequiredParameters")}
                  <br />
                  <span style={{ fontSize: 12 }}>
                    {t(
                      "products.offsetPrice.admin.missingRequiredParametersTooltip"
                    )}
                  </span>
                </div>
              }
              style={{ marginTop: 5 }}
            >
              <span>
                {" "}
                <WarnIcon />
              </span>
            </Tooltip>
          ) : (
            <DoneIcon />
          )}
        </div>
        <div
          style={
            index === activeIndex
              ? classes.tabNameActiveStyle
              : classes.tabNameStyle
          }
        >
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={() => {
                setIsEditing(false);
                if (editedName !== item.name) {
                  handleNameUpdate(editedName);
                }
              }}
              autoFocus
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 'inherit',
                color: 'inherit',
                width: '100%'
              }}
            />
          ) : (
            <>
              {editedName}
              {isAdmin && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  style={{ marginLeft: '8px', cursor: 'pointer' }}
                >
                  <EditIcon stroke={index === activeIndex ? "#EC038D" : "#2E3092"} />
                </span>
              )}
            </>
          )}
          {/* {item.name} */}
          {/* {!isAdmin && hasMissingRequiredParameters(item) &&
            <Tooltip title={<div style={{ fontSize: 16 }}>
              {t("products.offsetPrice.admin.missingRequiredParameters")}
              <br />
              <span style={{ fontSize: 12 }}>
                {t("products.offsetPrice.admin.missingRequiredParametersTooltip")}
              </span>
            </div>} style={{ marginTop: 5 }}>
              <span> <WarnIcon /></span>
            </Tooltip>
          } */}
        </div>
        {item.isCanDuplicated && !item.index && !item.isCanDeleted ? (
          <div
            onClick={() =>
              isAdmin
                ? duplicateSectionFunction(item)
                : onDuplicateSection(item)
            }
          >
            <AddNewIcon />
          </div>
        ) : null}
        {(item.isCanDeleted) && !isAdmin && (widgetType === EWidgetProductType.DUPLICATE || widgetType === EWidgetProductType.EDIT) ? (
          <div onClick={() => onRemoveSection(item)}>
            <WastebasketNew2 />
          </div>
        ) : (
          <></>
        )}
        {item.isCanDuplicated && item.index && !isAdmin && widgetType === EWidgetProductType.CREATE ? (
          <div onClick={() => onRemoveSection(item)}>
            <WastebasketNew2 />
          </div>
        ) : (
          <></>
        )}
        {item.isCanDeleted && isAdmin ? (
          <div onClick={() => deleteSection(item)} style={{ marginTop: 5 }}>
            <WastebasketNew2 />
          </div>
        ) : null}
      </div>
      {index === activeIndex ? (
        <div style={classes.selectedTabLine} />
      ) : (
        <div style={classes.selectedTabNotLine} />
      )}
    </div>
  );
};

export { TabsMappingWidget };
