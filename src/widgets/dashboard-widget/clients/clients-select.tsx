import {useGomakeAxios} from "@/hooks";
import {useCallback, useEffect} from "react";
import {SelectComponent} from "@/widgets/production-floor/filters/select/select-component";
import {useRecoilState} from "recoil";
import {dashboardClientsState} from "@/widgets/dashboard-widget/clients/clients-state";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const DashboardClientsList = () => {
    const { callApi } = useGomakeAxios();
    const [clients, setClients] = useRecoilState(dashboardClientsState);

    useEffect(() => {
        getClients().then((res) => {
            setClients(res?.data?.data?.data?.map(client => ({...client, checked: true})));
        });
    }, []);
    const getClients = async () => {
        return await callApi(
            "GET",
            "/v1/crm-service/customer/get-all-customers?ClientType=C&onlyCreateOrderClients=true"
        );
    };
    const getClientsList = useCallback(() => {
        return clients.map(client => ({ name: client.name + ' - ' + client.code, id: client.id, checked: client.checked }))
    }, [clients]);

    const handleChange = (v: string) => {
        setClients(clients?.map(client => v === client.id ? {...client, checked: !client.checked} : client));
    }
    const {primaryColor, neutralColor} = useGomakeTheme();
    return (
        <div>
            <SelectComponent style={{
                backgroundColor: neutralColor(100),
                boxShadow: '0px 4px 90px rgba(135, 130, 130, 0.2)',
                borderRadius: '10px',
                color: primaryColor(700),
                width: '190px',
                maxWidth: '200px',
                height: '44px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                ...FONT_FAMILY.Lexend(500, 12)
            }} buttonLabel={'dashboard-widget.clients'} list={getClientsList()} onChange={handleChange}/>
        </div>
    );
};

export { DashboardClientsList }


