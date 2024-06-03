import {useState} from "react";
import {useRecoilState} from "recoil";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {printHouseLocationsState} from "@/store/print-house-locations-state";
import {companyDeleteLocationApi, getCompanyLocationsApi} from "@/services/api-service/profiles/company-profile-api";

const usePrintHouseLocations = () => {
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [locations, setLocations] = useRecoilState(printHouseLocationsState);
    const {callApi} = useGomakeAxios();
    const {alertFaultDelete, alertSuccessDelete} = useSnackBar();
    const [deleting, setDeleting] = useState<string>('');
    const onDeleteLocation = async (locationId: string) => {
        setDeleting(locationId);
        const callBack = (res) => {
            setDeleting(locationId);
            if (res.success) {
                alertSuccessDelete();
                setLocations(locations?.filter(location => location.id !== locationId))
            } else {
                alertFaultDelete();
            }
        }
        await companyDeleteLocationApi(callApi, callBack, locationId)
    }

    const getLocations = async () => {
        const callBack = res => {
            if (res.success) {
                setLocations(res.data);
            }
        }
        await getCompanyLocationsApi(callApi, callBack);
    }
    return {
        openAddModal,
        setOpenAddModal,
        locations,
        onDeleteLocation,
        getLocations,
        deleting
    }
}

export {usePrintHouseLocations}