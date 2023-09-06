import {useTranslation} from "react-i18next";
import {MachineLayout} from "@/widgets/machines/components/layout/machine-layout";
import {SideList} from "@/widgets/machines/components/side-list/side-list";
import {list} from "@/widgets/settings/side-list";
import {useEffect, useState} from "react";
import {IListItem} from "@/widgets/machines/components/side-list/interface";
import {useRouter} from "next/router";


const SettingsWidget = () => {
    const {t} = useTranslation();
    const {push, query} = useRouter();
    const {settingsRoute, id} = query;
    const [selected, setSelected] = useState<IListItem>();
    const onSelectItem = (value: string) => {
        const selectedItem = list.find(item => item.value === value);
        push('/settings/' + selectedItem.path).then();
    }

    useEffect(() => {
        if (settingsRoute) {
            const item = list.find(item => item.path === settingsRoute);
                if (id && !item.editComponent) {
                    push('/settings/' + item.path).then();
                }
                setSelected(!!item ? item : list[0]);
        }
    }, [settingsRoute, id])
    const Side = () => {
        return <SideList list={list.map(item => ({...item, text: t(item.text)}))} selectedItem={selected?.value} onSelect={onSelectItem}
                  title={t('settings.settings')}/>
    }
    return (
        <MachineLayout side={Side()} header={''} subHeader={''}>
            {
                selected && selected.component && !id &&<selected.component/>
            }
            {
                selected && selected.component && selected.editComponent && id &&<selected.editComponent/>
            }
        </MachineLayout>
    )
}

export {SettingsWidget}