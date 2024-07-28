import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {userProductionFloorGroupsState} from "@/widgets/production-floor/state/production-floor-groups-state";
import {deleteBoardMissionsGroup} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useGomakeAxios} from "@/hooks";
import {useRouter} from "next/router";

const useSelectGroup = () => {
    const [openAddGroupModal, setOpenAddGroupModal] = useState<boolean>(false);
    const [userGroups, setUserGroups] = useRecoilState(userProductionFloorGroupsState);
    const {callApi} = useGomakeAxios();
    const {push, query} = useRouter();
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const {groupsId} = query;
    const onSelectGroup = (groupId: string) => {
        if (groupId) {
            push('/production-floor?groupsId=' + groupId).then();
        }
    }
    const deleteGroup = async (groupId: string) => {
        const callBack = (res) => {
            if (res.success) {
                setUserGroups(userGroups?.filter(group => group.id !== groupId))
            } else {

            }
        }
        await deleteBoardMissionsGroup(callApi, callBack, groupId)
    }

    useEffect(() => {
        if (userGroups.length > 0 && !!groupsId) {
            setSelectedGroup(userGroups?.find(g => g.id === groupsId)?.groupName);
        } else {
         setSelectedGroup('');
        }
    }, [userGroups, groupsId])

    return {
        openAddGroupModal,
        setOpenAddGroupModal,
        userGroups,
        deleteGroup,
        onSelectGroup,
        groupsId,
        selectedGroup,
    }
}

export {useSelectGroup}