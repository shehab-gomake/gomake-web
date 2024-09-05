import Stack from "@mui/material/Stack";
import {Divider, Skeleton} from "@mui/material";

const MessengerWaitingComponent = () => {
    return <Stack style={{backgroundColor: '#FFF'}} gap={'5px'} direction={'row'} width={'100%'}
                  height={'100%'}>
        <Stack>
            <Skeleton variant={'rounded'} width={350} height={'100%'}/>
        </Stack>
        <Stack width={'100%'} height={'100%'} gap={'10px'}>
            <Skeleton variant={'rounded'} height={100}/>
            <Divider/>
            <Skeleton variant={'rounded'} width={'100%'} height={'100%'}/>
        </Stack>
    </Stack>
}
export {MessengerWaitingComponent}