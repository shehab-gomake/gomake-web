import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { CharacterDetails } from '@/widgets/quote-new/quote-table/character-details';
import { useStyle } from './style';

interface IProps {
    key: string;
    item: any;
    index: number;
    parentIndex?: number;

}
const QuoteCard = ({ key, item, index, parentIndex }: IProps) => {
    const { classes } = useStyle();

    return (
        <Card sx={classes.cardContainer} key={key}>
            <Stack direction={'column'} alignItems={"flex-start"} gap={"16px"} >
                <CardContent sx={{ padding: "0px" }}>
                    <Typography sx={classes.headerStyle} >{"Item #" + (index + 1)}</Typography>
                    <Typography sx={classes.detailsStyle}>{"011 • Business Card"}</Typography>
                </CardContent>
                <Stack sx={classes.rowStyle}>
                    <Stack sx={{ padding: "0px" }} direction="column" spacing={0}>
                        <Typography sx={classes.headerStyle} >{"Amount"}</Typography>
                        <Typography sx={classes.detailsStyle}>{item?.quantity}</Typography>
                    </Stack>
                    <Stack sx={{ padding: "0px" }} direction="column" spacing={0}>                        <Typography sx={classes.headerStyle} >{"Discount"}</Typography>
                        <Typography sx={classes.detailsStyle}>{"10%"}</Typography>
                    </Stack>
                    <Stack sx={{ padding: "0px" }} direction="column" spacing={0}>                        <Typography sx={classes.headerStyle} >{"Unit price"}</Typography>
                        <Typography sx={classes.detailsStyle}>{"100.00 ILS"}</Typography>
                    </Stack>
                </Stack>
                <Stack sx={{ padding: "0px" }}>
                    <Typography sx={classes.headerStyle} >{"Final price"}</Typography>
                    <Typography sx={classes.detailsStyle}>{item?.finalPrice}</Typography>
                </Stack>
            </Stack>
            <CardContent sx={{ padding: "0px" }}>
                <Typography sx={classes.headerStyle}>Details</Typography>
                <CharacterDetails details={item?.details} showAllStyle={classes.showAll} detailsStyle={classes.detailsStyle} />
            </CardContent>
        </Card>
    )
};
export { QuoteCard };