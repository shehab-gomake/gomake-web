import Stack from "@mui/material/Stack";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

interface IProps {
    users: string[];
}

const UsersNamesComponent = ({users}: IProps) => {
    const {primaryColor} = useGomakeTheme();
    return <Stack direction={'row'} gap={'3px'}>
        {
            users?.map((user, index) => <Stack key={user} direction={'row'} gap={'1px'} style={{
                ...FONT_FAMILY.Outfit(500, 13),
                fontStyle: 'italic',
                color: primaryColor(300)
            }}>
                <span>{user}</span>
                {index + 1 < users.length && <span>,</span>}
            </Stack>)
        }
    </Stack>
}

export {UsersNamesComponent}