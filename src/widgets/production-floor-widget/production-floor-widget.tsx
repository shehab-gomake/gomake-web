import {useProductionFloor} from "@/widgets/production-floor-widget/use-production-floor";
import {useCallback, useEffect, useState} from "react";
import {SecondaryTable} from "@/components/tables/secondary-table";
import {Button, ButtonGroup} from "@mui/material";
import Stack from "@mui/material/Stack";
import {SearchInputComponent} from "@/components/form-inputs/search-input-component";
import {SelectComponent} from "@/widgets/production-floor-widget/components/select";
import {GoMakeModal} from "@/components";
import {useRouter} from "next/router";
import {ProductId} from "@/widgets/production-floor-widget/product-id-widget/product-id";
import {StatusesButtonsComponent} from "@/widgets/production-floor-widget/production-statuses/production-statuses";
import {GoMakeDatepicker} from "@/components/date-picker/date-picker-component";
import {HttpTransportType, HubConnection, HubConnectionBuilder} from "@microsoft/signalr";


const ProductionFloorWidget = () => {
    const {tableHeaders, getWorkJobs, getWorkJobsRows, demo, product} = useProductionFloor();
    const [viewType, setViewType] = useState<1 | 2>(1);
    const {query, replace} = useRouter();
    const productId = query?.productId;
    const openModal = useCallback(() => {
        return !!productId
    }, [productId]);
    const [connection, setConnection] = useState<null | HubConnection>(null);
    useEffect(() => {
        getWorkJobs().then();
    }, []);
    const getAccessToken = ()=>{
        return "eyJraWQiOiJWSlRNcW1iMVdDQUkzaVNCUXJGbjFSRWRneGppRVFEMzhzR0doWVVjZnMwPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlMzA1NzQwZi02ZjA0LTQ1NDEtYTM1NS1iZTUxZjM1NzIxYmIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0zLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtM191T1lnY09FUkQiLCJjbGllbnRfaWQiOiI1M245ZTJoZ2hxcnNxMGtyaGxzaHIyNTFrNSIsIm9yaWdpbl9qdGkiOiI4ZWNiOTQ2MS04ZWIzLTQxZjMtYTYxMi1kZTdlYWMyZTg1ZTQiLCJldmVudF9pZCI6IjUwMzExMjMxLTkwOWQtNDY4Yy1hN2RkLTA2OGJiMzVmZmQ3NiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MDE4NTUzNDEsImV4cCI6MTcwMTk0MTc0MSwiaWF0IjoxNzAxODU1MzQxLCJqdGkiOiIzYjRhZGEzNC05YTc4LTQ1OTMtODM5Yi1iYTlhZDcyZTQ3NzQiLCJ1c2VybmFtZSI6ImUzMDU3NDBmLTZmMDQtNDU0MS1hMzU1LWJlNTFmMzU3MjFiYiJ9.CjnsRlHHQ-PpLz44cDiowrry7FO8TizhW-JBRuLglnovJ3UEfTQs4GrqLxwA4JdEY_EE7H9iVlOlAXSnNH27Mp5f8vrWRygT11Cq0zxglqbK41kV1cIfFbWLtZjGTsJARA5dt0-k8jfAKILqYG2-EAkqTdwz3bi1BCdNdlZvr8hxq5k1dEyur9IWBUwGQPw7ebCUpToJmt4yZsY7W33wuhe6pygUmAKvY1KN8smHvV1vKfjleDBTVqM9J4p-4MpAcuLvYwFoUgi3T_FzICtW67tQz33TXEBtsQ2IKwMM1kvkjJhUzWdHVnBMG0iFNpOcQGo9apiPUehCk3GYSAgDwQ";
    }
    useEffect(() => {
        const connect = new HubConnectionBuilder()
            .withUrl("http://gomake-erp-service-dev.eu-west-3.elasticbeanstalk.com/hubs/boardMissions",{accessTokenFactory: () => getAccessToken()})
            .withAutomaticReconnect()
            .build();

        setConnection(connect);
    }, []);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    connection.on("AddBoardMissions", (data) => {
                        alert(JSON.stringify(data))
                    });
                })
                .catch((error) => alert(JSON.stringify(error)));
        }
    }, [connection]);
    const handleModalClose = () => {
        replace('/production-floor').then();
    }

    const handleScroll = () => {
            getWorkJobs().then()
    }

    return (
        <Stack direction={'column'} gap={'5px'}>
            <Stack direction={'row'} justifyContent={'space-between'} padding={'10px 0'}>
                <ButtonGroup>
                    <Button variant={viewType === 1 ? 'contained' : 'text'}
                            onClick={() => setViewType(1)}>table</Button>
                    <Button variant={viewType === 2 ? 'contained' : 'text'}
                            onClick={() => setViewType(2)}>kanban</Button>
                </ButtonGroup>
                <Stack direction={'row'} gap={'10px'} alignItems={'center'}>
                    <SelectComponent buttonLabel={'employee'} list={demo}/>
                    <GoMakeDatepicker/>
                    <SearchInputComponent onChange={() => {
                    }}/>
                </Stack>
            </Stack>
            <StatusesButtonsComponent/>
            <Stack>
                {
                    viewType === 1 &&
                    <SecondaryTable onScrolledBottom={handleScroll} rows={getWorkJobsRows()} headers={tableHeaders}/>
                }
                {
                    viewType === 2 && <div>coming soon ...</div>
                }
            </Stack>
            <GoMakeModal insideStyle={{width: '80vw'}} openModal={openModal() && !!product()} onClose={handleModalClose}
                         modalTitle={'title'}>
                <ProductId product={product()}/>
            </GoMakeModal>
        </Stack>
    )
}

export {ProductionFloorWidget}