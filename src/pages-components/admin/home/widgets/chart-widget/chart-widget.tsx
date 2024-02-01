import { ActionProfitRowChartData } from '@/pages-components/products/profits-new/interface';
import { useStyle } from './style';
import { useTranslation } from 'react-i18next';
import { LineChart } from '@/pages-components/products/profits/widgets/line-chart';

const actionProfitRowChartData: ActionProfitRowChartData = {
    label:"Success rate",
    profitAxis: [10, 20, 30, 40],
    costAxis: [5, 15, 25, 35],
    quantityAxis: [50, 30, 20, 10],
};

const ChartWidget = () => {
    const { t } = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");
    const { classes } = useStyle(dir);
    return (
        <div style={classes.mainContainer}>
            <LineChart actionProfitRowChartData={actionProfitRowChartData} />
        </div>
    );
};

export { ChartWidget };
