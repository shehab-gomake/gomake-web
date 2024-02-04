import { EStatisticsLabels } from "@/pages-components/quotes/enums";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { PerformanceIcon } from "@/icons/performance";
import { OrderBoxIcon } from "@/icons/order-box";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";


const useCardWidget = () => {
    const { primaryColor, secondColor, warningColor, successColor, errorColor, neutralColor } = useGomakeTheme();


    const getCardIcon = (cardKey: string) => {
        if (cardKey === EStatisticsLabels.SUCCESS_RATE) {
            return <TrendingUpIcon />;
        }
        if (cardKey === EStatisticsLabels.MONTHLY_PERFORMANCE) {
            return <PerformanceIcon color={"#FFFFFF"} />;
        }
        if (cardKey === EStatisticsLabels.APPROVED) {
            return <DoneAllIcon />;
        }
        if (cardKey === EStatisticsLabels.PENDING) {
            return <HourglassTopIcon />;
        }
        if (cardKey === EStatisticsLabels.ORDERS) {
            return <OrderBoxIcon color={"#FFFFFF"} />;
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
        if (cardKey === EStatisticsLabels.PENDING) {
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
        if (cardKey === EStatisticsLabels.PENDING) {
            return "sales.quote.pending";
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
        getCardLabel
    };
};

export { useCardWidget };