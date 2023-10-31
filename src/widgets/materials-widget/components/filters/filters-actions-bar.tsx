import {GoMakeAutoComplate, SecondSwitch} from "@/components";
import {ActionMenu} from "@/widgets/materials-widget/components/actions-menu/action-menu";
import Stack from "@mui/material/Stack";
import React  from "react";
import {useTranslation} from "react-i18next";
import {useMaterialFilters} from "@/widgets/materials-widget/components/filters/use-material-filters";
import Button from "@mui/material/Button";
import {Paper} from "@mui/material";
import {useSetRecoilState} from "recoil";
import {openAddSupplierModalState} from "@/widgets/materials-widget/state";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const FiltersActionsBar = () => {
    const {t} = useTranslation();
    const setOpenAddSupplierModal = useSetRecoilState(openAddSupplierModalState);
    const {primaryColor, secondColor} = useGomakeTheme();

    const {onActiveFilterChange, activeFilterLabel, activeFilterOptions, materialSuppliers, supplierId, onSelectSupplier, onSetDefaultSupplier, getFilters, onChange} = useMaterialFilters();
    return (
        <Stack direction={'row'} gap={2} alignItems={'center'}>
            {
                getFilters().map(({key, options}) => {
                    return <GoMakeAutoComplate onChange={(e, v) => onChange(v?.value ? {value: v.value, key: key} : null)}
                                               style={{width: '200px'}}
                                               options={options}
                                               placeholder={key}
                    />
                })
            }
            <GoMakeAutoComplate
                style={{width: '200px'}}
                options={activeFilterOptions}
                value={activeFilterLabel()}
                onChange={(e: any, value: any) => onActiveFilterChange(value?.value)}
                disableClearable={true}
            />
            <GoMakeAutoComplate
                style={{width: '300px'}}
                options={materialSuppliers}
                placeholder={t("materials.sheetPaper.selectSupplier")}
                onChange={(e: any, value: any) => {
                    onSelectSupplier(value.value);
                }}
                value={supplierId}
                disableClearable={true}
                renderOption={(props: any, option: any) => {
                    return (
                       <Stack direction={'row'}>
                            <div {...props} style={{ width: "100%" }}>
                                {option.label}
                            </div>
                            <div>
                                <SecondSwitch
                                    checked={option?.isDefault}
                                    onChange={() => {
                                        onSetDefaultSupplier(option.value).then()
                                    }}
                                />
                            </div>
                        </Stack>
                    )
                }}
                PaperComponent={(props) => {
                    return <Paper elevation={8} {...props} >
                        {props?.children}
                        <Button sx={{
                            width: "100%",
                            backgroundColor: primaryColor(10),
                            color: secondColor(500),
                            ...FONT_FAMILY.Lexend(500, 16),
                        }} onMouseDown={() => {
                            setOpenAddSupplierModal(true)
                        }}>
                            {t("materials.sheetPaper.addNewSupplier")}
                        </Button>
                    </Paper>;
                }}
            />
            <ActionMenu/>
        </Stack>
    )
}
export {FiltersActionsBar}