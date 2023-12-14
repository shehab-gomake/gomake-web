import {AddIcon, AddNewIcon, AddPlusIcon, FinishingIcon, PricingIcon, PrintingDetailsIcon, RemoveIcon} from "@/icons";
import { _renderActiveIcon, _renderUnActiveIcon } from "@/utils/constants";
import { DoneIcon } from "@/widgets";
import {OptionsButton} from "@/components/options-button/options-button";
import {Divider, MenuItem} from "@mui/material";
import {DuplicateIcon} from "@/components/icons/duplicate-icon";
import {DeleteIcon} from "@/components/icons/delete-icon";
import {useStyle} from "@/components/containers/machines-container/side-list/style";
import {useTranslation} from "react-i18next";
import cloneDeep from "lodash.clonedeep";
import {v4 as uuidv4} from 'uuid';

const TabsMappingWidget = ({
  clasess,
  index,
  handleTabClick,
  activeIndex,
  item, 
  productTemplate,
  setProductTemplate
}: any) => {
    //const [template, setTemplate] = useRecoilState<any>(productTemplateState);
    const {classes} = useStyle();
    const {t} = useTranslation();
    const duplicateSection = () => {
        //const templateCopy = deepClone()
        debugger;
        let temp = cloneDeep(productTemplate);
        const section = temp.sections.find(x=>x.id === item.id);
        const sectionCopy = cloneDeep(section);
        const numberOfCopies = temp.sections.filter(x=> x.duplicatedFromSectionId === item.id).length;
        if(!numberOfCopies){
            //section.name = section.name + " 1";
            section.index = 0;
        }
        sectionCopy.index = numberOfCopies + 1;
        sectionCopy.name = sectionCopy.name + " " + (sectionCopy.index + 1);
        sectionCopy.duplicatedFromSectionId = item.id;
        sectionCopy.id = uuidv4();
        sectionCopy.subSections.forEach(sub => {
            sub.duplicatedFromSubSectionId = sub.id;
            sub.id = uuidv4();
            if(sub.type){
                sub.type = sub.type + numberOfCopies + 1;
            }
        })
        const sectionsArr = [];
        temp.sections.forEach(sec=>{
            sectionsArr.push(sec);
            if(!numberOfCopies && sec.id === item.id){
                sectionsArr.push(sectionCopy);
            }
            else if(numberOfCopies && sec.index == numberOfCopies){
                sectionsArr.push(sectionCopy);
            }
        });
        temp.sections = sectionsArr;
        setProductTemplate(temp);
    }
    const removeSection =() => {
        let temp = cloneDeep(productTemplate);
        temp.sections = temp.sections.filter(x=> x.id !== item.id)
        setProductTemplate(temp);
    }
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
          {
              item.isCanDuplicated && !item.index ? (
                  <div onClick={()=>duplicateSection()}>
                      <AddNewIcon />
                  </div>
              ): <></>
          }
          {
              item.isCanDuplicated && item.index ? (
                  <div onClick={()=>removeSection()}>
                      <RemoveIcon />
                  </div>
              ) : <></>
          }
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
