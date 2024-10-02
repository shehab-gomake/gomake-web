import { useGomakeAxios } from "@/hooks";
import { useCallback, useEffect } from "react";
import { SelectComponent } from "@/widgets/production-floor/filters/select/select-component";
import { useRecoilState } from "recoil";
import { dashboardClientsState } from "@/widgets/dashboard-widget/clients/clients-state";
import { FONT_FAMILY } from "@/utils/font-family";
import { getAndSetAllCustomers } from "@/services/hooks";
import { useDebouncedCallback } from "use-debounce";

const DashboardClientsList = () => {
    const { callApi } = useGomakeAxios();
    const [clients, setClients] = useRecoilState(dashboardClientsState);
    useEffect(() => {
        getClients()
    }, []);
    const getClients = useCallback(async (SearchTerm?) => {
        await getAndSetAllCustomers(callApi, setClients, {
            clientType: "C",
            searchTerm: SearchTerm,
            onlyCreateOrderClients: true,
        });
    }, []);
    const debouncedGetClients = useDebouncedCallback((e) => {
        getClients(e);
    }, 700);

    const checkWhatRenderArray = (e) => {
        debouncedGetClients(e);
    };

    const getClientsList = useCallback(() => {
        return clients.map(client => ({ name: client.name + ' - ' + client.code, id: client.id, checked: client.checked }))
    }, [clients]);

    const handleChange = (v: string) => {
        setClients(clients?.map(client => v === client.id ? { ...client, checked: !client.checked } : client));
    }
    return (
        <div>
            <SelectComponent style={{
                width: '163px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid rgba(208, 213, 221, 1)',
                backgroundColor: '#FFF',
                ...FONT_FAMILY.Lexend(500,16),
                cursor: 'pointer',
                color: 'rgba(52, 64, 84, 1)',
                display: 'flex',
                alignItems: 'center' as 'center',
                justifyContent: 'center' as 'center',
                gap: '4px',
                textTransform: 'none' as 'none',
                boxShadow: 'none'
            }} buttonLabel={'dashboard-widget.clients'} list={getClientsList()} onChange={handleChange} checkWhatRenderArray={checkWhatRenderArray} />
        </div>
    );
};

export { DashboardClientsList }


