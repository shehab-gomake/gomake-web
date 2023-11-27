import {SideBarContainer} from "@/components/containers/side-container/side-bar-container";
import {SideList} from "@/components/containers/side-container/side-list/side-list";
import {PrimaryTable} from "@/components/tables/primary-table";
import {useMaterials} from "@/widgets/materials-widget/use-materials";
import React, {useEffect, useRef, useState} from "react";
import Stack from "@mui/material/Stack";
import {useTranslation} from "react-i18next";
import {useStyle} from "@/widgets/materials-widget/style";
import {FiltersActionsBar} from "@/widgets/materials-widget/components/filters/filters-actions-bar";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {
    flagState,
    openAddCategoryModalState,
    openAddSupplierModalState,
    selectedSupplierIdState
} from "@/widgets/materials-widget/state";
import {AddSupplierModal} from "@/widgets/materials-widget/components/add-supplier/add-supplier-modal";
import {PrimaryButton} from "@/components/button/primary-button";
import {SecondaryButton} from "@/components/button/secondary-button";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {convertHeightToVH} from "@/utils/adapter";
import {HEADER_HEIGHT, SCREEN_HEIGHT} from "@/utils/layout-config";
import {useGomakeRouter} from "@/hooks/use-gomake-router";
import {AddCategoryModal} from "./components/add-category/add-category-modal";
import {AddRowModal} from "./components/add-row/add-row-modal";
import {useMaterialsCategories} from "./use-materials-categories";

const MaterialsWidget = () => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const dir: 'rtl' | 'ltr' = t('direction');
    const setOpenAddSupplierModal = useSetRecoilState(openAddSupplierModalState);
    const setOpenAddCategoryModal = useSetRecoilState(openAddCategoryModalState);
    const supplierId = useRecoilValue(selectedSupplierIdState)
    const flag = useRecoilValue(flagState)
    const elementRef = useRef(null);
    const {getMaterialCategoryData} = useMaterialsCategories();

    const {
        materialCategory,
        materialType,
        materialsCategoriesList,
        onSelectCategory,
        tableHeaders,
        tableRows,
        getCurrenciesApi,
        getMaterialCategories,
        getMaterialTableHeaders,
        getPrintHouseMaterialCategorySuppliers,
        materialCategoryData,
        replace,
        materialCategories,
        downloadExcelFile,
        uploadExcelFile,
        tableHeadersNew,
        tableRowsNew
    } = useMaterials();

    const tableRowData = (materialCategories.find(category => category.categoryKey === materialCategory)?.isAddedByPrintHouse) ? tableRowsNew : tableRows;
    const tableHeadersData = (materialCategories.find(category => category.categoryKey === materialCategory)?.isAddedByPrintHouse) ? tableHeadersNew() : tableHeaders();

    const Side = () =>
        <Stack gap={'10px'} direction={'column'}>
            <SecondaryButton variant={'text'} href={'/materials'}
                             startIcon={dir === 'ltr' ? <ArrowBackIcon/> : <ArrowForwardIcon/>}
                             style={{gap: 5}}>{t("materials.buttons.back")}
            </SecondaryButton>
            <SideList list={materialsCategoriesList()} selectedItem={materialCategory?.toString()}
                      onSelect={onSelectCategory} title={'choose category'} isHaveDeleteIcon={true}>
                <Stack gap={'10px'} direction={'row'} justifyContent={'space-between'}>
                    <PrimaryButton onClick={downloadExcelFile} variant={'contained'}>Download</PrimaryButton>
                    <input ref={elementRef} onChange={uploadExcelFile} type="file" accept=".xlsx" hidden={true}/>
                    <SecondaryButton onClick={() => elementRef && elementRef.current.click()}
                                     variant={'contained'}>Upload</SecondaryButton>
                </Stack>

                <Stack direction={'row'} style={{marginTop:10}}>
                    <PrimaryButton onClick={() => setOpenAddCategoryModal(true)}
                                   variant={'contained'}>{t("materials.buttons.addNew")}</PrimaryButton>
                </Stack>
            </SideList>
        </Stack>

    useEffect(() => {
        if (materialType && materialCategories.length > 0) {
            if (!materialCategory || !materialCategories.some(category => category.categoryKey === materialCategory)) {
                replace({
                    pathname: materialType.toString(),
                    query: {materialCategory: materialCategories[0].categoryKey}
                })
            }
        }
    }, [materialCategories])

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
                getMaterialCategoryData(materialType?.toString(), materialCategory?.toString(), supplierId).then();
            } else {
                getPrintHouseMaterialCategorySuppliers(materialType?.toString(), materialCategory?.toString()).then();
            }
        }
    }, [materialType, materialCategory, supplierId])


    return (
        <div style={{maxHeight: convertHeightToVH(SCREEN_HEIGHT - HEADER_HEIGHT - 20), overflow: 'hidden'}}>
        <>
            <SideBarContainer side={Side()} header={materialType?.toString()} subHeader={''}>
                {materialCategory && <Stack gap={2}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'flex-start'}>
                        <h4 style={classes.subHeader}>{materialCategory?.toString()}</h4>
                        <FiltersActionsBar/>
                    </Stack>

                        <div style={{paddingBottom: '30px'}}><PrimaryTable rows={tableRows} headers={tableHeaders()}/></div> :
                    {materialCategoryData.length > 0 ?
                        <PrimaryTable rows={tableRowData} headers={tableHeadersData}/> :
                        (flag && materialCategories.find(category => category.categoryKey === materialCategory)?.isAddedByPrintHouse) ?
                            <PrimaryTable rows={tableRowsNew} headers={tableHeadersNew()}/>
                            :
                            <div style={classes.noData}>
                                {t("materials.sheetPaper.supplierAddedSheetYet")}
                                <span
                                    style={classes.noDataSpan}
                                    onClick={() => {
                                        setOpenAddSupplierModal(true)
                                    }}>
                                    {t("materials.sheetPaper.pleaseAddNow")}
                                </span>
                            </div>}
                </Stack>}
                <AddSupplierModal/>
                <AddCategoryModal/>
                <AddRowModal/>
            </SideBarContainer>
            <AddSupplierModal/>
        </div>
    );
}

export {MaterialsWidget};