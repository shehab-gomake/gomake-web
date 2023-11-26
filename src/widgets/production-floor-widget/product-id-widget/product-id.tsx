import {IBoard} from "@/widgets/production-floor-widget/interface";
import {DateFormatterDDMMYYYY} from "@/utils/adapter";
import Stack from "@mui/material/Stack";
import {useMemo} from "react";
import {PrimaryTabs, PrimaryTabsComponent} from "@/components/tabs/primary-tabs";
import {EActivityType} from "@/widgets/production-floor-widget/enums";
import {ActivitiesComponent, IActivity} from "@/widgets/production-floor-widget/components/activities-component";
import Button from "@mui/material/Button";

const ac: IActivity[] = [
    {
        id: '1',
        type: EActivityType.ALL,
        description: 'A prepress station has been sent and marked as ready',
        date: new Date("2023-10-04T08:00:00")
    },
    {
        id: '1',
        type: EActivityType.ALL,
        description: 'A prepress station has been sent and marked as ready',
        date: new Date("2023-10-04T08:00:00")
    },
    {
        id: '1',
        type: EActivityType.ALL,
        description: 'A prepress station has been sent and marked as ready',
        date: new Date("2023-10-04T08:00:00")
    },
    {
        id: '1',
        type: EActivityType.ALL,
        description: 'A prepress station has been sent and marked as ready',
        date: new Date("2023-10-04T08:00:00")
    },
    {
        id: '1',
        type: EActivityType.ALL,
        description: 'A prepress station has been sent and marked as ready',
        date: new Date("2023-10-04T08:00:00")
    },
]
interface IProductProps {
    product: IBoard
}

const ProductId = ({product}: IProductProps) => {
    const activitiesTabs = [{title: 'all'}, {title: 'comments'}, {title: 'logs'}, {title: 'customer'}];
    const generalDetails = useMemo(() => {
        return [
            {label: 'Job title', value: '3'},
            {label: 'Size', value: 'A4|29.7/21'},
            {label: 'Sub product', value: 'printed pages'},
            {label: 'Quantity', value: '100'},
            {label: 'Printing', value: 'tow sides'},
            {label: 'Paper size', value: 'quarter sheet'},

        ]
    }, [product])
    return (
        <Stack overflow={'hidden'} maxHeight={'100%'} direction={'row'} padding={2} gap={'14px'}>
            <Stack gap={'16px'} overflow={'auto'}>
                <Stack width={'65%'} maxWidth={'65%'}>
                    <h4>Task info</h4>
                    <h3>{`${product?.productName} | ${product?.workOrder} | ${product?.boardMissionNumber}/${product?.orderNumber} `}</h3>
                    <small>Started on {DateFormatterDDMMYYYY(product?.startDate?.toString())}</small>
                </Stack>
                <Stack gap={'19px'} padding={'12px 9px'} boxShadow={'0px 4px 40px 0px rgba(0, 0, 0, 0.08)'}>
                    <h3>General Details</h3>
                    <Stack direction={'row'} gap={'50px'} flexWrap={'wrap'}>
                        {generalDetails.map((item) => <Stack direction={'row'} gap={'16px'}>
                            <span>{item.label}</span>
                            <span>{item.value}</span>
                        </Stack>)}
                    </Stack>
                </Stack>
                {
                    [1,2,3,4,5,6,7].map(_ => <Stack direction={'row'} gap={20} padding={1} boxShadow={'0px 4px 40px 0px rgba(0, 0, 0, 0.08)'}>
                        <span>Next station</span>
                        <span>Internal printing Digital printing sheets/brochures</span>
                    </Stack>)
                }
            </Stack>
            <Stack padding={'12px 9px'} width={'35%'} >
                <Stack direction={'row'} minHeight={'200px'}>
                    <Button>demo</Button>
                    <Button>demo</Button>
                    <Button>demo</Button>
                </Stack>
                <Stack overflow={'auto'} padding={'0px 8px 0 8px'}  boxShadow={'0px 4px 40px 0px rgba(0, 0, 0, 0.08)'}>
                    <h3>Activities</h3>
                    <PrimaryTabsComponent tabs={activitiesTabs}/>
                    <ActivitiesComponent activities={[...ac, ...ac, ...ac, ...ac]}/>
                </Stack>
            </Stack>
        </Stack>
    )
}


export {ProductId}