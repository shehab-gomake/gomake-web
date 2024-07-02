import {useGomakeAxios} from "@/hooks";
import {addNewBoardMissionsGroup,} from "@/services/api-service/production-floor/production-floor-endpoints";
import {EStatementCategory} from "@/widgets/production-floor/enums/statement-category";
import {IInput} from "@/components/form-inputs/interfaces";
import {useEffect, useState} from "react";
import {IUserProductionFloorGroup} from "@/widgets/production-floor/interfaces/production-floor-group";
import {getAllOutputs, getAllParameters} from "@/services/api-service/parameters/parameters-outputs";
import {useRecoilState} from "recoil";
import {userProductionFloorGroupsState} from "@/widgets/production-floor/state/production-floor-groups-state";

const useAddGroup = () => {
    const {callApi} = useGomakeAxios();
    const [selectedStatementCategory, setSelectedStatementCategory] = useState<EStatementCategory>();
    const [newGroup, setNewGroup] = useState<IUserProductionFloorGroup>({} as IUserProductionFloorGroup);
    const [statementIdOptions, setStatementIdOptions] = useState<{ text: string; value: string }[]>([]);
    const [useGroups, setUserGroups] = useRecoilState(userProductionFloorGroupsState);
    const categories = [
        {value: EStatementCategory.MACHINE, text: 'machine'},
        {value: EStatementCategory.MACHINE_CATEGORY, text: 'machine category'},
        {value: EStatementCategory.CLIENT_TYPE, text: 'client type'},
        {value: EStatementCategory.CLIENT, text: 'client'},
        {value: EStatementCategory.PARAMETER, text: 'parameter'},
        {value: EStatementCategory.OUTPUT, text: 'output'},
        {value: EStatementCategory.PRODUCT, text: 'product'},
        {value: EStatementCategory.STATIONS, text: 'stations'},
    ];
    const categoriesHasStatementIdOptions = [EStatementCategory.PARAMETER, EStatementCategory.OUTPUT];
    const inputs = [{
        label: 'productionFloor.name',
        type: 'text',
        value: newGroup?.groupName,
        parameterKey: 'groupName',
        options: categories,
        disableClearable: true,
        placeholder: 'productionFloor.name'
    },
        {
            label: 'productionFloor.category',
            type: 'select',
            value: newGroup?.statementCategory,
            parameterKey: 'statementCategory',
            options: categories,
            disableClearable: true,
            placeholder: 'productionFloor.category'
        },
        {
            label: 'productionFloor.statement',
            type: 'select',
            value: newGroup?.statementId,
            parameterKey: 'statementId',
            options: statementIdOptions,
            disableClearable: true,
            placeholder: 'productionFloor.statement',
            disabled: !categoriesHasStatementIdOptions.includes(newGroup.statementCategory)
        }
    ] as IInput[]
    const addNewGroup = async (afterAdd: () => void) => {
        if (categoriesHasStatementIdOptions.includes(newGroup.statementCategory) && !newGroup.statementId) {
            return;
        }
        const callBack = (res) => {
            if (res.success) {
                afterAdd();
                setUserGroups(useGroups.concat(res?.data));
                setNewGroup({} as IUserProductionFloorGroup);
            } else {

            }
        }
        const name = newGroup.groupName ? newGroup.groupName :
            newGroup.statementId ? statementIdOptions.find(s => newGroup.statementId === s.value)?.text :
                categories.find(c => newGroup.statementCategory === c.value)?.text
        await addNewBoardMissionsGroup(callApi, callBack, categoriesHasStatementIdOptions.includes(newGroup.statementCategory) ? {
            statementCategory: newGroup.statementCategory,
            groupName: name,
            statementId: newGroup.statementId
        } : {
            statementCategory: newGroup.statementCategory,
            groupName: name,
        })
    }

    const onFormChange = (key: keyof IUserProductionFloorGroup, value) => {
        setNewGroup(prevState => ({
            ...prevState,
            [key]: value
        }));
        if (key === 'statementCategory') {
            setNewGroup(prevState => ({...prevState, statementId: ''}))
        }
    }

    useEffect(() => {
        const callBack = res => {
            if (res.success) {
                setStatementIdOptions(res?.data?.map(option => ({text: option.name, value: option?.id})))
            }
        }
        if (newGroup.statementCategory === EStatementCategory.PARAMETER) {
            getAllParameters(callApi, callBack).then();
        }
        if (newGroup.statementCategory === EStatementCategory.OUTPUT) {
            getAllOutputs(callApi, callBack).then();
        }
    }, [newGroup.statementCategory])


    return {
        addNewGroup,
        categories,
        inputs,
        setSelectedStatementCategory,
        selectedStatementCategory,
        onFormChange
    }
}

export {useAddGroup}