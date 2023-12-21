import { useGomakeAxios, useSnackBar } from "@/hooks";
import { AddNewIcon, RemoveIcon } from "@/icons";
import { EHttpMethod } from "@/services/api-service/enums";
import { _renderActiveIcon, _renderUnActiveIcon } from "@/utils/constants";
import { DoneIcon } from "@/widgets";

import cloneDeep from "lodash.clonedeep";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

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
}: any) => {
  const { callApi } = useGomakeAxios();
  const {
    alertFaultAdded,
    alertSuccessAdded,
    alertSuccessDelete,
    alertFaultDelete,
  } = useSnackBar();
  const router = useRouter();
  const duplicateSection = () => {
    let temp = cloneDeep(productTemplate);
    const section = temp.sections.find((x) => x.id === item.id);
    const sectionCopy = cloneDeep(section);
    const numberOfCopies = temp.sections.filter(
      (x) => x.duplicatedFromSectionId === item.id
    ).length;
    if (!numberOfCopies) {
      //section.name = section.name + " 1";
      section.index = 0;
    }
    sectionCopy.index = numberOfCopies + 1;
    sectionCopy.name = sectionCopy.name + " " + (sectionCopy.index + 1);
    sectionCopy.duplicatedFromSectionId = item.id;
    sectionCopy.id = uuidv4();
    sectionCopy.subSections.forEach((sub) => {
      sub.duplicatedFromSubSectionId = sub.id;
      sub.id = uuidv4();
      if (sub.type) {
        sub.type = sub.type + numberOfCopies + 1;
      }
    });
    const sectionsArr = [];
    temp.sections.forEach((sec) => {
      sectionsArr.push(sec);
      if (!numberOfCopies && sec.id === item.id) {
        sectionsArr.push(sectionCopy);
      } else if (numberOfCopies && sec.index == numberOfCopies) {
        sectionsArr.push(sectionCopy);
      }
    });
    temp.sections = sectionsArr;
    setProductTemplate(temp);
  };
  const removeSection = () => {
    let temp = cloneDeep(productTemplate);
    temp.sections = temp.sections.filter((x) => x.id !== item.id);
    setProductTemplate(temp);
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
        </div>
        {item.isCanDuplicated && !item.index && !item.isCanDeleted ? (
          <div
            onClick={() =>
              isAdmin ? duplicateSectionFunction(item) : duplicateSection()
            }
          >
            <AddNewIcon />
          </div>
        ) : null}
        {item.isCanDuplicated && item.index ? (
          <div onClick={() => removeSection()}>
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
