import { type DataChartType } from '.';
import ColumnChart from './ColumnChart';

const LineChart = (props: DataChartType) => {
	return <ColumnChart {...props} type='area' />;
};

export default LineChart;
