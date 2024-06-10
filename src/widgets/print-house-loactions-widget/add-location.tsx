import Stack from "@mui/material/Stack";
import {FormInput} from "@/components/form-inputs/form-input";
import {PrimaryButton} from "@/components/button/primary-button";
import {useTranslation} from "react-i18next";
import {FormInputsSectionComponent} from "@/components/form-inputs/form-inputs-section";
import {
    companyLocationInputs
} from "@/widgets/settings-profile-widget/components/profiles/inputs/company-location-inputs";
import {useState} from "react";
import {IPrintHouseLocation, printHouseLocationsState} from "@/store/print-house-locations-state";
import {IInput} from "@/components/form-inputs/interfaces";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {companyAddLocationApi} from "@/services/api-service/profiles/company-profile-api";
import {CircularProgress} from "@mui/material";
import {useRecoilState} from "recoil";

interface IProps {
    afterAddGroup: () => void;
    countries: any[];
}

const AddLocation = ({afterAddGroup, countries}: IProps) => {
    const {t} = useTranslation();
    const [state, setState] = useState<IPrintHouseLocation>({} as IPrintHouseLocation);
    const {callApi} = useGomakeAxios();
    const [loading, setLoading] = useState<boolean>(false);
    const {alertSuccessAdded, alertFaultAdded} = useSnackBar();
    const [locations, setLocations] = useRecoilState(printHouseLocationsState);

    const addNewLocation = async () => {
        const callBack = res => {
            setLoading(false)
            if (res.success) {
                alertSuccessAdded();
                setState({} as IPrintHouseLocation);
                setLocations([...locations, res.data])
                afterAddGroup();
            }else {
                alertFaultAdded();
            }
        }
        setLoading(true);
        await companyAddLocationApi(callApi, callBack, state)
    }

    const changeState = (key, value) => {
        setState(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    return (
        <Stack padding={'5px 0'} gap={'50px'}>
            <Stack direction={'row'} gap={'10px'}>
                <FormInputsSectionComponent sectionTitle={'profileSettings.location'}>
                    {
                        companyLocationInputs(state, countries).map(location =>
                            <FormInput
                                key={location.parameterKey}
                                input={location as IInput}
                                changeState={changeState}
                                error={false}
                            />)
                    }
                </FormInputsSectionComponent>
            </Stack>
            <PrimaryButton onClick={() => addNewLocation()}
                           endIcon={loading && <CircularProgress/>}
                           disabled={loading}
                           variant={'contained'}>{t('productionFloor.addGroup')}</PrimaryButton>
        </Stack>
    );
}

export {AddLocation}