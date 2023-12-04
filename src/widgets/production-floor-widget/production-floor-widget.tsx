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
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";


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
        return "eyJraWQiOiJWSlRNcW1iMVdDQUkzaVNCUXJGbjFSRWRneGppRVFEMzhzR0doWVVjZnMwPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlMzA1NzQwZi02ZjA0LTQ1NDEtYTM1NS1iZTUxZjM1NzIxYmIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0zLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtM191T1lnY09FUkQiLCJjbGllbnRfaWQiOiI1M245ZTJoZ2hxcnNxMGtyaGxzaHIyNTFrNSIsIm9yaWdpbl9qdGkiOiI1ZWM5MTdlZC1hY2QzLTQ3NzMtOWU0MS1hMTQ5MmExMGJmYzUiLCJldmVudF9pZCI6IjhmOGE0MDdlLTI0MjYtNDg5MC04MzhiLTlmZDBjNTJhY2U4YyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MDE2Mjc5ODIsImV4cCI6MTcwMTcxNDM4MiwiaWF0IjoxNzAxNjI3OTgyLCJqdGkiOiIyZGMwZWNjNy1jOGJmLTRmMjktOWJiYi05ZWViN2RiNWJjZGMiLCJ1c2VybmFtZSI6ImUzMDU3NDBmLTZmMDQtNDU0MS1hMzU1LWJlNTFmMzU3MjFiYiJ9.yQTxhaqYGAdMYzdpT6aNdrcPYBvEriaftiy0bPA6-5ejqdX1ngUvHloBFpW1ruJGSnAQjFhfCyvs6j7GSQSv3BQLwXC0SmCuoeHl9ngWHsyvYfgP9V9trk_TG0suvB7ZvPKJsZQEZu-tJ_ab3go8cK-Hcto8MLpF5kTryGIJwWwVKs-U-s9gyYucr9LjR-k5Cs4djFlEHboZ2vXvsqn7nMF86nsvqiseCMppcJ6ICEiXC9yFT9IpfIw6VimSwFd5YFtfsq8uXEKuetn2b8LSfKk-cfvBmutLmZvb27dkTNc-2NRANHge5c9AM6iiY6JIXGHHovx622-mvMHY5at4YQ";
    }
    useEffect(() => {
        const connect = new HubConnectionBuilder()
            .withUrl("https://localhost:7125/boardMissions",{accessTokenFactory: () => getAccessToken()})
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