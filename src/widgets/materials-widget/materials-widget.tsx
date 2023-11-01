import {SideBarContainer} from "@/components/containers/side-bar-container";
import {SideList} from "@/widgets/machines/components/side-list/side-list";
import {PrimaryTable} from "@/components/tables/primary-table";
import {useMaterials} from "@/widgets/materials-widget/use-materials";
import React, {useEffect} from "react";
import Stack from "@mui/material/Stack";
import {useTranslation} from "react-i18next";
import {useStyle} from "@/widgets/materials-widget/style";
import {FiltersActionsBar} from "@/widgets/materials-widget/components/filters/filters-actions-bar";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {openAddSupplierModalState, selectedSupplierIdState} from "@/widgets/materials-widget/state";
import {AddSupplierModal} from "@/widgets/materials-widget/components/add-supplier/add-supplier-modal";


const MaterialsWidget = () => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const setOpenAddSupplierModal = useSetRecoilState(openAddSupplierModalState);
    const supplierId = useRecoilValue(selectedSupplierIdState)

    const {
        materialCategory,
        materialType,
        materialsCategoriesList,
        onSelectCategory,
        tableHeaders,
        tableRows,
        getCurrenciesApi,
        getMaterialCategories,
        getMaterialCategoryData,
        getMaterialTableHeaders,
        getPrintHouseMaterialCategorySuppliers,
        materialCategoryData,
        replace,
        materialCategories
    } = useMaterials();
    const Side = () => <SideList list={materialsCategoriesList()} selectedItem={materialCategory?.toString()}
                                 onSelect={onSelectCategory}
                                 title={'choose category'}/>

    useEffect(() => {
        if (materialType && materialCategories.length > 0) {
            if (!materialCategory || !materialCategories.some(category => category.categoryKey === materialCategory)) {
                replace({
                    pathname: materialType.toString(),
                    query: {materialCategory: materialCategories[0].categoryKey}
                })
            }
        }
    }, [materialCategories, materialCategory, materialType])

    useEffect(() => {
        getCurrenciesApi().then()
    }, [])

    useEffect(() => {
        getMaterialCategories(materialType).then();
        getMaterialTableHeaders(materialType?.toString()).then();
    }, [materialType]);

    useEffect(() => {
        if (!!materialType && !!materialCategory) {
            if (supplierId) {
                getMaterialCategoryData(materialType?.toString(), materialCategory?.toString(), supplierId).then()
            } else {
                getPrintHouseMaterialCategorySuppliers(materialType?.toString(), materialCategory?.toString()).then();
            }
        }
    }, [materialType, materialCategory, supplierId])

    return (
        <>
            <SideBarContainer side={Side()} header={materialType?.toString()} subHeader={''}>
                {materialCategory && <Stack gap={2}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'flex-start'}>

                        <h4 style={classes.subHeader}>{materialCategory?.toString()}</h4>
                        <FiltersActionsBar/>

                    </Stack>
                    {
                        materialCategoryData.length > 0 ?
                            <PrimaryTable rows={tableRows} headers={tableHeaders()}/> :
                           !supplierId && <div style={classes.noData}>
                                {t("materials.sheetPaper.supplierAddedSheetYet")}
                                <span
                                    style={classes.noDataSpan}
                                    onClick={() => {
                                        setOpenAddSupplierModal(true)
                                    }}
                                >
                      {t("materials.sheetPaper.pleaseAddNow")}
                    </span>
                            </div>
                    }
                </Stack>}
                <AddSupplierModal/>
            </SideBarContainer>
        </>
    );
}

export {MaterialsWidget};