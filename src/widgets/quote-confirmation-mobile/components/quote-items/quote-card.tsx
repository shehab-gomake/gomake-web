import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { CharacterDetails } from '@/widgets/quote-new/quote-table/character-details';
import { useStyle } from './style';
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";
import { useQuoteGetData } from '@/pages-components/quote-new/use-quote-get-data';
import { useRecoilValue } from 'recoil';
import { quoteItemState } from '@/store';
import { useTranslation } from "react-i18next";

interface IProps {
    key: string;
    item: any;
    index: number;
    parentIndex?: number;

}
const QuoteCard = ({ key, item, index, parentIndex }: IProps) => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const { getCurrencyUnitText } = useQuoteGetData();
    const quoteStateValue = useRecoilValue<any>(quoteItemState);

    return (
        <Card sx={classes.cardContainer} key={key}>
            <Stack direction={'column'} alignItems={"flex-start"} gap={"16px"} >
                <Stack sx={{ padding: "0px" }} direction="column" spacing={"4px"}>
                    <Stack sx={classes.firstHeader}>
                        <Checkbox
                            icon={<CheckboxIcon />}
                            checkedIcon={<CheckboxCheckedIcon />}
                            style={{ padding: "0px" }}
                        />
                        <Typography sx={classes.headerStyle} >{t("sales.quote.item")+" #" + (index + 1)}</Typography>
                    </Stack>
                    <Typography sx={classes.detailsStyle}>{ "011" + " • " + item?.productName}</Typography>
                </Stack>
                <Stack sx={classes.rowStyle}>
                    <Stack sx={{ padding: "0px" }} direction="column" spacing={0}>
                        <Typography sx={classes.headerStyle} >{t("sales.quote.amount")}</Typography>
                        <Typography sx={classes.detailsStyle}>{item?.quantity}</Typography>
                    </Stack>
                    <Stack sx={{ padding: "0px" }} direction="column" spacing={0}>
                        <Typography sx={classes.headerStyle} >{t("sales.quote.discount")}</Typography>
                        <Typography sx={classes.detailsStyle}>{item?.discount ? item?.discount + "%" : "0%"}</Typography>
                    </Stack>
                    <Stack sx={{ padding: "0px" }} direction="column" spacing={0}>
                        <Typography sx={classes.headerStyle} >{t("products.profits.pricingListWidget.unitPrice")}</Typography>
                        <Typography sx={classes.detailsStyle}>{item?.price +" "+ getCurrencyUnitText(quoteStateValue?.currency)}</Typography>
                    </Stack>
                </Stack>
                <Stack sx={{ padding: "0px" }}>
                    <Typography sx={classes.headerStyle} >{t("products.offsetPrice.admin.finalPrice")}</Typography>
                    <Typography sx={classes.detailsStyle}>{item?.finalPrice +" "+ getCurrencyUnitText(quoteStateValue?.currency)}</Typography>
                </Stack>
            </Stack>
            <CardContent sx={{ padding: "0px" }}>
                <Typography sx={classes.headerStyle}>{t("products.addProduct.admin.details")}</Typography>
                <CharacterDetails details={item?.details} showAllStyle={classes.showAll} detailsStyle={classes.detailsStyle} />
            </CardContent>
        </Card>
    )
};
export { QuoteCard };