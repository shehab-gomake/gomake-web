import { useCallback, useEffect } from "react";
import { useGomakeAxios } from "@/hooks";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { clientsState } from "@/store/clients-state";
import { Autocomplete, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import { selectedClientIdState } from "@/widgets/clients/state/selected-client-id";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { AccountCircle } from "@mui/icons-material";



const Input = styled(TextField)(() => {
    const { primaryColor } = useGomakeTheme();
    return {
        input: {
            backgroundColor: "#FFFFFF",
            boxSizing: "border-box",
            borderRadius: '10px',
            fontFamily: "Jost",
            fontStyle: "normal",
            fontWeight: 300,
            fontSize: 14,
            lineHeight: "21px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            color: primaryColor(500),
        },

        "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
                border: `2px solid ${primaryColor(500)}`

            },
            "& fieldset": {
                border: `1px solid ${primaryColor(500)}`,
                boxSizing: "border-box",
                borderRadius: 10,
                width: "100%",
            },
            "&.Mui-focused fieldset": {
                borderColor: primaryColor(500),
                borderRadius: 10,
                width: "100%",
            },
        },
        '& .MuiInputBase-root': {
            height: 40
        },
    }
});

const AutoSearch = styled(Autocomplete)(() => {
    return {
        '& .MuiAutocomplete-root,': {
            width: '200px',
            border: 0,

        }
    }
});
const ClientsList = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const setClients = useSetRecoilState(clientsState);
    const clients = useRecoilValue(clientsState);
    const setSelectedClientId = useSetRecoilState(selectedClientIdState);

    useEffect(() => {
        callApi('GET', '/clients', {}, true, true).then((res) => {
            if (res && res.success) {
                setClients(res.data);
            }
        })
    }, [])

    const getClientsList = useCallback(() => {
        return clients.map(client => ({ label: client.code + ' - ' + client.name, id: client.id }))
    }, [clients]);

    const handleChange = (event: object, value: any) => {
        setSelectedClientId(value?.id);
    }
    return (
        <div>
            <AutoSearch
                fullWidth={true}
                forcePopupIcon={false}
                onChange={handleChange}
                renderInput={(params) => <Box sx={{ position: 'relative' }}>
                    <Input {...params} placeholder={t('dashboard-widget.clients') as string} />
                    <AccountCircle sx={{ position: 'absolute', left: '5px', top: '8px', color: 'action.active' }} />
                </Box>}
                options={getClientsList()} />
        </div>
    );
};

export { ClientsList }


