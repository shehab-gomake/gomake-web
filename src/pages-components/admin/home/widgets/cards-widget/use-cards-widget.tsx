import { EStatisticsLabels } from "@/pages-components/quotes/enums";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import { useGomakeTheme } from "@/hooks/use-gomake-thme";


const useCardWidget = () => {
    const { primaryColor, secondColor, warningColor, successColor, errorColor, neutralColor } = useGomakeTheme();

    const documentStatisticsList = [
        {
            key: "successRate",
            value: "10"
        },
        {
            key: "waiting",
            value: "20"
        },
        {
            key: "successRate",
            value: "30"
        },
        {
            key: "waiting",
            value: "40"
        },
        {
            key: "approved",
            value: "50"
        },
        {
            key: "canceled",
            value: "60"
        }
    ]


    const getCardIcon = (cardKey: string) => {
        if (cardKey === EStatisticsLabels.SUCCESS_RATE) {
            return <TrendingUpIcon />;
        }
        if (cardKey === EStatisticsLabels.MONTHLY_PERFORMANCE) {
            return <HourglassTopIcon />;
        }
        if (cardKey === EStatisticsLabels.APPROVED) {
            return <HourglassTopIcon />;
        }
        if (cardKey === EStatisticsLabels.WAITING) {
            return <HourglassTopIcon />;
        }
        if (cardKey === EStatisticsLabels.ORDERS) {
            return <HourglassTopIcon />;
        }
        if (cardKey === EStatisticsLabels.CANCELED) {
            return <DoDisturbAltIcon />;
        }
    };

    const getCardColor = (cardKey: string) => {
        if (cardKey === EStatisticsLabels.SUCCESS_RATE) {
            return primaryColor(300);
        }
        if (cardKey === EStatisticsLabels.MONTHLY_PERFORMANCE) {
            return secondColor(200);
        }
        if (cardKey === EStatisticsLabels.APPROVED) {
            return successColor(300);
        }
        if (cardKey === EStatisticsLabels.WAITING) {
            return errorColor(300);
        }
        if (cardKey === EStatisticsLabels.ORDERS) {
            return warningColor(300);
        }
        if (cardKey === EStatisticsLabels.CANCELED) {
            return neutralColor(300);
        }
    };

    const getCardLabel = (cardKey: string) => {
        if (cardKey === EStatisticsLabels.SUCCESS_RATE) {
            return "sales.quote.successRate";
        }
        if (cardKey === EStatisticsLabels.MONTHLY_PERFORMANCE) {
            return "sales.quote.monthlyPerformance";
        }
        if (cardKey === EStatisticsLabels.APPROVED) {
            return "sales.quote.approved";
        }
        if (cardKey === EStatisticsLabels.WAITING) {
            return "sales.quote.waiting";
        }
        if (cardKey === EStatisticsLabels.ORDERS) {
            return "tabs.orders";
        }
        if (cardKey === EStatisticsLabels.CANCELED) {
            return "sales.quote.canceled";
        }
    };

    return {
        getCardIcon,
        getCardColor,
        getCardLabel,
        documentStatisticsList
    };
};

export { useCardWidget };
