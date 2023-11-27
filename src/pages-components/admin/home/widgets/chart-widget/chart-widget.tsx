import { BarChart } from '@/widgets/home/new-qoute/bar-chart';
import { useStyle } from './style';

const ChartWidget = () => {
    const { classes } = useStyle();
    return (
        <div style={classes.mainContainer}>
            <BarChart />
        </div>
    );
};

export { ChartWidget };
