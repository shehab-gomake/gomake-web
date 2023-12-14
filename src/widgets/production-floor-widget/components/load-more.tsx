import Stack from "@mui/material/Stack";
import {DotsLoader} from "@/components/dots-loader/dots-Loader";
import {useEffect} from "react";
import {getMoreBoardMissions} from "@/services/api-service/production-floor/production-floor-endpoints";
import {useGomakeAxios} from "@/hooks";

interface ILoadMoreProps {
    setHasMoreBoards: (hasMoreBoards: boolean) => void;
}

const LoadMore = ({setHasMoreBoards}: ILoadMoreProps) => {
    const {callApi} = useGomakeAxios();
    useEffect(() => {
        const callBack = (res) => {
            if (res?.success) {
                setHasMoreBoards(!!res?.data);
            }
        }
        getMoreBoardMissions(callApi, callBack).then();

    }, [])
    return (
        <Stack padding={'20px 0'} alignItems={'center'} justifyContent={'center'}>
            <DotsLoader/>
        </Stack>
    );
}

export {LoadMore}