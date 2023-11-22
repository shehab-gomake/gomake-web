import { BarChart } from '@mui/x-charts/BarChart';
import { useStyle } from './style';
import { Bar , Line } from 'react-chartjs-2';


const ChartWidget = () => {
    const { classes } = useStyle();

  
      
    return (
        <div style={classes.mainContainer}>
       {/* <BarChart
            xAxis={[
                {
                    id: 'barCategories',
                    data: ['M', 'T', 'W', 'Th', 'F', 'S'],
                    scaleType: 'band',
                },
            ]}
            series={[
                {
                    data: [0, 0, 0, 0, 0, 0],
                },
                {
                    data: [200, 300, 150, 230, 280, 50],
                },
                {
                    data: [0, 0, 0, 0, 0, 0],
                },

            ]}

            width={600}
            height={300}
            colors={['#F89AD1']} 
        /> */}
       
    </div>

    );
};

export { ChartWidget };
