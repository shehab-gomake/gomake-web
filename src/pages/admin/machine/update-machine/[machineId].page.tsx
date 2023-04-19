import {AdminAuthLayout} from "@/layouts";
import {UpdateMachine} from "@/widgets/admin-machines/add-machine/update-machine";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {useGomakeAxios} from "@/hooks";
import {useSetRecoilState} from "recoil";
import {machineState} from "@/widgets/admin-machines/state/machine-state";

export default function UpdateMachinePage() {
    const setState = useSetRecoilState(machineState);
    const {callApi} = useGomakeAxios();
    const router = useRouter();
    const {machineId} = router.query;
    useEffect(() => {
            callApi('GET', `/v1/administrator/machine/${machineId}`).then((res) => {
                setState(res?.data?.data?.data)
            })

    }, [machineId])
    return (
        <AdminAuthLayout>
            <UpdateMachine/>
        </AdminAuthLayout>
    );
}