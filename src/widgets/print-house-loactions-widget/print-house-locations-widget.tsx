import Stack from "@mui/material/Stack";
import {GoMakeAutoComplate, GoMakeModal} from "@/components";
import {IconButton, Paper} from "@mui/material";
import {DeleteIcon} from "@/components/icons/delete-icon";
import {PrimaryButton} from "@/components/button/primary-button";
import React, {useEffect, useState} from "react";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {usePrintHouseLocations} from "@/widgets/print-house-loactions-widget/use-print-house-locations";
import {useTranslation} from "react-i18next";
import {AddLocation} from "@/widgets/print-house-loactions-widget/add-location";
import {FONT_FAMILY} from "@/utils/font-family";
import {DotsLoader} from "@/components/dots-loader/dots-Loader";

const PrintHouseLocationsWidget = ({onSelectLocation, selectedLocationId}) => {
    const {secondColor} = useGomakeTheme();
    const {t} = useTranslation();
    const [selectedLocationName, setSelectedLocationName] = useState<string>('');
    const {primaryColor} = useGomakeTheme();
    const {
        locations,
        onDeleteLocation,
        setOpenAddModal,
        openAddModal,
        getLocations,
        deleting
    } = usePrintHouseLocations();
    const countryList = require("country-list");
    const allCountries = countryList.getNames();
    const allCountryCodes = countryList.getCodes();
    const countriesWithCodes = allCountries.map((country, index) => ({
        text: country,
        value: allCountryCodes[index],
    }));
    useEffect(() => {
        getLocations().then();
    }, []);

    useEffect(() => {
        const selected = locations?.find(location => location.id === selectedLocationId);
        setSelectedLocationName(!!selected ? `${allCountries[allCountryCodes.indexOf(selected?.country)]} ${selected.city}-${selected.street}-${selected.streetNumber}` : '')
    }, [selectedLocationId, locations])

    return (
        <Stack gap={'10px'}>
            <h5 style={{
                color: primaryColor(900),
                ...FONT_FAMILY.Lexend(600, 14),
            }}>{t('profileSettings.location')}</h5>
            <GoMakeAutoComplate options={locations.map(location => ({
                label: `${allCountries[allCountryCodes.indexOf(location?.country)]} ${location?.city}-${location?.street}-${location?.streetNumber}`,
                value: location.id
            }))}
                                placeholder={t('profileSettings.location')}
                                renderOption={(props: any, option: any) => {
                                    return (
                                        <Stack direction={"row"} gap={'5px'} alignItems={'center'}>
                                            <div {...props} style={{width: "100%"}}>
                                                {option.label}
                                            </div>
                                            <div>
                                                {
                                                    deleting === option.value ? <DotsLoader/> :
                                                        <IconButton
                                                            onClick={() => onDeleteLocation(option?.value)}><DeleteIcon
                                                            color={secondColor(500)} height={20}
                                                            width={20}/></IconButton>
                                                }
                                            </div>
                                        </Stack>
                                    );
                                }}
                                PaperComponent={(props) => {
                                    return (
                                        <Paper elevation={8} {...props}>
                                            {props?.children}
                                            <PrimaryButton
                                                sx={{
                                                    width: 'fit-content',
                                                    minWidth: '100%',
                                                    height: '35px',
                                                    marginBottom: '5px'
                                                }}
                                                onMouseDown={() => {
                                                    setOpenAddModal(true)
                                                }}
                                            >
                                                {t('mailingSettings.addNew')}
                                            </PrimaryButton>
                                        </Paper>
                                    );
                                }}
                                style={{width: '300px'}}
                                value={{label: selectedLocationName}}
                                disableClearable={true}
                                onChange={(e, v) => {
                                    onSelectLocation(v?.value)
                                }}/>
            <GoMakeModal onClose={() => setOpenAddModal(false)} modalTitle={t('productionFloor.addGroup')}
                         openModal={openAddModal} insideStyle={{height: 'auto', width: '20%', minWidth: '800px'}}>
                <AddLocation countries={countriesWithCodes} afterAddGroup={() => setOpenAddModal(false)}/>
            </GoMakeModal>
        </Stack>
    );
}

export {PrintHouseLocationsWidget}