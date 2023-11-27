import { BarChart } from '@/widgets/home/new-qoute/bar-chart';
import { useStyle } from './style';
import { useTranslation } from 'react-i18next';

const ChartWidget = () => {
    const { t } = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");
    const { classes } = useStyle(dir);
    return (
        <div style={classes.mainContainer}>
            <BarChart />
        </div>
    );
};

export { ChartWidget };
